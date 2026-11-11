<x-artisanpack-select
	wire:model="propertyType"
	:label="__( 'Property type' )"
	:options="[
		[ 'label' => __( 'Apartments' ), 'options' => [
			[ 'value' => 'studio', 'label' => __( 'Studio' ) ],
			[ 'value' => 'loft', 'label' => __( 'Loft' ) ],
		] ],
		[ 'label' => __( 'Houses' ), 'options' => [
			[ 'value' => 'townhouse', 'label' => __( 'Townhouse' ) ],
			[ 'value' => 'detached', 'label' => __( 'Detached house' ) ],
		] ],
	]"
/>
