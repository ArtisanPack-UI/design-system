{{-- In a Livewire component that uses WithPagination, with public int $perPage = 10: $transactions = Transaction::paginate( $this->perPage ). --}}
<x-artisanpack-table
	:title="__( 'Transaction history' )"
	:headers="$headers"
	:rows="$transactions"
	paginated
	per-page="perPage"
	:footer="__( ':count transactions', [ 'count' => $transactions->total() ] )"
/>
