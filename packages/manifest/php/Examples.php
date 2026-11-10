<?php

/**
 * Docs examples next to the manifests.
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
 * Lists a component's docs examples (#43): `examples/<Name>/examples.json`
 * plus one source per stack. Mirrors `loadExamples()` in src/examples.ts.
 *
 * @package    ArtisanPack_UI
 * @subpackage DesignSystem
 *
 * @since      1.0.0
 */
final class Examples
{
	/**
	 * The file extension of an example's source in each stack.
	 *
	 * @since 1.0.0
	 *
	 * @var array<string, string>
	 */
	public const EXTENSIONS = [
		'livewire' => '.blade.php',
		'react'    => '.tsx',
		'vue'      => '.vue',
	];

	/**
	 * Creates the reader.
	 *
	 * @since 1.0.0
	 *
	 * @param  string|null $directory The examples directory. Defaults to this package's examples/.
	 */
	public function __construct( private ?string $directory = null )
	{
		$this->directory ??= dirname( __DIR__ ) . '/examples';
	}

	/**
	 * A component's examples with the path of each stack's source.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $component The component name, such as `Button`.
	 *
	 * @throws InvalidArgumentException When the name isn't a component name, examples.json isn't a JSON array, or an id isn't kebab-case.
	 *
	 * @return list<array{id: string, title: string, description: string, files: array<string, string>}> The examples, empty when there are none.
	 */
	public function for( string $component ): array
	{
		if ( 1 !== preg_match( '/^[A-Z][A-Za-z0-9]*$/', $component ) ) {
			throw new InvalidArgumentException( sprintf( '"%s" is not a component name', $component ) );
		}

		$index = $this->directory . '/' . $component . '/examples.json';
		if ( ! is_file( $index ) ) {
			return [];
		}

		$entries = json_decode( (string) file_get_contents( $index ), true );
		if ( ! is_array( $entries ) || ! array_is_list( $entries ) ) {
			throw new InvalidArgumentException( sprintf( '%s must be a JSON array', $index ) );
		}

		return array_map(
			function ( array $entry ) use ( $component, $index ): array {
				if ( 1 !== preg_match( '/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/', (string) ( $entry['id'] ?? '' ) ) ) {
					throw new InvalidArgumentException( sprintf( '%s: example id %s must be kebab-case', $index, (string) json_encode( $entry['id'] ?? null ) ) );
				}

				$files = [];
				foreach ( self::EXTENSIONS as $stack => $extension ) {
					$file = $this->directory . '/' . $component . '/' . $entry['id'] . $extension;
					if ( is_file( $file ) ) {
						$files[ $stack ] = $file;
					}
				}

				return [
					'id'          => $entry['id'],
					'title'       => $entry['title'],
					'description' => $entry['description'],
					'files'       => $files,
				];
			},
			$entries,
		);
	}

	/**
	 * Components that have examples.
	 *
	 * @since 1.0.0
	 *
	 * @return list<string> Component names, sorted.
	 */
	public function components(): array
	{
		$names = array_map( 'basename', glob( $this->directory . '/*', GLOB_ONLYDIR ) ?: [] );
		sort( $names );

		return $names;
	}
}
