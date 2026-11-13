<x-artisanpack-theme-preview
	wire:model.live="theme"
	:label="__( 'Appearance' )"
	:options="[
		[ 'value' => 'light', 'label' => __( 'Light' ) ],
		[ 'value' => 'dark', 'label' => __( 'Dark' ) ],
		[ 'value' => 'high-contrast', 'label' => __( 'High contrast' ) ],
		[ 'value' => 'system', 'label' => __( 'System' ) ],
	]"
/>
