<?php

declare( strict_types=1 );

use ArtisanPackUI\DesignSystem\Manifest\Examples;

/**
 * Writes a Button examples.json with the given entries into a temporary examples folder.
 */
function examplesWith( mixed $entries ): Examples
{
	$dir = sys_get_temp_dir() . '/apui-examples-' . bin2hex( random_bytes( 4 ) );
	mkdir( $dir . '/Button', 0777, true );
	file_put_contents( $dir . '/Button/examples.json', json_encode( $entries ) );
	touch( $dir . '/Button/basic.blade.php' );

	return new Examples( $dir );
}

it( 'lists the examples with the source of each stack', function (): void {
	$examples = examplesWith( [ [ 'id' => 'basic', 'title' => 'Basic', 'description' => 'A button.' ] ] )->for( 'Button' );

	expect( $examples )->toHaveCount( 1 )
		->and( $examples[0]['id'] )->toBe( 'basic' )
		->and( array_keys( $examples[0]['files'] ) )->toBe( [ 'livewire' ] );
} );

it( 'reads the shipped Button examples', function (): void {
	expect( array_column( ( new Examples() )->for( 'Button' ), 'id' ) )->toContain( 'basic' );
} );

it( 'rejects a malformed entry with InvalidArgumentException', function ( mixed $entry, string $message ): void {
	expect( fn () => examplesWith( [ $entry ] )->for( 'Button' ) )
		->toThrow( InvalidArgumentException::class, $message );
} )->with( [
	'null entry'          => [ null, 'must be kebab-case' ],
	'string entry'        => [ 'basic', 'must be kebab-case' ],
	'missing id'          => [ [ 'title' => 't', 'description' => 'd' ], 'must be kebab-case' ],
	'boolean id'          => [ [ 'id' => true, 'title' => 't', 'description' => 'd' ], 'must be kebab-case' ],
	'array id'            => [ [ 'id' => [ 'basic' ], 'title' => 't', 'description' => 'd' ], 'must be kebab-case' ],
	'path id'             => [ [ 'id' => '../x', 'title' => 't', 'description' => 'd' ], 'must be kebab-case' ],
	'missing title'       => [ [ 'id' => 'basic', 'description' => 'd' ], 'needs a string title' ],
	'numeric description' => [ [ 'id' => 'basic', 'title' => 't', 'description' => 1 ], 'needs a string description' ],
] );

it( 'rejects a component name or index that is not a list', function (): void {
	expect( fn () => ( new Examples() )->for( '../manifest' ) )->toThrow( InvalidArgumentException::class, 'is not a component name' )
		->and( fn () => examplesWith( [ 'id' => 'basic' ] )->for( 'Button' ) )->toThrow( InvalidArgumentException::class, 'must be a JSON array' );
} );
