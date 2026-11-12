<x-artisanpack-popover placement="top" :title="__( 'What counts as a visit?' )">
	<x-slot:trigger>
		<x-artisanpack-button variant="ghost" color="neutral" size="sm" icon-only leading-icon="info" :aria-label="__( 'About visits' )" />
	</x-slot:trigger>

	<p>{{ __( 'A unique person who opened the listing for at least 5 seconds, counted once a day.' ) }}</p>
</x-artisanpack-popover>
