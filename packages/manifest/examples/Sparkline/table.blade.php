<table>
	<tbody>
		@foreach ( $properties as $property )
			<tr wire:key="property-{{ $property->id }}">
				<td>{{ $property->name }}</td>
				<td>{{ $property->visits }}</td>
				<td><x-artisanpack-sparkline :data="$property->weeklyVisits" :label="__( 'Visits from {first} to {latest}' )" /></td>
			</tr>
		@endforeach
	</tbody>
</table>
