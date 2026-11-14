<x-artisanpack-color-picker
	wire:model="brand"
	required
	:alpha="false"
	:label="__( 'Brand color' )"
	:error="__( 'Enter a color, such as #1f74bf.' )"
/>
<x-artisanpack-color-picker disabled value="#23272b" :label="__( 'Locked color' )" />
