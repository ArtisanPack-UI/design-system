<?php

declare( strict_types=1 );

use ArtisanPackUI\DesignSystem\Manifest\ComponentManifest;
use ArtisanPackUI\DesignSystem\Manifest\ManifestRepository;
use ArtisanPackUI\DesignSystem\Testing\BladeFixtureHost;
use ArtisanPackUI\DesignSystem\Testing\ManifestParity;
use ArtisanPackUI\DesignSystem\Testing\Tests\Reference\BrokenProbe;
use ArtisanPackUI\DesignSystem\Testing\Tests\Reference\Probe;
use ArtisanPackUI\DesignSystem\Testing\Tests\TestCase;
use Illuminate\Support\Facades\Blade;
use PHPUnit\Framework\ExpectationFailedException;

/**
 * The expectations the TypeScript checks are held to, for the livewire stack.
 *
 * @return list<string>
 */
function brokenProbeExpectations(): array
{
	$expectations = json_decode( (string) file_get_contents( TestCase::REFERENCE . '/parity-expectations.json' ), true );

	return array_merge(
		$expectations['rendered'],
		array_map( static fn ( string $line ): string => str_replace( '{stack}', 'livewire', $line ), $expectations['declared'] ),
	);
}

it( 'passes the reference Probe, with its constructor and dispatched events', function (): void {
	expect( ManifestParity::forBlade( $this->probe() ) )->toBe( [] );
	expect( ManifestParity::declaredProps( Probe::class ) )->toBe( [ 'variant', 'color', 'size', 'disabled', 'loading', 'leadingIcon' ] );
	expect( ManifestParity::dispatchedEvents( ManifestParity::sources( Probe::class ) ) )->toBe( [ 'press' ] );
} );

it( 'reports the same drift in BrokenProbe as React and Vue', function (): void {
	Blade::component( 'artisanpack-probe', BrokenProbe::class );

	expect( ManifestParity::forBlade( $this->probe() ) )->toBe( brokenProbeExpectations() );
} );

it( 'ignores internal names and exempts effects', function (): void {
	Blade::component( 'artisanpack-probe', BrokenProbe::class );
	$problems = ManifestParity::forBlade( $this->probe(), [ 'ignoreDeclared' => [ 'tone', 'click' ], 'ignoreEffects' => [ 'leadingIcon' ] ] );

	expect( $problems )
		->not->toContain( 'prop tone: declared but not in the manifest' )
		->not->toContain( 'event click: emitted but not in the manifest' )
		->not->toContain( 'prop leadingIcon: has no effect on the markup' );
} );

it( 'reports a missing root and the wrong root element', function (): void {
	$parity = new ManifestParity( $this->probe() );

	expect( $parity->check( fn (): string => '<div></div>' ) )->toBe( [ 'root: no element with class "apui-probe"' ] );
	expect( array_slice( $parity->check( fn ( array $props ): string => sprintf(
		'<div class="apui-probe" data-variant="%s" data-size="%s" data-color="%s"></div>',
		$props['variant'] ?? '',
		$props['size'] ?? 'md',
		$props['color'] ?? 'primary',
	) ), 0, 2 ) )->toBe( [
		'root: renders <div>, expected button',
		'prop variant: the default renders data-variant="", expected data-variant="solid"',
	] );
} );

it( 'reads dispatched events and value binding, and nothing looser', function (): void {
	expect( ManifestParity::dispatchedEvents( [ '<div x-modelable="value" x-on:click="$dispatch(\'rowClick\')">', '$this->dispatch( \'row-click\' );' ] ) )
		->toBe( [ 'rowClick', 'wire:model', 'row-click' ] );
	expect( ManifestParity::dispatchedEvents( [ '$attributes->whereStartsWith( \'wire:model\' ); Event::dispatch( \'saved\' );' ] ) )
		->toBe( [] );
	expect( ManifestParity::dispatchedEvents( [ '<input data-part="control" {{ $attributes->except( \'class\' ) }} />' ] ) )
		->toBe( [ 'wire:model' ] );
	expect( ManifestParity::dispatchedEvents( [ "<select\n\tid=\"x\"\n\t{{ \$attributes->whereDoesntStartWith( 'class' ) }}>" ] ) )
		->toBe( [ 'wire:model' ] );
	expect( ManifestParity::dispatchedEvents( [ '<div {{ $attributes }}><input type="hidden" /></div>' ] ) )
		->toBe( [] );
	expect( ManifestParity::dispatchedEvents( [ '<input aria-invalid="{{ $errors->has( $field ) ? \'true\' : \'false\' }}" {{ $attributes->except( \'class\' ) }} />' ] ) )
		->toBe( [ 'wire:model' ] );
	expect( ManifestParity::dispatchedEvents( [ '<input id="{{ $attributes->get( \'id\' ) }}" /><div {{ $attributes }}></div>' ] ) )
		->toBe( [] );
	expect( ManifestParity::dispatchedEvents( [ '<input @class( [ \'is-invalid\' => $invalid ] ) {{ $attributes->except( \'class\' ) }} />' ] ) )
		->toBe( [ 'wire:model' ] );
} );

it( 'reports a root that disappears with the parts props', function (): void {
	$parity = new ManifestParity( $this->probe() );
	$render = fn ( array $props ): string => ( $props['loading'] ?? false ) && isset( $props['leadingIcon'] )
		? '<p>crashed</p>'
		: BladeFixtureHost::renderComponent( 'probe', $props, 'Probe' );

	expect( $parity->check( $render ) )->toContain( 'root: no element with class "apui-probe" with the fixture\'s parts props' );
} );

it( 'matches Zag\'s kebab-case part names to the manifest\'s camelCase ones (D-019)', function (): void {
	$data = json_decode( (string) file_get_contents( TestCase::REFERENCE . '/manifests/Probe.json' ), true );
	unset( $data['$schema'] );
	$data['parts'] = array_map(
		static fn ( array $part ): array => 'label' === $part['name'] ? [ ...$part, 'name' => 'itemText' ] : $part,
		$data['parts'],
	);
	$parity = new ManifestParity( ComponentManifest::fromArray( $data ) );
	$as     = static fn ( string $name ): Closure => static fn ( array $props ): string => str_replace(
		'data-part="label"',
		sprintf( 'data-part="%s"', $name ),
		BladeFixtureHost::renderComponent( 'probe', $props, 'Probe' ),
	);

	expect( $parity->check( $as( 'item-text' ) ) )->toBe( [] )
		->and( $parity->check( $as( 'itemText' ) ) )->toBe( [] )
		->and( $parity->check( $as( 'item-label' ) ) )->toBe( [
			'part itemText: missing [data-scope="probe"][data-part="itemText"]',
			'part item-label: rendered but not in the manifest',
		] );
} );

it( 'reports a component with no registered class, unless told it is anonymous', function (): void {
	Blade::anonymousComponentPath( __DIR__ . '/Reference/anonymous' );
	$data                       = $this->probe()->toArray();
	$data['stacks']['livewire'] = [ 'name' => 'ghost' ];
	$manifest                   = ArtisanPackUI\DesignSystem\Manifest\ComponentManifest::fromArray( $data );
	$problem                    = 'declared: no class component is registered for <x-artisanpack-ghost>, so its props and events can\'t be checked';

	expect( ManifestParity::forBlade( $manifest ) )->toBe( [ $problem ] )
		->and( ManifestParity::forBlade( $manifest, [ 'declared' => false ] ) )->toBe( [] );
} );

it( 'credits the events a behavior widget dispatches to the view that mounts it (D-019)', function (): void {
	expect( ManifestParity::dispatchedEvents( [ '<div x-data="apuiDropdownMenu( { open: false } )"></div>' ] ) )
		->toBe( [ 'open-change', 'select', 'checked-change' ] )
		->and( ManifestParity::dispatchedEvents( [ '<div x-data="apuiDialog({})"></div>' ] ) )->toBe( [ 'open-change' ] )
		->and( ManifestParity::dispatchedEvents( [ '<div x-data="apuiDialogue"></div>' ] ) )->toBe( [] )
		->and( ManifestParity::dispatchedEvents( [ "sprintf( 'apuiDialog({ id: %s })', \$id )" ] ) )->toBe( [ 'open-change' ] )
		->and( ManifestParity::dispatchedEvents( [ '{{-- Renders apuiDialog() around the panel --}}' ] ) )->toBe( [] );
} );
