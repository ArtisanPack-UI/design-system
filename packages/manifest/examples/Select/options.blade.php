<x-artisanpack-select wire:model="plan" :label="__( 'Plan' )" leading-icon="user">
	<option value="starter">{{ __( 'Starter' ) }}</option>
	<option value="team">{{ __( 'Team' ) }}</option>
	<option value="enterprise" disabled>{{ __( 'Enterprise (contact us)' ) }}</option>
</x-artisanpack-select>
