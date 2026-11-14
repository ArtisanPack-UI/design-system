<x-artisanpack-carousel :label="__( 'Customer notes' )" :slides="$quotes" autoplay loop>
	@scope( 'slide', $quote )
		<x-artisanpack-card>
			<x-artisanpack-text size="lg">{{ $quote['text'] }}</x-artisanpack-text>
			<x-artisanpack-text size="sm" tone="muted">{{ $quote['author'] }}</x-artisanpack-text>
		</x-artisanpack-card>
	@endscope
</x-artisanpack-carousel>
