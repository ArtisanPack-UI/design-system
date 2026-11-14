<x-artisanpack-error-state :title="__( 'Couldn’t load transactions' )" :description="__( 'The payments service didn’t respond. Your data is safe; try again in a moment.' )" :code="__( 'Error :status · :reference', [ 'status' => 503, 'reference' => $requestId ] )">
	<x-slot:actions>
		<x-artisanpack-button leading-icon="refresh-cw" wire:click="retry">{{ __( 'Try again' ) }}</x-artisanpack-button>
		<x-artisanpack-button variant="ghost" color="neutral" trailing-icon="external-link" href="https://status.example.com">{{ __( 'Status page' ) }}</x-artisanpack-button>
	</x-slot:actions>
</x-artisanpack-error-state>

<x-artisanpack-error-state variant="offline" :title="__( 'You’re offline' )" :description="__( 'Changes are saved on this device and will sync when you reconnect.' )" />
