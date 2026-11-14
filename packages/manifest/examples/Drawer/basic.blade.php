<x-artisanpack-drawer wire:model="showFilters" :trigger="__( 'Filters' )" :title="__( 'Filters' )" :description="__( ':count properties match', [ 'count' => $count ] )">
	<x-artisanpack-input :label="__( 'Location' )" leading-icon="search" wire:model="location" />
	<x-artisanpack-toggle :label="__( 'Only show pet friendly' )" wire:model="petFriendly" />

	<x-slot:footer>
		<x-artisanpack-button variant="ghost" color="neutral" wire:click="resetFilters">{{ __( 'Reset' ) }}</x-artisanpack-button>
		<x-artisanpack-button wire:click="$set( 'showFilters', false )">{{ __( 'Show :count results', [ 'count' => $count ] ) }}</x-artisanpack-button>
	</x-slot:footer>
</x-artisanpack-drawer>
