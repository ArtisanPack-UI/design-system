<x-artisanpack-radio-group
	wire:model.live="period"
	variant="segmented"
	orientation="horizontal"
	:label="__( 'Billing period' )"
	:options="[
		[ 'value' => 'monthly', 'label' => __( 'Monthly' ) ],
		[ 'value' => 'quarterly', 'label' => __( 'Quarterly' ) ],
		[ 'value' => 'yearly', 'label' => __( 'Yearly' ) ],
	]"
/>
