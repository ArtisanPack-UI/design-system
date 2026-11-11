<x-artisanpack-navbar>
	<x-slot:brand>
		<a href="{{ route( 'home' ) }}">Horizon</a>
	</x-slot:brand>

	<x-artisanpack-navbar-item :href="route( 'properties' )" :current="request()->routeIs( 'properties' )">{{ __( 'Properties' ) }}</x-artisanpack-navbar-item>
	<x-artisanpack-navbar-item :href="route( 'analytics' )" :current="request()->routeIs( 'analytics' )">{{ __( 'Analytics' ) }}</x-artisanpack-navbar-item>
	<x-artisanpack-navbar-item :href="route( 'tools' )" :current="request()->routeIs( 'tools' )">{{ __( 'Tools & calculators' ) }}</x-artisanpack-navbar-item>

	<x-slot:actions>
		<x-artisanpack-button variant="ghost" color="neutral" size="sm" :href="route( 'login' )">{{ __( 'Sign in' ) }}</x-artisanpack-button>
		<x-artisanpack-button size="sm" :href="route( 'register' )">{{ __( 'Get started' ) }}</x-artisanpack-button>
	</x-slot:actions>
</x-artisanpack-navbar>
