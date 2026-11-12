<x-artisanpack-app-shell collapsible wire:model.live="sidebarCollapsed" sidebar-width="280px">
	<x-slot:brand>Apexify</x-slot:brand>
	<x-slot:sidebar>
		<x-artisanpack-menu :label="__( 'Main' )" activate-by-route>
			<x-artisanpack-menu-item :href="route( 'dashboard' )" icon="house">{{ __( 'Dashboard' ) }}</x-artisanpack-menu-item>
			<x-artisanpack-menu-item :href="route( 'settings' )" icon="settings">{{ __( 'Settings' ) }}</x-artisanpack-menu-item>
		</x-artisanpack-menu>
	</x-slot:sidebar>

	{{ $slot }}
</x-artisanpack-app-shell>
