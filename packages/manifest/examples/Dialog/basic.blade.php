<x-artisanpack-dialog wire:model="showInvite" :trigger="__( 'Invite member' )" :title="__( 'Invite member' )" :description="__( 'They\'ll get an email with a link to join the project.' )">
	<x-artisanpack-input type="email" :label="__( 'Email' )" wire:model="email" />

	<x-slot:footer>
		<x-artisanpack-button variant="outline" color="neutral" wire:click="$set( 'showInvite', false )">{{ __( 'Cancel' ) }}</x-artisanpack-button>
		<x-artisanpack-button wire:click="invite">{{ __( 'Send invite' ) }}</x-artisanpack-button>
	</x-slot:footer>
</x-artisanpack-dialog>
