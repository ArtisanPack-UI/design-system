<x-artisanpack-accordion variant="separated" multiple :value="[ 'billing' ]">
	<x-artisanpack-accordion-item value="billing" :title="__( 'Billing' )">
		{{ __( 'Invoices go to the account owner on the first of each month.' ) }}
	</x-artisanpack-accordion-item>
	<x-artisanpack-accordion-item value="seats" :title="__( 'Seats' )">
		{{ __( 'Add or remove seats at any time; changes are prorated.' ) }}
	</x-artisanpack-accordion-item>
</x-artisanpack-accordion>

<x-artisanpack-card>
	<x-artisanpack-accordion variant="flush" :heading-level="4">
		<x-artisanpack-accordion-item value="details" :title="__( 'Listing details' )">
			{{ __( 'Three bedrooms, two bathrooms, 118 m².' ) }}
		</x-artisanpack-accordion-item>
	</x-artisanpack-accordion>
</x-artisanpack-card>
