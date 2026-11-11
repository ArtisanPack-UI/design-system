{{-- Once per page, outside Livewire components (it's wire:ignore), such as in the layout. --}}
<x-artisanpack-toaster />

{{-- In a Livewire component's action: --}}
{{-- $this->dispatch( 'toast', title: __( 'Listing saved' ), description: __( 'Cedarwood Estates is live now.' ), color: 'success' ); --}}
<x-artisanpack-button wire:click="save">{{ __( 'Save listing' ) }}</x-artisanpack-button>
