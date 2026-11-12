<x-artisanpack-page-header :title="$listing->name">
	<x-slot:meta>
		<x-artisanpack-badge color="warning">{{ __( 'Draft' ) }}</x-artisanpack-badge>
		{{ __( 'Edited :time', [ 'time' => $listing->updated_at->diffForHumans() ] ) }}
	</x-slot:meta>
	<x-slot:actions>
		<x-artisanpack-button variant="ghost" color="neutral" size="sm" leading-icon="eye">{{ __( 'Preview' ) }}</x-artisanpack-button>
		<x-artisanpack-button size="sm" wire:click="publish">{{ __( 'Publish' ) }}</x-artisanpack-button>
	</x-slot:actions>
</x-artisanpack-page-header>
