{{-- In a Livewire component with public array $selected = [] and public array $sortBy = [ 'column' => 'date', 'direction' => 'desc' ]. --}}
<x-artisanpack-table
	:title="__( 'Transaction history' )"
	:headers="[
		[ 'key' => 'symbol', 'label' => __( 'Product name' ), 'sortable' => true ],
		[ 'key' => 'amount', 'label' => __( 'Order amount' ), 'numeric' => true ],
		[ 'key' => 'date', 'label' => __( 'Date' ), 'sortable' => true ],
	]"
	:rows="$this->transactions"
	:sort-by="$sortBy"
	selectable
	wire:model.live="selected"
/>
