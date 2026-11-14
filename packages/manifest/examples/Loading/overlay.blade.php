<x-artisanpack-card :title="__( 'Weekly revenue' )" style="position: relative" wire:loading.attr="aria-busy" wire:target="range">
	{{-- … --}}
	<x-artisanpack-loading overlay size="lg" wire:loading wire:target="range">{{ __( 'Loading revenue…' ) }}</x-artisanpack-loading>
</x-artisanpack-card>
