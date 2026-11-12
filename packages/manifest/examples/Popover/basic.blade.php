<x-artisanpack-popover :trigger="__( 'Share' )" :title="__( 'Share report' )">
	<x-artisanpack-input :label="__( 'Link' )" readonly :value="$shareUrl" />

	<x-slot:actions>
		<x-artisanpack-button size="sm" leading-icon="copy" wire:click="copyLink">{{ __( 'Copy link' ) }}</x-artisanpack-button>
	</x-slot:actions>
</x-artisanpack-popover>
