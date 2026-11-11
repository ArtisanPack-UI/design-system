<?php

/**
 * API parity against the manifest, for Blade.
 *
 * @package    ArtisanPack_UI
 * @subpackage DesignSystem
 *
 * @since      1.0.0
 */

declare( strict_types=1 );

namespace ArtisanPackUI\DesignSystem\Testing;

use ArtisanPackUI\DesignSystem\Manifest\ComponentManifest;
use ArtisanPackUI\DesignSystem\Manifest\ManifestRepository;
use DOMDocument;
use DOMElement;
use DOMNode;
use DOMXPath;
use Illuminate\Support\Facades\Blade;
use Illuminate\View\View;
use ReflectionClass;
use Throwable;

/**
 * The Livewire side of the parity checks (#41). Runs the same checks as
 * `src/parity.ts` with the same messages, plus the props the Blade component
 * class declares and the events its source dispatches.
 *
 * ```php
 * it( 'matches its manifest', function ( string $component ): void {
 *     expect( $component )->toMatchManifest();
 * } )->with( ManifestParity::targets() );
 * ```
 *
 * @package    ArtisanPack_UI
 * @subpackage DesignSystem
 *
 * @since      1.0.0
 */
final class ManifestParity
{
	/**
	 * Events each behavior widget's Alpine adapter dispatches itself, so a
	 * view that mounts the widget emits them without a `$dispatch` of its own.
	 *
	 * @since 1.0.0
	 *
	 * @var array<string, list<string>>
	 */
	public const WIDGET_EVENTS = [
		'apuiDialog'       => [ 'open-change' ],
		'apuiDropdownMenu' => [ 'open-change', 'select', 'checked-change' ],
		// Its value-change is `wire:model`, found through `$wire.entangle(`.
		'apuiCombobox'     => [ 'open-change', 'search-change', 'create' ],
		'apuiSpotlight'    => [ 'open-change', 'select', 'search-change' ],
		// Its value-change is `wire:model`, found through `$wire.entangle(`.
		'apuiDatePicker'   => [ 'open-change' ],
		// Its value-change is `wire:model`, found through `$wire.entangle(`.
		'apuiColorPicker'  => [ 'open-change', 'format-change' ],
	];

	/**
	 * A native form control that receives the component's attributes, so a
	 * `wire:model` on the component binds to it natively (Input, Select,
	 * Checkbox).
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private const NATIVE_MODEL = '/<(?:input|select|textarea)\b[^>]*__APUI_ATTRIBUTES__/';

	/**
	 * `$attributes` reads that return a value rather than echo the attributes.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private const ATTRIBUTE_READS = '/^\$attributes\s*->\s*(?:get|has|hasAny|missing|wire|first|isEmpty|isNotEmpty|count)\b/';

	/**
	 * Enum props that must be emitted as `data-<name>` on the root.
	 *
	 * @since 1.0.0
	 *
	 * @var list<string>
	 */
	public const DATA_ATTRIBUTE_PROPS = [ 'variant', 'color', 'size', 'surface', 'orientation' ];

	/**
	 * What counts as evidence of a state prop, anywhere in the component.
	 *
	 * @since 1.0.0
	 *
	 * @var array<string, list<string>>
	 */
	public const STATE_EVIDENCE = [
		'disabled'      => [ 'disabled', 'data-disabled', 'aria-disabled=true' ],
		'invalid'       => [ 'data-invalid', 'aria-invalid=true' ],
		'loading'       => [ 'aria-busy=true', 'data-loading' ],
		'readonly'      => [ 'readonly', 'data-readonly', 'aria-readonly=true' ],
		'checked'       => [ 'checked', 'data-checked', 'aria-checked=true', 'data-state=checked' ],
		'indeterminate' => [ 'data-indeterminate', 'aria-checked=mixed', 'data-state=indeterminate' ],
		'selected'      => [ 'data-selected', 'aria-selected=true', 'data-state=selected' ],
		'open'          => [ 'open', 'data-state=open', 'aria-expanded=true' ],
	];

	/**
	 * Attributes whose values are generated ids, ignored when comparing markup.
	 *
	 * @since 1.0.0
	 *
	 * @var list<string>
	 */
	private const ID_ATTRIBUTES = [
		'id',
		'for',
		'aria-controls',
		'aria-labelledby',
		'aria-describedby',
		'aria-owns',
		'aria-activedescendant',
		'aria-errormessage',
		'wire:key',
	];

	/**
	 * Creates the checker.
	 *
	 * @since 1.0.0
	 *
	 * @param  ComponentManifest $manifest The component's manifest.
	 */
	public function __construct( private readonly ComponentManifest $manifest )
	{
	}

	/**
	 * Components a Livewire suite should check: those that ship in Livewire
	 * (D-003) and are past `planned`, as a Pest dataset.
	 *
	 * @since 1.0.0
	 *
	 * @param  ManifestRepository|null $manifests The manifests. Defaults to the package's.
	 *
	 * @return array<string, array{0: string}> Component names, keyed by name.
	 */
	public static function targets( ?ManifestRepository $manifests = null ): array
	{
		$manifests ??= ManifestRepository::fromFile();
		$targets     = [];
		foreach ( $manifests->forStack( 'livewire' ) as $name => $manifest ) {
			if ( 'planned' !== $manifest->status ) {
				$targets[ $name ] = [ $name ];
			}
		}

		return $targets;
	}

	/**
	 * Checks the registered `x-artisanpack-*` component against its manifest:
	 * the rendered markup, the props its class declares and the events its
	 * source dispatches.
	 *
	 * @since 1.0.0
	 *
	 * @param  ComponentManifest                                                                    $manifest The manifest.
	 * @param  array{ignoreEffects?: list<string>, ignoreDeclared?: list<string>, declared?: false} $options  Exemptions; `declared: false` skips the declared check for an anonymous component.
	 *
	 * @return list<string> The problems, empty when the component is in parity or doesn't ship in Livewire.
	 */
	public static function forBlade( ComponentManifest $manifest, array $options = [] ): array
	{
		if ( ! $manifest->shipsIn( 'livewire' ) ) {
			return [];
		}

		$name   = $manifest->stacks['livewire']['name'];
		$class  = Blade::getClassComponentAliases()[ 'artisanpack-' . $name ] ?? null;
		$parity = new self( $manifest );

		$declared = [];
		$missing  = [];
		if ( is_string( $class ) && class_exists( $class ) ) {
			$declared = [
				'props'  => self::declaredProps( $class ),
				'events' => self::dispatchedEvents( self::sources( $class ) ),
			];
		} elseif ( false !== ( $options['declared'] ?? true ) ) {
			$missing[] = sprintf( 'declared: no class component is registered for <x-artisanpack-%s>, so its props and events can\'t be checked', $name );
		}

		return array_merge(
			$parity->check(
				static fn ( array $props, ?string $content ): string => BladeFixtureHost::renderComponent( $name, $props, $content ),
				[ 'declared' => $declared ] + $options,
			),
			$missing,
		);
	}

	/**
	 * Runs the checks against a renderer.
	 *
	 * @since 1.0.0
	 *
	 * @param  callable(array<string, mixed>, string|null): string                                                                           $render  Renders the component with manifest-named props.
	 * @param  array{ignoreEffects?: list<string>, ignoreDeclared?: list<string>, declared?: array{props?: list<string>, events?: list<string>}} $options Exemptions and the declared API.
	 *
	 * @return list<string> The problems, in the same order and wording as the TypeScript checks.
	 */
	public function check( callable $render, array $options = [] ): array
	{
		$manifest = $this->manifest;
		if ( ! $manifest->shipsIn( 'livewire' ) ) {
			return [];
		}

		$problems = [];
		$props    = $manifest->propsFor( 'livewire' );
		$content  = $manifest->fixture['content'] ?? null;
		$base     = $manifest->fixture['props'] ?? [];
		foreach ( $props as $prop ) {
			if ( ( $prop['required'] ?? false ) && ! array_key_exists( $prop['name'], $base ) ) {
				$base[ $prop['name'] ] = $this->sampleValue( $prop );
			}
		}

		$renderRoot = function ( array $overrides ) use ( $render, $base, $content ): array {
			$html = $render( array_merge( $base, $overrides ), $content );

			return [ $html, $this->root( $html ) ];
		};

		[ $initialHtml, $initial ] = $renderRoot( [] );
		if ( null === $initial ) {
			return [ sprintf( 'root: no element with class "%s"', $manifest->rootClass ) ];
		}

		$rootElements = [];
		foreach ( $manifest->parts as $part ) {
			if ( 'root' === $part['name'] && isset( $part['element'] ) ) {
				$rootElements = array_map( 'trim', explode( '|', $part['element'] ) );
			}
		}
		$tag = strtolower( $initial->tagName );
		if ( [] !== $rootElements && ! in_array( $tag, $rootElements, true ) ) {
			$problems[] = sprintf( 'root: renders <%s>, expected %s', $tag, implode( ' | ', $rootElements ) );
		}

		$checked = [];
		foreach ( $props as $prop ) {
			if ( 'enum' !== $prop['type'] || ! in_array( $prop['name'], self::DATA_ATTRIBUTE_PROPS, true ) ) {
				continue;
			}
			$checked[] = $prop['name'];
			$attribute = 'data-' . ComponentManifest::kebab( $prop['name'] );
			if ( array_key_exists( 'default', $prop ) && ! array_key_exists( $prop['name'], $base ) ) {
				$value = $initial->hasAttribute( $attribute ) ? $initial->getAttribute( $attribute ) : null;
				if ( $value !== $prop['default'] ) {
					$problems[] = sprintf( 'prop %s: the default renders %s, expected %s="%s"', $prop['name'], self::shown( $attribute, $value ), $attribute, (string) $prop['default'] );
				}
			}
			foreach ( $prop['values'] ?? [] as $value ) {
				[ , $root ] = $renderRoot( [ $prop['name'] => $value ] );
				$actual     = null !== $root && $root->hasAttribute( $attribute ) ? $root->getAttribute( $attribute ) : null;
				if ( $actual !== $value ) {
					$problems[] = sprintf( 'prop %s: "%s" renders %s', $prop['name'], $value, self::shown( $attribute, $actual ) );
				}
			}
		}

		foreach ( $props as $prop ) {
			$evidence = self::STATE_EVIDENCE[ $prop['name'] ] ?? null;
			if ( 'boolean' !== $prop['type'] || null === $evidence ) {
				continue;
			}
			$checked[] = $prop['name'];
			[ , $root ] = $renderRoot( [ $prop['name'] => true ] );
			$found      = null !== $root && [] !== array_filter( $evidence, fn ( string $item ): bool => $this->hasEvidence( $root, $item ) );
			if ( ! $found ) {
				$problems[] = sprintf( 'prop %s: true renders none of %s', $prop['name'], implode( ', ', $evidence ) );
			}
		}

		foreach ( $props as $prop ) {
			if ( in_array( $prop['name'], $checked, true ) || in_array( $prop['name'], $options['ignoreEffects'] ?? [], true ) ) {
				continue;
			}
			if ( array_key_exists( $prop['name'], $base ) ) {
				continue;
			}
			$sample = $this->sampleValue( $prop );
			if ( null === $sample ) {
				continue;
			}
			[ $html ]    = $renderRoot( [ $prop['name'] => $sample ] );
			$fallthrough = [ [ 'names' => [ strtolower( $prop['name'] ), ComponentManifest::kebab( $prop['name'] ) ], 'value' => self::sampleAttribute( $sample ), 'rootClass' => $manifest->rootClass ] ];
			if ( $this->normalize( $html, $fallthrough ) === $this->normalize( $initialHtml, $fallthrough ) ) {
				$problems[] = sprintf( 'prop %s: has no effect on the markup', $prop['name'] );
			}
		}

		$scope       = ComponentManifest::kebab( $manifest->name );
		[ , $full ]  = $renderRoot( $manifest->fixture['parts'] ?? [] );
		if ( null === $full ) {
			$problems[] = sprintf( 'root: no element with class "%s" with the fixture\'s parts props', $manifest->rootClass );
		} else {
			$rendered = [];
			if ( $full->getAttribute( 'data-scope' ) === $scope && $full->hasAttribute( 'data-part' ) ) {
				$rendered[] = $full->getAttribute( 'data-part' );
			}
			// The whole render, not just the root: an overlay's trigger, backdrop
			// and positioner sit around the panel that carries the root class (D-019).
			$xpath = new DOMXPath( $full->ownerDocument );
			foreach ( $xpath->query( sprintf( '//*[@data-scope="%s"][@data-part]', $scope ) ) ?: [] as $element ) {
				if ( $element instanceof DOMElement ) {
					$rendered[] = $element->getAttribute( 'data-part' );
				}
			}
			$rendered = array_values( array_unique( $rendered ) );
			$parts    = $manifest->partNames();
			// Behavior parts carry Zag's kebab-case names (`close-trigger`) for
			// the manifest's camelCase ones (`closeTrigger`), so compare both as kebab (D-019).
			$renderedKebab = array_map( [ ComponentManifest::class, 'kebab' ], $rendered );
			$partsKebab    = array_map( [ ComponentManifest::class, 'kebab' ], $parts );
			foreach ( $parts as $part ) {
				if ( 'root' !== $part && ! in_array( ComponentManifest::kebab( $part ), $renderedKebab, true ) ) {
					$problems[] = sprintf( 'part %s: missing [data-scope="%s"][data-part="%s"]', $part, $scope, $part );
				}
			}
			sort( $rendered );
			foreach ( $rendered as $part ) {
				if ( 'root' !== $part && ! in_array( ComponentManifest::kebab( $part ), $partsKebab, true ) ) {
					$problems[] = sprintf( 'part %s: rendered but not in the manifest', $part );
				}
			}
		}

		return array_merge( $problems, $this->declaredProblems( $options['declared'] ?? [], $options['ignoreDeclared'] ?? [] ) );
	}

	/**
	 * Compares the declared props and events with the manifest.
	 *
	 * @since 1.0.0
	 *
	 * @param  array{props?: list<string>, events?: list<string>} $declared What the component declares.
	 * @param  list<string>                                       $ignore   Names that aren't API.
	 *
	 * @return list<string> The problems.
	 */
	public function declaredProblems( array $declared, array $ignore = [] ): array
	{
		$problems = [];
		$listed   = static fn ( array $names ): array => array_values( array_filter( $names, static fn ( string $name ): bool => ! in_array( $name, $ignore, true ) ) );

		if ( isset( $declared['props'] ) ) {
			$expected = array_column( $this->manifest->propsFor( 'livewire' ), 'name' );
			foreach ( $expected as $name ) {
				if ( ! in_array( $name, $declared['props'], true ) ) {
					$problems[] = sprintf( 'prop %s: not declared by the livewire component', $name );
				}
			}
			foreach ( $listed( $declared['props'] ) as $name ) {
				if ( ! in_array( $name, $expected, true ) ) {
					$problems[] = sprintf( 'prop %s: declared but not in the manifest', $name );
				}
			}
		}

		if ( isset( $declared['events'] ) ) {
			$expected = array_map(
				fn ( array $event ): string => ComponentManifest::eventName( $event['name'], 'livewire', $this->manifest ),
				$this->manifest->events,
			);
			foreach ( $expected as $name ) {
				if ( ! in_array( $name, $declared['events'], true ) ) {
					$problems[] = sprintf( 'event %s: not emitted by the livewire component', $name );
				}
			}
			// `wire:model` on an overlay binds its `open` prop through the widget
			// ($wire.entangle), which isn't an event of its own (D-019).
			$bindsOpen = in_array( 'open', array_column( $this->manifest->props, 'name' ), true );
			foreach ( $listed( $declared['events'] ) as $name ) {
				if ( 'wire:model' === $name && $bindsOpen ) {
					continue;
				}
				if ( ! in_array( $name, $expected, true ) ) {
					$problems[] = sprintf( 'event %s: emitted but not in the manifest', $name );
				}
			}
		}

		return $problems;
	}

	/**
	 * The props a Blade component class declares: its constructor parameters.
	 *
	 * @since 1.0.0
	 *
	 * @param  class-string $class The component class.
	 *
	 * @return list<string> Parameter names, camelCase.
	 */
	public static function declaredProps( string $class ): array
	{
		$constructor = ( new ReflectionClass( $class ) )->getConstructor();

		return null === $constructor ? [] : array_map( static fn ( $parameter ): string => $parameter->getName(), $constructor->getParameters() );
	}

	/**
	 * The events a component's source dispatches: `$dispatch('name')` in its
	 * view, `$this->dispatch('name')` in its class, and `wire:model` when it
	 * binds a value (`x-modelable`, `@entangle(` or `$wire.entangle(`) or
	 * hands its attributes to a native form control, where `wire:model` binds
	 * natively (`<input … {{ $attributes… }}`). A view that mounts a behavior
	 * widget (`x-data="apuiDialog(…)"`) also emits the events that widget's
	 * Alpine adapter dispatches (D-019).
	 *
	 * @since 1.0.0
	 *
	 * @param  list<string> $sources Source code: the class and its view.
	 *
	 * @return list<string> Event names, as the manifest spells them for Livewire.
	 */
	public static function dispatchedEvents( array $sources ): array
	{
		$events = [];
		foreach ( $sources as $source ) {
			preg_match_all( '/(?:\$dispatch|\$this->dispatch)\(\s*[\'"]([A-Za-z0-9][A-Za-z0-9:.-]*)[\'"]/', $source, $matches );
			array_push( $events, ...$matches[1] );
			foreach ( self::WIDGET_EVENTS as $widget => $widgetEvents ) {
				// Only where the widget is mounted: its call starts a quoted string,
				// an x-data value or a PHP literal, never a comment or prose.
				if ( preg_match( '/["\']\s*' . $widget . '\s*\(/', $source ) ) {
					array_push( $events, ...$widgetEvents );
				}
			}
			if ( preg_match( '/x-modelable|@entangle\(|\$wire\.entangle\(/', $source ) || preg_match( self::NATIVE_MODEL, self::maskEchoes( $source ) ) ) {
				$events[] = 'wire:model';
			}
		}

		return array_values( array_unique( $events ) );
	}

	/**
	 * Replaces every `{{ … }}` echo and every `->`, `=>` and `>=` with
	 * placeholders, so a tag regex isn't cut short by the `>` in
	 * `$errors->has()` or `@class( [ 'x' => $y ] )`. A bare `>` comparison in a
	 * directive inside a tag still ends the scan. An echo of the
	 * component's attributes becomes `__APUI_ATTRIBUTES__`; reads such as
	 * `$attributes->get( 'id' )` don't count.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $source Blade source.
	 *
	 * @return string The masked source.
	 */
	private static function maskEchoes( string $source ): string
	{
		$masked = (string) preg_replace_callback(
			'/\{\{(.*?)\}\}/s',
			static function ( array $match ): string {
				$echo = trim( $match[1] );

				return str_starts_with( $echo, '$attributes' ) && ! preg_match( self::ATTRIBUTE_READS, $echo ) ? '__APUI_ATTRIBUTES__' : '__APUI_ECHO__';
			},
			$source,
		);

		return str_replace( [ '->', '=>', '>=' ], '__APUI_ARROW__', $masked );
	}

	/**
	 * The source of a component class and of the view it renders.
	 *
	 * @since 1.0.0
	 *
	 * @param  class-string $class The component class.
	 *
	 * @return list<string> The sources that exist.
	 */
	public static function sources( string $class ): array
	{
		$reflection = new ReflectionClass( $class );
		$sources    = [];
		$file       = $reflection->getFileName();
		if ( false !== $file && is_file( $file ) ) {
			$sources[] = (string) file_get_contents( $file );
		}

		if ( ! $reflection->isInstantiable() || ! $reflection->hasMethod( 'render' ) ) {
			return $sources;
		}

		try {
			$view = $reflection->newInstanceWithoutConstructor()->render();
		} catch ( Throwable ) {
			return $sources;
		}

		if ( $view instanceof View && is_file( $view->getPath() ) ) {
			$sources[] = (string) file_get_contents( $view->getPath() );
		} elseif ( is_string( $view ) && view()->exists( $view ) ) {
			$sources[] = (string) file_get_contents( view()->getFinder()->find( $view ) );
		} elseif ( is_string( $view ) ) {
			$sources[] = $view;
		}

		return $sources;
	}

	/**
	 * The value a check renders a prop with, or null to skip it.
	 *
	 * @since 1.0.0
	 *
	 * @param  array<string, mixed> $prop The manifest prop.
	 *
	 * @return mixed The sample.
	 */
	private function sampleValue( array $prop ): mixed
	{
		if ( array_key_exists( $prop['name'], $this->manifest->fixture['parts'] ?? [] ) ) {
			return $this->manifest->fixture['parts'][ $prop['name'] ];
		}

		return match ( $prop['type'] ) {
			'enum'    => array_values( array_filter( $prop['values'] ?? [], static fn ( string $value ): bool => $value !== ( $prop['default'] ?? null ) ) )[0] ?? null,
			'boolean' => ! ( $prop['default'] ?? false ),
			'number'  => is_int( $prop['default'] ?? null ) || is_float( $prop['default'] ?? null ) ? $prop['default'] + 1 : 1,
			'object'  => 'classes' === $prop['name'] ? [ 'root' => 'apui-parity-sample' ] : [ 'sample' => 'apui-parity-sample' ],
			'array'   => [ 'apui-parity-sample' ],
			default   => 'apui-parity-sample',
		};
	}

	/**
	 * How a sample value shows when it falls through as an attribute. Mirrors
	 * `sampleAttribute()` in src/parity.ts.
	 *
	 * @since 1.0.0
	 *
	 * @param  mixed $sample The sample.
	 *
	 * @return string The attribute value.
	 */
	private static function sampleAttribute( mixed $sample ): string
	{
		if ( true === $sample ) {
			return 'true';
		}

		return is_array( $sample ) ? (string) json_encode( $sample ) : (string) $sample;
	}

	/**
	 * The first element with the root class.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $html The rendered markup.
	 *
	 * @return DOMElement|null The root.
	 */
	private function root( string $html ): ?DOMElement
	{
		$document = self::parse( $html );
		$xpath    = new DOMXPath( $document );
		$nodes    = $xpath->query( sprintf( '//*[contains(concat(" ", normalize-space(@class), " "), " %s ")]', $this->manifest->rootClass ) );
		$node     = false === $nodes ? null : $nodes->item( 0 );

		return $node instanceof DOMElement ? $node : null;
	}

	/**
	 * Whether the element or a descendant shows a piece of evidence.
	 *
	 * @since 1.0.0
	 *
	 * @param  DOMElement $root     The component root.
	 * @param  string     $evidence `name` or `name=value`.
	 *
	 * @return bool True when found.
	 */
	private function hasEvidence( DOMElement $root, string $evidence ): bool
	{
		$parts = explode( '=', $evidence, 2 );
		$name  = $parts[0];
		$value = $parts[1] ?? null;
		$match = static fn ( DOMElement $element ): bool => $element->hasAttribute( $name ) && ( null === $value || $element->getAttribute( $name ) === $value );

		if ( $match( $root ) ) {
			return true;
		}

		foreach ( $root->getElementsByTagName( '*' ) as $element ) {
			if ( $match( $element ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * The markup with sorted attributes and generated ids blanked. `$drop`
	 * removes an attribute from the root when both its name and value match:
	 * an unhandled prop falls through to the root as an attribute named after
	 * it, holding the sample, which isn't an effect. The same attribute on an
	 * inner element (an Input's `name`) is.
	 *
	 * @since 1.0.0
	 *
	 * @param  string       $html The markup.
	 * @param  list<array{names: list<string>, value: string, rootClass: string}> $drop Root attributes to leave out.
	 *
	 * @return string The normalized markup.
	 */
	private function normalize( string $html, array $drop = [] ): string
	{
		$body = self::parse( $html )->getElementsByTagName( 'body' )->item( 0 );
		if ( null === $body ) {
			return '';
		}

		$walk = static function ( DOMNode $node ) use ( &$walk, $drop ): string {
			if ( XML_TEXT_NODE === $node->nodeType ) {
				return (string) preg_replace( '/\s+/', ' ', (string) $node->textContent );
			}
			if ( ! $node instanceof DOMElement ) {
				return '';
			}

			$attributes = [];
			foreach ( $node->attributes ?? [] as $attribute ) {
				foreach ( $drop as $item ) {
					$classes = preg_split( '/\s+/', $node->getAttribute( 'class' ) ) ?: [];
					if ( in_array( $item['rootClass'], $classes, true ) && in_array( $attribute->name, $item['names'], true ) && $attribute->value === $item['value'] ) {
						continue 2;
					}
				}
				$attributes[ $attribute->name ] = in_array( $attribute->name, self::ID_ATTRIBUTES, true ) ? '#' : $attribute->value;
			}
			ksort( $attributes, SORT_STRING );
			$rendered = '';
			foreach ( $attributes as $name => $value ) {
				$rendered .= sprintf( ' %s="%s"', $name, $value );
			}
			$children = '';
			foreach ( $node->childNodes as $child ) {
				$children .= $walk( $child );
			}

			return sprintf( '<%s%s>%s</>', strtolower( $node->tagName ), $rendered, $children );
		};

		$out = '';
		foreach ( $body->childNodes as $child ) {
			$out .= $walk( $child );
		}

		return trim( $out );
	}

	/**
	 * Parses an HTML fragment, quietly, as UTF-8.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $html The fragment.
	 *
	 * @return DOMDocument The document.
	 */
	private static function parse( string $html ): DOMDocument
	{
		$document = new DOMDocument();
		$previous = libxml_use_internal_errors( true );
		$document->loadHTML( '<?xml encoding="utf-8"?><!doctype html><html><body>' . $html . '</body></html>' );
		libxml_clear_errors();
		libxml_use_internal_errors( $previous );

		return $document;
	}

	/**
	 * `data-variant="soft"`, or `no data-variant`.
	 *
	 * @since 1.0.0
	 *
	 * @param  string      $name  The attribute.
	 * @param  string|null $value Its value.
	 *
	 * @return string The description.
	 */
	private static function shown( string $name, ?string $value ): string
	{
		return null === $value ? 'no ' . $name : sprintf( '%s="%s"', $name, $value );
	}
}
