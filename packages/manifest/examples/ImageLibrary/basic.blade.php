{{-- The Livewire component uses the WithMediaSync trait, with public $files = [] and public Collection $library. --}}
<x-artisanpack-image-library
	wire:model="files"
	wire:library="library"
	:preview="$library"
	:label="__( 'Listing photos' )"
	:hint="__( 'PNG or JPEG, up to 10 MB.' )"
	accept="image/png, image/jpeg"
	droppable
/>

<x-artisanpack-button wire:click="save">{{ __( 'Save' ) }}</x-artisanpack-button>
