<x-artisanpack-menu
	:label="__( 'Settings' )"
	:collapsible="false"
	:items="[
		[ 'label' => __( 'Account' ), 'items' => [
			[ 'label' => __( 'Profile' ), 'href' => route( 'settings.profile' ), 'current' => request()->routeIs( 'settings.profile' ) ],
			[ 'label' => __( 'Security' ), 'href' => route( 'settings.security' ), 'current' => request()->routeIs( 'settings.security' ) ],
		] ],
		[ 'type' => 'separator' ],
		[ 'label' => __( 'Billing' ), 'href' => route( 'settings.billing' ), 'icon' => 'lock' ],
	]"
/>
