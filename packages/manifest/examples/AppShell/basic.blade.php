<x-artisanpack-app-shell>
	<x-slot:brand>
		<a href="{{ route( 'dashboard' ) }}">Apexify</a>
	</x-slot:brand>
	<x-slot:sidebar>
		<x-artisanpack-menu :label="__( 'Main' )" activate-by-route>
			<x-artisanpack-menu-item :href="route( 'dashboard' )" icon="house">{{ __( 'Dashboard' ) }}</x-artisanpack-menu-item>
			<x-artisanpack-menu-item :href="route( 'inbox' )" icon="inbox" badge="4">{{ __( 'Inbox' ) }}</x-artisanpack-menu-item>
			<x-artisanpack-menu-title>{{ __( 'Workspace' ) }}</x-artisanpack-menu-title>
			<x-artisanpack-menu-item :href="route( 'settings' )" icon="settings">{{ __( 'Settings' ) }}</x-artisanpack-menu-item>
		</x-artisanpack-menu>
	</x-slot:sidebar>
	<x-slot:header>
		<x-artisanpack-navbar layout="island" :sticky="false">
			<x-slot:actions>
				<x-artisanpack-button variant="ghost" color="neutral" leading-icon="log-out" icon-only :aria-label="__( 'Log out' )" />
			</x-slot:actions>
		</x-artisanpack-navbar>
	</x-slot:header>
	<x-slot:footer>
		{{ auth()->user()->name }}
	</x-slot:footer>

	<x-artisanpack-page-header :title="__( 'Dashboard' )" />
	{{ $slot }}
</x-artisanpack-app-shell>
