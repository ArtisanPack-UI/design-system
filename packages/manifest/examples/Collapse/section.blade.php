<x-artisanpack-collapse wire:model="showAdvanced" :label="__( 'Advanced settings' )">
	<x-artisanpack-input :label="__( 'Custom URL' )" prefix="horizonhomes.com/l/" wire:model="slug" />
	<x-artisanpack-toggle :label="__( 'Hide from search engines' )" wire:model="noindex" />
</x-artisanpack-collapse>
