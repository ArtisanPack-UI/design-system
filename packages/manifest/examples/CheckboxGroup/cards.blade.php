<x-artisanpack-checkbox-group
	wire:model="channels"
	variant="cards"
	:columns="3"
	:label="__( 'Channels' )"
	:options="[
		[ 'value' => 'email', 'label' => __( 'Email' ), 'description' => 'olivia@company.com' ],
		[ 'value' => 'sms', 'label' => __( 'SMS' ), 'description' => '•••• 4821' ],
		[ 'value' => 'push', 'label' => __( 'Push' ), 'description' => __( '2 devices' ) ],
	]"
/>
