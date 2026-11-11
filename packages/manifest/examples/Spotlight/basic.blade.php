<x-artisanpack-spotlight
	:trigger="__( 'Search' )"
	:groups="[
		[
			'label' => __( 'Pages' ),
			'items' => [
				[ 'label' => __( 'Dashboard' ), 'href' => route( 'dashboard' ), 'icon' => 'house' ],
				[ 'label' => __( 'Reports' ), 'href' => route( 'reports' ), 'icon' => 'file-text', 'keywords' => [ 'analytics' ] ],
				[ 'label' => __( 'Settings' ), 'href' => route( 'settings' ), 'icon' => 'settings' ],
			],
		],
		[
			'label' => __( 'Actions' ),
			'items' => [
				[ 'value' => 'add-property', 'label' => __( 'Add property' ), 'icon' => 'plus', 'color' => 'success', 'shortcut' => '⌘ N' ],
				[ 'value' => 'import', 'label' => __( 'Import listings from CSV' ), 'icon' => 'upload' ],
			],
		],
	]"
	recent
	wire:select="run( $event.detail.value )"
/>
