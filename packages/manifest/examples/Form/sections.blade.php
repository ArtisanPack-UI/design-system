<x-artisanpack-form wire:submit="publish" divided :aria-label="__( 'Listing' )">
    <x-artisanpack-validation-summary />

    <x-artisanpack-fieldset variant="divided" :title="__( 'Location' )">
        <x-artisanpack-input wire:model="postalCode" :label="__( 'Postal code' )" />
    </x-artisanpack-fieldset>
    <x-artisanpack-fieldset variant="plain" :title="__( 'Agreements' )">
        <x-artisanpack-checkbox wire:model="terms" :label="__( 'I accept the listing terms' )" />
    </x-artisanpack-fieldset>

    <x-slot:actions>
        <x-artisanpack-button type="submit">{{ __( 'Publish listing' ) }}</x-artisanpack-button>
    </x-slot:actions>
</x-artisanpack-form>
