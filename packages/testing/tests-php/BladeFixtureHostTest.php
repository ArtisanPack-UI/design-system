<?php

declare( strict_types=1 );

use ArtisanPackUI\DesignSystem\Testing\BladeFixtureHost;

/**
 * Writes the Probe's fixture file the way `apui-gates fixtures` does.
 */
function probeFixtures( array $overrides = [] ): string
{
	$dir  = sys_get_temp_dir() . '/apui-fixtures-' . bin2hex( random_bytes( 4 ) );
	mkdir( $dir );
	$case = [ 'id' => 'variant=outline state=loading', 'props' => [ 'variant' => 'outline', 'loading' => true ], 'state' => 'loading', 'content' => 'Probe & co' ];
	file_put_contents(
		$dir . '/Probe.json',
		json_encode(
			array_merge(
				[
					'version'   => 1,
					'component' => 'Probe',
					'rootClass' => 'apui-probe',
					'stacks'    => [ 'livewire', 'react', 'vue' ],
					'names'     => [ 'livewire' => 'probe', 'react' => 'Probe', 'vue' => 'Probe' ],
					'cases'     => [ $case ],
					'sheets'    => [
						[ 'id' => 'light', 'theme' => 'light', 'density' => 'default', 'dir' => 'ltr' ],
						[ 'id' => 'rtl', 'theme' => 'light', 'density' => 'default', 'dir' => 'rtl' ],
					],
				],
				$overrides,
			),
		),
	);

	return $dir;
}

it( 'binds manifest props as view data, never as template source', function (): void {
	[ $attributes, $data ] = BladeFixtureHost::attributes( [
		'variant'     => 'soft',
		'iconOnly'    => true,
		'leadingIcon' => null,
		'classes'     => [ 'root' => 'x y' ],
	] );

	expect( $attributes )->toBe( ' :variant="$__apuiProp0" :icon-only="$__apuiProp1" :classes="$__apuiProp2"' )
		->and( $data )->toBe( [ '__apuiProp0' => 'soft', '__apuiProp1' => true, '__apuiProp2' => [ 'root' => 'x y' ] ] );
} );

it( 'renders values as text, like React and Vue: no double encoding and no Blade in values', function (): void {
	$html = BladeFixtureHost::renderComponent( 'probe', [ 'leadingIcon' => '{{ PHP_VERSION }}', 'variant' => 'outline' ], 'Save & {{ 6*7 }} "close"' );

	expect( $html )
		->toContain( '>Save &amp; {{ 6*7 }} &quot;close&quot;</span>' )
		->not->toContain( PHP_VERSION )
		->not->toContain( '&amp;amp;' );
} );

it( 'renders each case in the same wrapper as the React and Vue hosts', function (): void {
	$html = ( new BladeFixtureHost( probeFixtures() ) )->render( 'Probe' );

	expect( $html )
		->toStartWith( '<div data-apui-case="variant=outline state=loading" data-apui-state="loading"><button type="button" class="apui-probe" data-variant="outline"' )
		->toContain( 'aria-busy="true"' )
		->toContain( 'data-part="spinner"' )
		->toContain( '>Probe &amp; co</span>' )
		->toEndWith( '</button></div>' );
} );

it( 'writes one file per sheet', function (): void {
	$out   = sys_get_temp_dir() . '/apui-out-' . bin2hex( random_bytes( 4 ) );
	$files = ( new BladeFixtureHost( probeFixtures() ) )->write( [ 'Probe' ], $out );

	expect( $files )->toBe( [ $out . '/Probe/light.html', $out . '/Probe/rtl.html' ] )
		->and( file_get_contents( $files[0] ) )->toBe( file_get_contents( $files[1] ) );
} );

it( 'skips components that do not ship in Livewire (D-003)', function (): void {
	$dir  = probeFixtures( [ 'stacks' => [ 'react', 'vue' ], 'names' => [ 'react' => 'Probe', 'vue' => 'Probe' ] ] );
	$host = new BladeFixtureHost( $dir );

	expect( $host->write( [ 'Probe' ], sys_get_temp_dir() . '/apui-skip' ) )->toBe( [] );
	expect( fn () => $host->render( 'Probe' ) )->toThrow( InvalidArgumentException::class, 'Probe does not ship in livewire (D-003).' );
} );

it( 'reports a missing or malformed fixture file', function (): void {
	expect( fn () => ( new BladeFixtureHost( sys_get_temp_dir() ) )->fixtures( 'Nope' ) )
		->toThrow( InvalidArgumentException::class, 'No fixtures for "Nope"' );
	expect( fn () => ( new BladeFixtureHost( probeFixtures( [ 'version' => 2 ] ) ) )->fixtures( 'Probe' ) )
		->toThrow( InvalidArgumentException::class, 'is not a version 1 fixture file' );
} );

it( 'reads the shipped fixtures by default', function (): void {
	expect( ( new BladeFixtureHost() )->fixtures( 'Button' ) )
		->toHaveKey( 'names.livewire', 'button' )
		->and( ( new BladeFixtureHost() )->fixtures( 'Button' )['sheets'] )->toHaveCount( 4 );
} );
