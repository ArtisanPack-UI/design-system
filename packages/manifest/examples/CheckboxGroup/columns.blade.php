<x-artisanpack-checkbox-group
	wire:model="amenities"
	:columns="3"
	:label="__( 'Amenities' )"
	:options="[
		[ 'value' => 'laundry', 'label' => __( 'In-unit laundry' ) ],
		[ 'value' => 'parking', 'label' => __( 'Parking' ) ],
		[ 'value' => 'terrace', 'label' => __( 'Rooftop terrace' ) ],
		[ 'value' => 'gym', 'label' => __( 'Gym' ) ],
		[ 'value' => 'bikes', 'label' => __( 'Bike storage' ) ],
		[ 'value' => 'pets', 'label' => __( 'Pets allowed' ) ],
	]"
/>
