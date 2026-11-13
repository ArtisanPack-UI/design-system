<x-artisanpack-chart
	type="area"
	:title="__( 'Analytic' )"
	:description="__( 'Sales estimation vs target' )"
	:labels="$quarters"
	:series="[ [ 'name' => __( 'Sales' ), 'data' => $sales ], [ 'name' => __( 'Target' ), 'data' => $targets ] ]"
	prefix="$"
	notation="compact"
	:width="1000"
	:height="260"
	wire:poll.30s
>
	<x-slot:actions>
		<x-artisanpack-select wire:model.live="range" :label="__( 'Range' )" :options="[ [ 'value' => '2y', 'label' => __( 'Two years' ) ], [ 'value' => '1y', 'label' => __( 'One year' ) ] ]" size="sm" />
	</x-slot:actions>
</x-artisanpack-chart>
