<x-artisanpack-select
	wire:model="country"
	:label="__( 'Country' )"
	:options="[
		[ 'value' => 'us', 'label' => __( 'United States' ) ],
		[ 'value' => 'ca', 'label' => __( 'Canada' ) ],
		[ 'value' => 'mx', 'label' => __( 'Mexico' ) ],
	]"
/>
