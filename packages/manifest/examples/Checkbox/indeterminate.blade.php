{{-- $selected holds the checked row ids; $rows is the list. --}}
<x-artisanpack-checkbox
	:label="__( 'Select all' )"
	:checked="count( $selected ) === count( $rows )"
	:indeterminate="count( $selected ) > 0 && count( $selected ) < count( $rows )"
	wire:click="toggleAll"
/>
