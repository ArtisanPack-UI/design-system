<x-artisanpack-menu :label="__( 'Main' )" activate-by-route>
	<x-artisanpack-menu-item :href="route( 'dashboard' )" icon="list">{{ __( 'Dashboard' ) }}</x-artisanpack-menu-item>
	<x-artisanpack-menu-sub :label="__( 'Properties' )" icon="settings">
		<x-artisanpack-menu-item :href="route( 'properties.index' )">{{ __( 'All properties' ) }}</x-artisanpack-menu-item>
		<x-artisanpack-menu-item :href="route( 'properties.drafts' )" badge="3">{{ __( 'Drafts' ) }}</x-artisanpack-menu-item>
	</x-artisanpack-menu-sub>
	<x-artisanpack-menu-item :href="route( 'inbox' )" icon="mail" :badge="$unread">{{ __( 'Inbox' ) }}</x-artisanpack-menu-item>
	<x-artisanpack-menu-title>{{ __( 'Settings' ) }}</x-artisanpack-menu-title>
	<x-artisanpack-menu-item :href="route( 'team' )" icon="user">{{ __( 'Team' ) }}</x-artisanpack-menu-item>
	<x-artisanpack-menu-separator />
	<x-artisanpack-menu-item :href="route( 'billing' )" disabled>{{ __( 'Billing' ) }}</x-artisanpack-menu-item>
</x-artisanpack-menu>
