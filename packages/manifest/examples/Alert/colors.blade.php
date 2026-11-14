<x-artisanpack-alert color="info" :title="__( 'New reporting period' )" :description="__( 'Q4 numbers are now available in Analytics.' )" />
<x-artisanpack-alert color="warning" :title="__( 'Your monthly traffic is close to the limit' )" :description="__( 'You’ve used 92% of 50,000 visits. Upgrade to avoid throttling.' )">
	<x-slot:actions>
		<x-artisanpack-button size="xs" color="warning">{{ __( 'Upgrade' ) }}</x-artisanpack-button>
		<x-artisanpack-button size="xs" variant="ghost" color="neutral">{{ __( 'Learn more' ) }}</x-artisanpack-button>
	</x-slot:actions>
</x-artisanpack-alert>
<x-artisanpack-alert color="error" :title="__( 'Payment failed' )">
	{{ __( 'We couldn’t charge the card ending in 4242. Update it to keep your listings active.' ) }}
</x-artisanpack-alert>
