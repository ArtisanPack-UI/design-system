<x-artisanpack-dialog wire:model="confirmingDelete" role="alertdialog" size="sm" color="error" icon="trash" :title="__( 'Delete Cedarwood Estates?' )" :description="__( 'The listing and its 3 open offers will be removed. This can\'t be undone.' )">
	<x-slot:footer>
		<x-artisanpack-button variant="outline" color="neutral" wire:click="$set( 'confirmingDelete', false )">{{ __( 'Cancel' ) }}</x-artisanpack-button>
		<x-artisanpack-button color="error" wire:click="delete">{{ __( 'Delete listing' ) }}</x-artisanpack-button>
	</x-slot:footer>
</x-artisanpack-dialog>
