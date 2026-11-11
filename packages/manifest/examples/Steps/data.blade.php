<x-artisanpack-steps wire:model.live="step" clickable :label="__( 'Checkout progress' )" :steps="[
	[ 'title' => __( 'Cart' ) ],
	[ 'title' => __( 'Shipping' ) ],
	[ 'title' => __( 'Payment' ) ],
	[ 'title' => __( 'Confirm' ) ],
]" />
