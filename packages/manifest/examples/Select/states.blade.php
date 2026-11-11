<x-artisanpack-select
	wire:model="timezone"
	:label="__( 'Time zone' )"
	:hint="__( 'Used for reports and reminders.' )"
	:options="[ 'UTC', 'America/New_York', 'Europe/Paris' ]"
	required
/>
<x-artisanpack-select :label="__( 'Region' )" :options="[ __( 'North America' ) ]" disabled />
