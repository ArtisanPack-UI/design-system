<x-artisanpack-drawer wire:model="sharing" side="bottom" :trigger="__( 'Share' )" :title="__( 'Share listing' )">
	<x-artisanpack-button variant="outline" color="neutral" leading-icon="copy" wire:click="copyLink">{{ __( 'Copy link' ) }}</x-artisanpack-button>
	<x-artisanpack-button variant="outline" color="neutral" leading-icon="mail" wire:click="email">{{ __( 'Email' ) }}</x-artisanpack-button>
</x-artisanpack-drawer>
