<x-artisanpack-tabs variant="underline" activation-mode="manual" wire:model.live="view">
	<x-artisanpack-tab value="overview" :label="__( 'Overview' )">
		@include( 'trades.overview' )
	</x-artisanpack-tab>
	<x-artisanpack-tab value="notifications" :label="__( 'Notifications' )" :count="$unread">
		@include( 'trades.notifications' )
	</x-artisanpack-tab>
	<x-artisanpack-tab value="history" :label="__( 'Trade history' )">
		@include( 'trades.history' )
	</x-artisanpack-tab>
	<x-artisanpack-tab value="archived" :label="__( 'Archived' )" disabled />
</x-artisanpack-tabs>
