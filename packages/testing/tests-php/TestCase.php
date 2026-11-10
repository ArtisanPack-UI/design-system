<?php

/**
 * Base test case for the design-system PHP kit.
 *
 * @package    ArtisanPack_UI
 * @subpackage DesignSystem
 *
 * @since      1.0.0
 */

declare( strict_types=1 );

namespace ArtisanPackUI\DesignSystem\Testing\Tests;

use ArtisanPackUI\DesignSystem\Manifest\ComponentManifest;
use ArtisanPackUI\DesignSystem\Manifest\ManifestRepository;
use ArtisanPackUI\DesignSystem\Testing\Tests\Reference\Probe;
use Illuminate\Support\Facades\Blade;
use Orchestra\Testbench\TestCase as BaseTestCase;

/**
 * Boots Testbench with the reference Probe registered as `x-artisanpack-probe`.
 *
 * @since 1.0.0
 */
abstract class TestCase extends BaseTestCase
{
	/**
	 * The reference directory shared with the TypeScript tests.
	 */
	public const REFERENCE = __DIR__ . '/../test/reference';

	protected function setUp(): void
	{
		parent::setUp();

		Blade::component( 'artisanpack-probe', Probe::class );
	}

	/**
	 * The reference Probe manifest.
	 */
	protected static function probe(): ComponentManifest
	{
		$data = json_decode( (string) file_get_contents( self::REFERENCE . '/manifests/Probe.json' ), true );
		unset( $data['$schema'] );

		return ComponentManifest::fromArray( $data );
	}

	/**
	 * A repository holding only the Probe.
	 */
	protected static function probes(): ManifestRepository
	{
		return new ManifestRepository( [ 'Probe' => self::probe() ] );
	}
}
