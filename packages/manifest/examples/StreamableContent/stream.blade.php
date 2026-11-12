{{-- In the Livewire component: $this->state = 'streaming'; then $this->stream( to: 'summary', content: $chunk ); --}}
<x-artisanpack-card>
	<x-artisanpack-streamable-content target="summary" :state="$state" wire:stop="cancel">
		{{ $summary }}

		<x-slot:actions>
			@if ( 'done' === $state )
				<x-artisanpack-button size="xs" variant="ghost" color="neutral" leading-icon="copy">{{ __( 'Copy' ) }}</x-artisanpack-button>
				<x-artisanpack-button size="xs" variant="ghost" color="neutral" leading-icon="refresh-cw" wire:click="regenerate">{{ __( 'Regenerate' ) }}</x-artisanpack-button>
			@elseif ( 'error' === $state )
				<x-artisanpack-button size="xs" variant="outline" color="neutral" leading-icon="rotate-ccw" wire:click="continue">{{ __( 'Continue' ) }}</x-artisanpack-button>
			@endif
		</x-slot:actions>
	</x-artisanpack-streamable-content>
</x-artisanpack-card>
