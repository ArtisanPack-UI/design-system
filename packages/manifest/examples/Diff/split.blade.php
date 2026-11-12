<x-artisanpack-diff :old-content="$versionThree" :new-content="$versionFour" :file-name="__( 'Version 3 → Version 4' )" :view="$view">
	<x-slot:actions>
		<x-artisanpack-button size="xs" variant="ghost" color="neutral" wire:click="toggleView">
			{{ 'split' === $view ? __( 'Unified' ) : __( 'Split' ) }}
		</x-artisanpack-button>
	</x-slot:actions>
</x-artisanpack-diff>
