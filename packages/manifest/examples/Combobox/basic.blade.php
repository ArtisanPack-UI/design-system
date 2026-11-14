<x-artisanpack-combobox
	wire:model="propertyId"
	:label="__( 'Property' )"
	leading-icon="search"
	:options="[
		[ 'value' => 'lakeview', 'label' => 'Lakeview Lofts', 'description' => __( 'United States, Chicago' ) ],
		[ 'value' => 'lakeside', 'label' => 'Lakeside Commons', 'description' => __( 'Canada, Toronto' ) ],
		[ 'value' => 'silver-lake', 'label' => 'Silver Lake Bungalows', 'description' => __( 'United States, Los Angeles' ) ],
	]"
/>
