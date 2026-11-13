{{-- Inside a Livewire component with public string $view = 'agenda' and public string $date. --}}
<x-artisanpack-calendar
	:events="$events"
	:view="$view"
	:date="$date"
	creatable
	:details="false"
	x-on:view-change="$wire.set( 'view', $event.detail )"
	x-on:date-change="$wire.set( 'date', $event.detail )"
	x-on:event-click="$wire.editEvent( $event.detail.id )"
	x-on:create="$wire.createEvent( $event.detail )"
/>
