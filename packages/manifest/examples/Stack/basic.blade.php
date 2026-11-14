<x-artisanpack-stack gap="4">
	<x-artisanpack-input :label="__( 'Name' )" wire:model="name" />
	<x-artisanpack-input :label="__( 'Email' )" type="email" wire:model="email" />
	<x-artisanpack-button wire:click="save">{{ __( 'Save' ) }}</x-artisanpack-button>
</x-artisanpack-stack>
