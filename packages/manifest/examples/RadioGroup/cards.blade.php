<x-artisanpack-radio-group
	wire:model="plan"
	variant="cards"
	orientation="horizontal"
	:label="__( 'Plan' )"
	:options="[
		[ 'value' => 'starter', 'label' => __( 'Starter' ), 'description' => __( 'Up to 5 listings' ), 'meta' => __( '$0 / month' ) ],
		[ 'value' => 'growth', 'label' => __( 'Growth' ), 'description' => __( 'Up to 50 listings and analytics' ), 'meta' => __( '$39 / month' ) ],
		[ 'value' => 'portfolio', 'label' => __( 'Portfolio' ), 'description' => __( 'Unlimited listings, team seats' ), 'meta' => __( '$129 / month' ) ],
	]"
/>
