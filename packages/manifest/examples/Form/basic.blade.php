<x-artisanpack-form wire:submit="save" :aria-label="__( 'Invite member' )">
    <x-artisanpack-input wire:model="email" type="email" :label="__( 'Email' )" required />
    <x-artisanpack-textarea wire:model="message" :label="__( 'Message' )" rows="3" />

    <x-slot:actions>
        <x-artisanpack-button variant="ghost" wire:click="cancel">{{ __( 'Cancel' ) }}</x-artisanpack-button>
        <x-artisanpack-button type="submit">{{ __( 'Send invite' ) }}</x-artisanpack-button>
    </x-slot:actions>
</x-artisanpack-form>
