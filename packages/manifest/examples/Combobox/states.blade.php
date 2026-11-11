<x-artisanpack-combobox
	wire:model="ownerId"
	required
	clearable
	:label="__( 'Owner' )"
	:placeholder="__( 'Search people…' )"
	:options="$people"
/>

<x-artisanpack-combobox size="sm" :label="__( 'Small' )" :options="$people" />
<x-artisanpack-combobox size="lg" :label="__( 'Large' )" :options="$people" disabled />
