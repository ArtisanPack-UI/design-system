<x-artisanpack-table
	:label="__( 'Transactions' )"
	:headers="[
		[ 'key' => 'symbol', 'label' => __( 'Product name' ) ],
		[ 'key' => 'status', 'label' => __( 'Status' ) ],
	]"
	:rows="$transactions"
	expandable
>
	@scope( 'cell_status', $row )
		<x-artisanpack-badge :color="$row['color']" :value="$row['status']" />
	@endscope

	@scope( 'actions', $row )
		<x-artisanpack-button variant="ghost" size="sm" :href="route( 'transactions.show', $row['id'] )">
			{{ __( 'View' ) }}
		</x-artisanpack-button>
	@endscope

	@scope( 'expansion', $row )
		{{ $row['notes'] }}
	@endscope
</x-artisanpack-table>
