<x-artisanpack-tabs
	size="sm"
	wire:model.live="range"
	:label="__( 'Range' )"
	:tabs="[
		[ 'value' => 'day', 'label' => __( 'Day' ) ],
		[ 'value' => 'week', 'label' => __( 'Week' ) ],
		[ 'value' => 'month', 'label' => __( 'Month' ) ],
		[ 'value' => 'year', 'label' => __( 'Year' ) ],
	]"
/>
