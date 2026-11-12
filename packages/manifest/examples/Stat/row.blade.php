<x-artisanpack-grid :columns="3">
	<x-artisanpack-stat :label="__( 'Total income' )" value="$348,261" icon="wallet" color="primary" :change="10.9" :description="__( 'vs last month' )" emphasis />
	<x-artisanpack-stat :label="__( 'Profit' )" value="$15,708.98" icon="trending-up" color="success" :change="8.1" :description="__( 'vs last month' )" />
	<x-artisanpack-stat :label="__( 'Hours listened' )" value="34.6" delta="6.2 hrs" trend="up" :description="__( 'this week' )" />
</x-artisanpack-grid>
