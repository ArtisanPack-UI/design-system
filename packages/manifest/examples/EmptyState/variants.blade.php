<x-artisanpack-empty-state :title="__( 'No properties yet' )" :description="__( 'Add your first property to start tracking visits, offers and revenue.' )">
	<x-slot:actions>
		<x-artisanpack-button leading-icon="plus" href="{{ route( 'properties.create' ) }}">{{ __( 'Add property' ) }}</x-artisanpack-button>
		<x-artisanpack-button variant="outline" color="neutral" leading-icon="upload">{{ __( 'Import CSV' ) }}</x-artisanpack-button>
	</x-slot:actions>
</x-artisanpack-empty-state>

<x-artisanpack-empty-state variant="no-results" :title="__( 'No results for “:search”', [ 'search' => $search ] )" :description="__( 'Check the spelling, or clear filters to see all properties.' )">
	<x-slot:actions>
		<x-artisanpack-button variant="outline" color="neutral" wire:click="clearFilters">{{ __( 'Clear filters' ) }}</x-artisanpack-button>
	</x-slot:actions>
</x-artisanpack-empty-state>

<x-artisanpack-empty-state variant="cleared" size="sm" :heading-level="4" :title="__( 'You’re all caught up' )" :description="__( 'New offers will appear here.' )" />
