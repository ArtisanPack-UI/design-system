<x-artisanpack-navbar layout="island" surface="glass">
	<x-slot:brand>Socials</x-slot:brand>

	<x-slot:search>
		<x-artisanpack-input type="search" size="sm" leading-icon="search" :placeholder="__( 'Search' )" :aria-label="__( 'Search' )" wire:model.live.debounce="query" />
	</x-slot:search>

	<x-slot:actions>
		<x-artisanpack-button size="sm" leading-icon="plus" wire:click="create">{{ __( 'New page' ) }}</x-artisanpack-button>
	</x-slot:actions>
</x-artisanpack-navbar>
