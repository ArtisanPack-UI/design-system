<x-artisanpack-dropdown-menu :label="__( 'Options' )">
	<x-artisanpack-dropdown-menu-group :label="__( 'Listing' )">
		<x-artisanpack-dropdown-menu-item value="edit" icon="pencil" shortcut="E" wire:click="edit">{{ __( 'Edit' ) }}</x-artisanpack-dropdown-menu-item>
		<x-artisanpack-dropdown-menu-item value="duplicate" icon="copy" wire:click="duplicate">{{ __( 'Duplicate' ) }}</x-artisanpack-dropdown-menu-item>
		<x-artisanpack-dropdown-menu-item value="archive" disabled>{{ __( 'Archive' ) }}</x-artisanpack-dropdown-menu-item>
	</x-artisanpack-dropdown-menu-group>
	<x-artisanpack-dropdown-menu-separator />
	<x-artisanpack-dropdown-menu-item value="delete" icon="trash" color="error" wire:click="delete">{{ __( 'Delete' ) }}</x-artisanpack-dropdown-menu-item>
</x-artisanpack-dropdown-menu>
