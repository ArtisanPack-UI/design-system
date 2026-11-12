<x-artisanpack-page-header :title="__( 'Dashboard' )" :description="__( 'Income, profit and transactions across all stores.' )">
	<x-slot:breadcrumbs>
		<x-artisanpack-breadcrumbs :items="[ [ 'label' => 'Apexify', 'href' => route( 'home' ) ], [ 'label' => __( 'Dashboard' ) ] ]" />
	</x-slot:breadcrumbs>
	<x-slot:actions>
		<x-artisanpack-button variant="outline" color="neutral" size="sm" leading-icon="calendar">{{ __( 'Last 30 days' ) }}</x-artisanpack-button>
		<x-artisanpack-button size="sm">{{ __( 'Share' ) }}</x-artisanpack-button>
	</x-slot:actions>
	<x-slot:tabs>
		<x-artisanpack-tabs variant="underline" wire:model.live="view" :tabs="[ [ 'value' => 'overview', 'label' => __( 'Overview' ) ], [ 'value' => 'history', 'label' => __( 'Trade history' ) ] ]" />
	</x-slot:tabs>
</x-artisanpack-page-header>
