<?php

/**
 * Pest expectations for the design-system gates.
 *
 * @package    ArtisanPack_UI
 * @subpackage DesignSystem
 *
 * @since      1.0.0
 */

declare( strict_types=1 );

namespace ArtisanPackUI\DesignSystem\Testing\Pest;

use ArtisanPackUI\DesignSystem\Manifest\ComponentManifest;
use ArtisanPackUI\DesignSystem\Manifest\ManifestRepository;
use ArtisanPackUI\DesignSystem\Testing\ManifestParity;
use PHPUnit\Framework\Assert;

/**
 * Registers `toMatchManifest`, the Pest helper for Blade parity (#41). Call
 * `Expectations::register()` once, in `tests/Pest.php`.
 *
 * ```php
 * Expectations::register();
 *
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
final class Expectations
{
	/**
	 * Registers the expectations.
	 *
	 * @since 1.0.0
	 *
	 * @param  ManifestRepository|null $manifests The manifests. Defaults to the package's.
	 *
	 * @return void
	 */
	public static function register( ?ManifestRepository $manifests = null ): void
	{
		expect()->extend(
			'toMatchManifest',
			/**
			 * Asserts that `x-artisanpack-*` matches the named component's manifest.
			 *
			 * @param  array{ignoreEffects?: list<string>, ignoreDeclared?: list<string>} $options Exemptions.
			 */
			function ( array $options = [] ) use ( $manifests ) {
				$manifest = $this->value instanceof ComponentManifest
					? $this->value
					: ( $manifests ?? ManifestRepository::fromFile() )->get( (string) $this->value );
				$problems = ManifestParity::forBlade( $manifest, $options );

				Assert::assertSame(
					[],
					$problems,
					sprintf( "%s (livewire) drifts from its manifest:\n  - %s", $manifest->name, implode( "\n  - ", $problems ) ),
				);

				return $this;
			},
		);
	}
}
