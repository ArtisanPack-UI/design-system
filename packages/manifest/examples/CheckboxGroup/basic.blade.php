<x-artisanpack-checkbox-group
	wire:model="notifications"
	select-all
	:label="__( 'Notify me about' )"
	:options="[
		[ 'value' => 'offers', 'label' => __( 'New offers' ), 'description' => __( 'Within an hour of submission' ) ],
		[ 'value' => 'prices', 'label' => __( 'Price changes in saved searches' ) ],
		[ 'value' => 'digest', 'label' => __( 'Weekly analytics digest' ) ],
		[ 'value' => 'news', 'label' => __( 'Product news' ) ],
	]"
/>
