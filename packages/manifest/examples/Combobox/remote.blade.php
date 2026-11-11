{{-- In the component: public ?string $ownerId = null; public string $ownerSearch = ''; --}}
{{-- and an `owners` computed property that filters by $this->ownerSearch. --}}
<x-artisanpack-combobox
	wire:model="ownerId"
	search-model="ownerSearch"
	:debounce="300"
	remote
	:label="__( 'Owner' )"
	:placeholder="__( 'Search people…' )"
	:options="$this->owners"
>
	<x-slot:empty>
		{{ __( 'No people match. Check the spelling or' ) }}
		<a href="{{ route( 'people.create' ) }}">{{ __( 'add a person' ) }}</a>.
	</x-slot:empty>
</x-artisanpack-combobox>
