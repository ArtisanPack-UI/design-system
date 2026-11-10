<?php

/**
 * A component manifest.
 *
 * @package    ArtisanPack_UI
 * @subpackage DesignSystem
 *
 * @since      1.0.0
 */

declare( strict_types=1 );

namespace ArtisanPackUI\DesignSystem\Manifest;

use InvalidArgumentException;

/**
 * One component's API contract, read from the generated manifest array.
 *
 * Mirrors schema/component.schema.json. List fields keep the manifest's array
 * shape, so test harnesses can compare them with the React and Vue loaders.
 *
 * @package    ArtisanPack_UI
 * @subpackage DesignSystem
 *
 * @since      1.0.0
 */
final class ComponentManifest
{
	/**
	 * The stacks a component can ship in.
	 *
	 * @since 1.0.0
	 *
	 * @var list<string>
	 */
	public const STACKS = [ 'livewire', 'react', 'vue' ];

	/**
	 * Concepts whose names differ per stack (vocabulary, Events).
	 *
	 * @since 1.0.0
	 *
	 * @var array<string, array<string, string>>
	 */
	public const SPECIAL_EVENTS = [
		'value-change' => [ 'livewire' => 'wire:model', 'react' => 'onValueChange', 'vue' => 'update:modelValue' ],
		'open-change'  => [ 'livewire' => 'open-change', 'react' => 'onOpenChange', 'vue' => 'update:open' ],
	];

	/**
	 * Creates a manifest.
	 *
	 * @since 1.0.0
	 *
	 * @param  string                                                                          $name        Canonical component name, such as `Button`.
	 * @param  string                                                                          $description What the component is for.
	 * @param  string                                                                          $status      `planned`, `draft`, `stable` or `deprecated`.
	 * @param  int|null                                                                        $issue       The issue that builds the component.
	 * @param  string                                                                          $rootClass   The root class, such as `apui-button`.
	 * @param  array<string, array{name: string, capabilities?: list<string>, differences?: list<string>}|false> $stacks Per-stack entries, `false` when it does not ship there.
	 * @param  list<array<string, mixed>>                                                      $props       Props.
	 * @param  list<string>                                                                    $variants    Variants.
	 * @param  list<string>                                                                    $sizes       Sizes.
	 * @param  list<string>                                                                    $colors      Colors.
	 * @param  list<array<string, mixed>>                                                      $parts       Parts.
	 * @param  list<array<string, mixed>>                                                      $slots       Slots.
	 * @param  list<array<string, mixed>>                                                      $events      Events.
	 * @param  array<string, mixed>                                                            $a11y        Accessibility requirements.
	 * @param  list<string>                                                                    $tokens      Custom properties the component reads.
	 * @param  array{content?: string, props?: array<string, mixed>, parts?: array<string, mixed>, states?: list<string>} $fixture How the quality gates render it.
	 */
	public function __construct(
		public readonly string $name,
		public readonly string $description,
		public readonly string $status,
		public readonly ?int $issue,
		public readonly string $rootClass,
		public readonly array $stacks,
		public readonly array $props,
		public readonly array $variants,
		public readonly array $sizes,
		public readonly array $colors,
		public readonly array $parts,
		public readonly array $slots,
		public readonly array $events,
		public readonly array $a11y,
		public readonly array $tokens,
		public readonly array $fixture = [],
	) {
	}

	/**
	 * Creates a manifest from one entry of the generated array.
	 *
	 * @since 1.0.0
	 *
	 * @param  array<string, mixed> $data The manifest entry.
	 *
	 * @throws InvalidArgumentException When a required field is missing.
	 *
	 * @return self The manifest.
	 */
	public static function fromArray( array $data ): self
	{
		foreach ( [ 'name', 'description', 'status', 'rootClass', 'stacks', 'props', 'parts', 'a11y' ] as $field ) {
			if ( ! array_key_exists( $field, $data ) ) {
				throw new InvalidArgumentException( sprintf( 'Manifest is missing "%s".', $field ) );
			}
		}

		return new self(
			name: $data['name'],
			description: $data['description'],
			status: $data['status'],
			issue: $data['issue'] ?? null,
			rootClass: $data['rootClass'],
			stacks: $data['stacks'],
			props: $data['props'],
			variants: $data['variants'] ?? [],
			sizes: $data['sizes'] ?? [],
			colors: $data['colors'] ?? [],
			parts: $data['parts'],
			slots: $data['slots'] ?? [],
			events: $data['events'] ?? [],
			a11y: $data['a11y'],
			tokens: $data['tokens'] ?? [],
			fixture: $data['fixture'] ?? [],
		);
	}

	/**
	 * Whether the component ships in a stack (D-003).
	 *
	 * @since 1.0.0
	 *
	 * @param  string $stack `livewire`, `react` or `vue`.
	 *
	 * @throws InvalidArgumentException When the stack is unknown.
	 *
	 * @return bool True when it ships there.
	 */
	public function shipsIn( string $stack ): bool
	{
		if ( ! in_array( $stack, self::STACKS, true ) ) {
			throw new InvalidArgumentException( sprintf( 'Unknown stack "%s".', $stack ) );
		}

		return false !== ( $this->stacks[ $stack ] ?? false );
	}

	/**
	 * The Blade tag for the component, such as `x-artisanpack-button`.
	 *
	 * @since 1.0.0
	 *
	 * @return string|null The tag, or null when it does not ship in Livewire.
	 */
	public function bladeTag(): ?string
	{
		$livewire = $this->stacks['livewire'] ?? false;
		if ( ! is_array( $livewire ) ) {
			return null;
		}

		return 'x-artisanpack-' . $livewire['name'];
	}

	/**
	 * The props that exist in a stack.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $stack `livewire`, `react` or `vue`.
	 *
	 * @return list<array<string, mixed>> The props.
	 */
	public function propsFor( string $stack ): array
	{
		return array_values(
			array_filter(
				$this->props,
				static fn ( array $prop ): bool => ! isset( $prop['stacks'] ) || in_array( $stack, $prop['stacks'], true ),
			),
		);
	}

	/**
	 * An event's name in a stack: the kebab-case concept in Livewire and Vue,
	 * `on` plus PascalCase in React, and the vocabulary's names for value and
	 * open changes. Mirrors `eventName()` in the TypeScript loader.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $event The concept name, such as `row-click`.
	 * @param  string $stack `livewire`, `react` or `vue`.
	 *
	 * @return string The name, such as `onRowClick`.
	 */
	public static function eventName( string $event, string $stack ): string
	{
		if ( isset( self::SPECIAL_EVENTS[ $event ][ $stack ] ) ) {
			return self::SPECIAL_EVENTS[ $event ][ $stack ];
		}

		if ( 'react' === $stack ) {
			return 'on' . ucfirst( self::camel( $event ) );
		}

		return $event;
	}

	/**
	 * `row-click` to `rowClick`.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $kebab A kebab-case name.
	 *
	 * @return string The camelCase name.
	 */
	public static function camel( string $kebab ): string
	{
		return (string) preg_replace_callback( '/-([a-z0-9])/', static fn ( array $match ): string => strtoupper( $match[1] ), $kebab );
	}

	/**
	 * `iconOnly` to `icon-only`, `ButtonGroup` to `button-group`. Mirrors
	 * `kebab()` in the TypeScript validator.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $name A camelCase or PascalCase name.
	 *
	 * @return string The kebab-case name.
	 */
	public static function kebab( string $name ): string
	{
		$name = (string) preg_replace( '/([a-z0-9])([A-Z])/', '$1-$2', $name );
		$name = (string) preg_replace( '/([A-Z])([A-Z][a-z])/', '$1-$2', $name );

		return strtolower( $name );
	}

	/**
	 * Names of the component's parts.
	 *
	 * @since 1.0.0
	 *
	 * @return list<string> The part names.
	 */
	public function partNames(): array
	{
		return array_column( $this->parts, 'name' );
	}

	/**
	 * The manifest as an array, in the generated array's shape.
	 *
	 * @since 1.0.0
	 *
	 * @return array<string, mixed> The manifest.
	 */
	public function toArray(): array
	{
		return [
			'name'        => $this->name,
			'description' => $this->description,
			'status'      => $this->status,
			'issue'       => $this->issue,
			'rootClass'   => $this->rootClass,
			'stacks'      => $this->stacks,
			'props'       => $this->props,
			'variants'    => $this->variants,
			'sizes'       => $this->sizes,
			'colors'      => $this->colors,
			'parts'       => $this->parts,
			'slots'       => $this->slots,
			'events'      => $this->events,
			'a11y'        => $this->a11y,
			'tokens'      => $this->tokens,
			'fixture'     => $this->fixture,
		];
	}
}
