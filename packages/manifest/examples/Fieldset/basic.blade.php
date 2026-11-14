<x-artisanpack-fieldset :title="__( 'Contact' )" :description="__( 'Who buyers and renters should reach.' )">
    <div data-scope="fieldset" data-part="row">
        <x-artisanpack-input wire:model="name" :label="__( 'Full name' )" />
        <x-artisanpack-input wire:model="email" type="email" :label="__( 'Email' )" leading-icon="mail" />
    </div>
    <x-artisanpack-input wire:model="phone" type="tel" :label="__( 'Phone' )" />
</x-artisanpack-fieldset>
