<x-artisanpack-date-picker
	wire:model="stay"
	mode="range"
	:label="__( 'Stay' )"
	:min="now()->toDateString()"
	:disabled-dates="$blackoutDates"
/>
