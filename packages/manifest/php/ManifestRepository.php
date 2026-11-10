<?php

/**
 * Loads component manifests.
 *
 * @package    ArtisanPack_UI
 * @subpackage DesignSystem
 *
 * @since      1.0.0
 */

declare( strict_types=1 );

namespace ArtisanPackUI\DesignSystem\Manifest;

use InvalidArgumentException;
use OutOfBoundsException;

/**
 * Typed access to the generated manifests (generated/manifests.php), for the
 * Livewire parity tests.
 *
 * @package    ArtisanPack_UI
 * @subpackage DesignSystem
 *
 * @since      1.0.0
 */
final class ManifestRepository
{
	/**
	 * Creates a repository.
	 *
	 * @since 1.0.0
	 *
	 * @param  array<string, ComponentManifest> $manifests Manifests keyed by name.
	 */
	public function __construct( private readonly array $manifests )
	{
	}

	/**
	 * Loads the generated manifest array.
	 *
	 * @since 1.0.0
	 *
	 * @param  string|null $path The PHP file to load. Defaults to this package's generated/manifests.php.
	 *
	 * @throws InvalidArgumentException When the file is missing or does not return an array.
	 *
	 * @return self The repository.
	 */
	public static function fromFile( ?string $path = null ): self
	{
		$path ??= dirname( __DIR__ ) . '/generated/manifests.php';

		if ( ! is_file( $path ) ) {
			throw new InvalidArgumentException( sprintf( 'Manifest file "%s" does not exist.', $path ) );
		}

		$data = require $path;

		if ( ! is_array( $data ) ) {
			throw new InvalidArgumentException( sprintf( 'Manifest file "%s" must return an array.', $path ) );
		}

		return self::fromArray( $data );
	}

	/**
	 * Creates a repository from manifest arrays keyed by name.
	 *
	 * @since 1.0.0
	 *
	 * @param  array<string, array<string, mixed>> $data The manifests.
	 *
	 * @return self The repository.
	 */
	public static function fromArray( array $data ): self
	{
		$manifests = [];

		foreach ( $data as $name => $entry ) {
			$manifests[ $name ] = ComponentManifest::fromArray( $entry );
		}

		ksort( $manifests );

		return new self( $manifests );
	}

	/**
	 * Every manifest, keyed by name.
	 *
	 * @since 1.0.0
	 *
	 * @return array<string, ComponentManifest> The manifests.
	 */
	public function all(): array
	{
		return $this->manifests;
	}

	/**
	 * Whether a manifest exists.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $name Component name, such as `Button`.
	 *
	 * @return bool True when it exists.
	 */
	public function has( string $name ): bool
	{
		return isset( $this->manifests[ $name ] );
	}

	/**
	 * One manifest.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $name Component name, such as `Button`.
	 *
	 * @throws OutOfBoundsException When there is no manifest with that name.
	 *
	 * @return ComponentManifest The manifest.
	 */
	public function get( string $name ): ComponentManifest
	{
		if ( ! $this->has( $name ) ) {
			throw new OutOfBoundsException( sprintf( 'No manifest for "%s".', $name ) );
		}

		return $this->manifests[ $name ];
	}

	/**
	 * The manifests of components that ship in a stack.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $stack `livewire`, `react` or `vue`.
	 *
	 * @return array<string, ComponentManifest> The manifests.
	 */
	public function forStack( string $stack ): array
	{
		return array_filter(
			$this->manifests,
			static fn ( ComponentManifest $manifest ): bool => $manifest->shipsIn( $stack ),
		);
	}
}
