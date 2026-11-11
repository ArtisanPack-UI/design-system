<x-artisanpack-radio-group
	wire:model="visibility"
	:label="__( 'Listing visibility' )"
	:options="[
		[ 'value' => 'public', 'label' => __( 'Public' ), 'description' => __( 'Anyone can find it in search.' ) ],
		[ 'value' => 'unlisted', 'label' => __( 'Unlisted' ), 'description' => __( 'Only people with the link.' ) ],
		[ 'value' => 'private', 'label' => __( 'Private' ), 'description' => __( 'Only you and co-owners.' ) ],
	]"
/>
