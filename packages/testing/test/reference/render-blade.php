<?php

/**
 * Renders the reference Probe's Blade fixtures for the gate tests:
 *
 *   php test/reference/render-blade.php <fixtures dir> <out dir>
 *
 * @package ArtisanPack_UI
 */

declare( strict_types=1 );

use ArtisanPackUI\DesignSystem\Testing\BladeFixtureHost;
use ArtisanPackUI\DesignSystem\Testing\Tests\Reference\Probe;
use Illuminate\Support\Facades\Blade;
use Orchestra\Testbench\Foundation\Application;

require dirname( __DIR__, 4 ) . '/vendor/autoload.php';

[ , $fixtures, $out ] = $argv + [ null, null, null ];
if ( null === $fixtures || null === $out ) {
	throw new InvalidArgumentException( 'Usage: php render-blade.php <fixtures dir> <out dir>' );
}

Application::create();
Blade::component( 'artisanpack-probe', Probe::class );

foreach ( ( new BladeFixtureHost( $fixtures ) )->write( [ 'Probe' ], $out ) as $file ) {
	echo $file, "\n";
}
