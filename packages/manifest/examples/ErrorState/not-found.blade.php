<x-artisanpack-error-state variant="not-found" :heading-level="1" focus-title :title="__( 'This page doesn’t exist' )" :description="__( 'The listing may have been archived, or the link is mistyped.' )">
	<x-slot:actions>
		<x-artisanpack-button href="{{ route( 'dashboard' ) }}">{{ __( 'Go to dashboard' ) }}</x-artisanpack-button>
		<x-artisanpack-button variant="outline" color="neutral" leading-icon="search" href="{{ route( 'properties.index' ) }}">{{ __( 'Search properties' ) }}</x-artisanpack-button>
	</x-slot:actions>
</x-artisanpack-error-state>
