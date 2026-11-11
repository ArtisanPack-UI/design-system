<x-artisanpack-steps :value="3" orientation="vertical">
	<x-artisanpack-step :title="__( 'Account created' )" :description="__( 'Nov 2 · Olivia Rhye' )" />
	<x-artisanpack-step :title="__( 'Identity verified' )" :description="__( 'Nov 3' )" />
	<x-artisanpack-step state="error" :title="__( 'Payout account' )" :description="__( 'IBAN rejected by the bank. Update it to continue.' )" />
	<x-artisanpack-step :title="__( 'Go live' )" :description="__( 'Listings become public' )" />
</x-artisanpack-steps>
