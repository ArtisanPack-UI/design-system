<x-artisanpack-kpi-card
	:stat="[ 'label' => __( 'Total income' ), 'value' => '$348,261', 'change' => 10.9, 'description' => __( 'vs last month' ) ]"
	:sparkline="[ 1, 3, 2, 7, 6, 10, 12, 11, 16 ]"
>
	<x-slot:period>
		<x-artisanpack-select wire:model.live="period" :label="__( 'Period' )" :options="[ [ 'value' => 'month', 'label' => __( 'This month' ) ], [ 'value' => 'quarter', 'label' => __( 'This quarter' ) ] ]" size="sm" />
	</x-slot:period>
</x-artisanpack-kpi-card>
