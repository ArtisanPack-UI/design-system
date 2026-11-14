<x-artisanpack-table
	:title="__( 'Transaction history' )"
	:headers="[
		[ 'key' => 'symbol', 'label' => __( 'Product name' ), 'secondary' => 'company' ],
		[ 'key' => 'amount', 'label' => __( 'Order amount' ), 'numeric' => true ],
		[ 'key' => 'date', 'label' => __( 'Date' ) ],
		[ 'key' => 'owner.name', 'label' => __( 'Executed by' ) ],
	]"
	:rows="$transactions"
	density="compact"
/>
