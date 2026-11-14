<?php

/**
 * Docs tables from a component manifest.
 *
 * @package    ArtisanPack_UI
 * @subpackage DesignSystem
 *
 * @since      1.0.0
 */

declare( strict_types=1 );

namespace ArtisanPackUI\DesignSystem\Manifest;

/**
 * The props, parts, slots and events tables for a component's docs page
 * (#43), spelled the way one stack writes them. Mirrors `docsTables()` in
 * src/docs.ts; a test keeps the two identical.
 *
 * @package    ArtisanPack_UI
 * @subpackage DesignSystem
 *
 * @since      1.0.0
 */
final class ManifestDocs
{
	/**
	 * The docs tables for one stack. Empty when the component doesn't ship there (D-003).
	 *
	 * @since 1.0.0
	 *
	 * @param  ComponentManifest $manifest The component.
	 * @param  string            $stack    `livewire`, `react` or `vue`.
	 *
	 * @return array{stack: string, props: list<array<string, mixed>>, parts: list<array<string, mixed>>, slots: list<array<string, mixed>>, events: list<array<string, mixed>>} The tables.
	 */
	public static function tables( ComponentManifest $manifest, string $stack ): array
	{
		if ( ! $manifest->shipsIn( $stack ) ) {
			return [ 'stack' => $stack, 'props' => [], 'parts' => [], 'slots' => [], 'events' => [] ];
		}

		return [
			'stack'  => $stack,
			'props'  => array_map(
				static fn ( array $prop ): array => [
					'name'        => 'livewire' === $stack ? ComponentManifest::kebab( $prop['name'] ) : $prop['name'],
					'type'        => $prop['type'],
					'typeLabel'   => self::typeLabel( $prop['type'], $prop['values'] ?? [] ),
					'values'      => $prop['values'] ?? [],
					'default'     => $prop['default'] ?? null,
					'required'    => $prop['required'] ?? false,
					'description' => $prop['description'],
					'a11y'        => $prop['a11y'] ?? null,
					'deprecated'  => $prop['deprecated'] ?? null,
				],
				$manifest->propsFor( $stack ),
			),
			'parts'  => $manifest->parts,
			'slots'  => array_map(
				static fn ( array $slot ): array => [
					'name'        => $slot['name'],
					'description' => $slot['description'],
					'scoped'      => $slot['scoped'] ?? false,
					'parameters'  => $slot['parameters'] ?? [],
				],
				$manifest->slots,
			),
			'events' => array_map(
				static fn ( array $event ): array => [
					'concept'     => $event['name'],
					'name'        => ComponentManifest::eventName( $event['name'], $stack, $manifest ),
					'description' => $event['description'],
					'payload'     => $event['payload'] ?? null,
				],
				$manifest->events,
			),
		];
	}

	/**
	 * `'solid' | 'soft'` for an enum, otherwise the type.
	 *
	 * @since 1.0.0
	 *
	 * @param  string       $type   The prop type.
	 * @param  list<string> $values The enum values.
	 *
	 * @return string The label.
	 */
	private static function typeLabel( string $type, array $values ): string
	{
		if ( 'enum' !== $type ) {
			return $type;
		}

		return implode( ' | ', array_map( static fn ( string $value ): string => "'" . $value . "'", $values ) );
	}
}
