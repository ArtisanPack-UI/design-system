<?php

/**
 * Renders the design-system fixtures with Blade.
 *
 * @package    ArtisanPack_UI
 * @subpackage DesignSystem
 *
 * @since      1.0.0
 */

declare( strict_types=1 );

namespace ArtisanPackUI\DesignSystem\Testing;

use ArtisanPackUI\DesignSystem\Manifest\ComponentManifest;
use Illuminate\Support\Facades\Blade;
use InvalidArgumentException;
use RuntimeException;

/**
 * The Blade fixture host (#39). Renders each case of a component's fixture
 * file (`generated/fixtures/<Name>.json`) with the registered
 * `x-artisanpack-*` component, in the same wrappers as the React and Vue
 * hosts, and writes one file per sheet for `apui-gates check`.
 *
 * ```php
 * it( 'renders the design-system fixtures', function (): void {
 *     ( new BladeFixtureHost() )->write( [ 'Button' ], __DIR__ . '/../build/gates/livewire' );
 * } )->group( 'gates' );
 * ```
 *
 * @package    ArtisanPack_UI
 * @subpackage DesignSystem
 *
 * @since      1.0.0
 */
final class BladeFixtureHost
{
	/**
	 * Creates the host.
	 *
	 * @since 1.0.0
	 *
	 * @param  string|null $fixtures The fixtures directory. Defaults to this package's generated/fixtures.
	 */
	public function __construct( private ?string $fixtures = null )
	{
		$this->fixtures ??= dirname( __DIR__ ) . '/generated/fixtures';
	}

	/**
	 * Reads a component's fixture file.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $component The component name, such as `Button`.
	 *
	 * @throws InvalidArgumentException When the file is missing or malformed.
	 *
	 * @return array{version: int, component: string, rootClass: string, stacks: list<string>, names: array<string, string>, cases: list<array{id: string, props: array<string, mixed>, state: string, content: string|null}>, sheets: list<array{id: string, theme: string, density: string, dir: string}>} The fixtures.
	 */
	public function fixtures( string $component ): array
	{
		$file = $this->fixtures . '/' . $component . '.json';
		if ( ! is_file( $file ) ) {
			throw new InvalidArgumentException( sprintf( 'No fixtures for "%s" in %s.', $component, $this->fixtures ) );
		}

		$data = json_decode( (string) file_get_contents( $file ), true );
		if ( ! is_array( $data ) || 1 !== ( $data['version'] ?? null ) ) {
			throw new InvalidArgumentException( sprintf( '"%s" is not a version 1 fixture file.', $file ) );
		}

		return $data;
	}

	/**
	 * Renders every case of a component, each in its `data-apui-case` wrapper.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $component The component name, such as `Button`.
	 *
	 * @throws InvalidArgumentException When the component doesn't ship in Livewire.
	 *
	 * @return string The HTML that goes inside `#apui-fixture`.
	 */
	public function render( string $component ): string
	{
		$fixtures = $this->fixtures( $component );
		$name     = $fixtures['names']['livewire'] ?? null;
		if ( null === $name ) {
			throw new InvalidArgumentException( sprintf( '%s does not ship in livewire (D-003).', $component ) );
		}

		$html = '';
		foreach ( $fixtures['cases'] as $case ) {
			$html .= sprintf(
				'<div data-apui-case="%s" data-apui-state="%s">%s</div>',
				e( $case['id'] ),
				e( $case['state'] ),
				self::renderComponent( $name, $case['props'], $case['content'] ),
			);
		}

		return $html;
	}

	/**
	 * Writes `<out>/<Component>/<sheet>.html` for each component that ships in
	 * Livewire. Components that don't (D-003) are skipped.
	 *
	 * @since 1.0.0
	 *
	 * @param  list<string> $components Component names.
	 * @param  string       $out        The directory `apui-gates` reads (`stacks.livewire.html`).
	 *
	 * @throws RuntimeException When a directory can't be created.
	 *
	 * @return list<string> The files written.
	 */
	public function write( array $components, string $out ): array
	{
		$written = [];
		foreach ( $components as $component ) {
			$fixtures = $this->fixtures( $component );
			if ( ! in_array( 'livewire', $fixtures['stacks'], true ) ) {
				continue;
			}

			$html      = $this->render( $component );
			$directory = $out . '/' . $component;
			if ( ! is_dir( $directory ) && ! mkdir( $directory, 0777, true ) && ! is_dir( $directory ) ) {
				throw new RuntimeException( sprintf( 'Could not create %s.', $directory ) );
			}

			foreach ( $fixtures['sheets'] as $sheet ) {
				$file = $directory . '/' . $sheet['id'] . '.html';
				file_put_contents( $file, $html );
				$written[] = $file;
			}
		}

		return $written;
	}

	/**
	 * Renders `x-artisanpack-<name>` with manifest-named props and slot text.
	 *
	 * Values reach the component as view data, never as template source, so
	 * `&` isn't double-encoded and `{{ }}` in a value stays text, as it does
	 * in React and Vue.
	 *
	 * @since 1.0.0
	 *
	 * @param  string               $name    The Blade name without `x-artisanpack-`, such as `button`.
	 * @param  array<string, mixed> $props   Props by manifest name.
	 * @param  string|null          $content Default slot text.
	 *
	 * @return string The HTML.
	 */
	public static function renderComponent( string $name, array $props, ?string $content ): string
	{
		[ $attributes, $data ] = self::attributes( $props );
		$tag                   = 'x-artisanpack-' . $name;
		$data['__apuiContent'] = $content;
		$template              = null === $content
			? sprintf( '<%s%s />', $tag, $attributes )
			: sprintf( '<%s%s>{{ $__apuiContent }}</%s>', $tag, $attributes, $tag );

		// A unique comment gives every render its own compiled view. The compiled
		// template holds the component's class, and Blade reuses a compile whose
		// source has the same text and modification time, so a swapped alias
		// would otherwise render the old class. The temporary view is deleted.
		$nonce = bin2hex( random_bytes( 8 ) );

		return Blade::render( '{{-- apui-fixture ' . $nonce . ' --}}' . $template, $data, true );
	}

	/**
	 * Manifest-named props as bound Blade attributes, each reading a view
	 * variable, plus the variables.
	 *
	 * @since 1.0.0
	 *
	 * @param  array<string, mixed> $props Props by manifest name.
	 *
	 * @return array{0: string, 1: array<string, mixed>} The attributes, each with a leading space, and the view data they read.
	 */
	public static function attributes( array $props ): array
	{
		$attributes = '';
		$data       = [];
		$index      = 0;
		foreach ( $props as $name => $value ) {
			if ( null === $value ) {
				continue;
			}

			$variable          = '__apuiProp' . $index++;
			$data[ $variable ] = $value;
			$attributes       .= sprintf( ' :%s="$%s"', ComponentManifest::kebab( (string) $name ), $variable );
		}

		return [ $attributes, $data ];
	}
}
