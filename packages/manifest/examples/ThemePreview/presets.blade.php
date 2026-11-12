<x-artisanpack-theme-preview
	wire:model.live="preset"
	:label="__( 'Style preset' )"
	:options="[
		[ 'value' => 'strata', 'label' => __( 'Strata' ) ],
		[ 'value' => 'ledger', 'label' => __( 'Ledger' ), 'preset' => 'ledger' ],
		[ 'value' => 'harbor', 'label' => __( 'Harbor' ), 'preset' => 'harbor' ],
	]"
/>
