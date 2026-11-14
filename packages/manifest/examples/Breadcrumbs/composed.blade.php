<x-artisanpack-breadcrumbs>
	<x-artisanpack-breadcrumbs-item href="#" wire:click.prevent="setFolder( null )" :label="__( 'All media' )" />
	<x-artisanpack-breadcrumbs-item :label="$folder->name" />
</x-artisanpack-breadcrumbs>
