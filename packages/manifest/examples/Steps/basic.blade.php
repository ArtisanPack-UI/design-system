<x-artisanpack-steps wire:model="step" :label="__( 'Listing progress' )">
	<x-artisanpack-step :title="__( 'Basics' )" :description="__( 'Title and type' )" />
	<x-artisanpack-step :title="__( 'Location' )" :description="__( 'Address and map' )" />
	<x-artisanpack-step :title="__( 'Pricing' )" :description="__( 'Price and rent' )" />
	<x-artisanpack-step :title="__( 'Photos' )" :description="__( 'At least 6' )" />
	<x-artisanpack-step :title="__( 'Review' )" :description="__( 'Publish' )" />
</x-artisanpack-steps>
