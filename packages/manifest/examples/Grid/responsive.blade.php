<x-artisanpack-grid :columns="4" min-item-width="16rem">
	@foreach ( $stats as $stat )
		<x-artisanpack-card wire:key="stat-{{ $stat->id }}" :title="$stat->label" />
	@endforeach
</x-artisanpack-grid>
