{{-- The component uses WithFileUploads; the list reads $photos and shows Livewire's upload progress. --}}
<x-artisanpack-file
	wire:model="photos"
	multiple
	accept="image/jpeg,image/png"
	:label="__( 'Listing photos' )"
	:title="__( 'Drop photos here or browse' )"
	:hint="__( 'JPG or PNG, up to 20 MB each, 12 files max' )"
/>
