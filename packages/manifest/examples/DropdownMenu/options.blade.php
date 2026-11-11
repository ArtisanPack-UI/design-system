<x-artisanpack-dropdown-menu :label="__( 'View' )" align="end">
	<x-artisanpack-dropdown-menu-item type="checkbox" value="grid" :checked="$showGrid" wire:click="$toggle( 'showGrid' )">{{ __( 'Show grid' ) }}</x-artisanpack-dropdown-menu-item>
	<x-artisanpack-dropdown-menu-separator />
	<x-artisanpack-dropdown-menu-group :label="__( 'Sort by' )">
		<x-artisanpack-dropdown-menu-item type="radio" value="newest" :checked="'newest' === $sort" wire:click="$set( 'sort', 'newest' )">{{ __( 'Newest' ) }}</x-artisanpack-dropdown-menu-item>
		<x-artisanpack-dropdown-menu-item type="radio" value="price" :checked="'price' === $sort" wire:click="$set( 'sort', 'price' )">{{ __( 'Price' ) }}</x-artisanpack-dropdown-menu-item>
	</x-artisanpack-dropdown-menu-group>
</x-artisanpack-dropdown-menu>
