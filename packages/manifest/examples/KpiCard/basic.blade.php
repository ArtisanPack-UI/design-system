<x-artisanpack-kpi-card
	:stat="[
		'label' => __( 'Profit' ),
		'value' => '$15,708.98',
		'icon' => 'trending-up',
		'color' => 'success',
		'change' => 8.1,
		'description' => __( 'vs last month' ),
	]"
	:sparkline="[ 2, 4, 2, 6, 8, 6, 10, 12, 14 ]"
	:target="[ 'value' => 15708.98, 'max' => 25000, 'label' => __( 'Goal $25,000' ) ]"
/>
