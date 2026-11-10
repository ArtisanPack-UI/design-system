<x-artisanpack-card :title="__( 'Quarterly report' )" :description="__( 'Updated 2 hours ago' )">
	<x-slot:actions>
		<x-artisanpack-button variant="ghost" color="neutral" size="sm">{{ __( 'Share' ) }}</x-artisanpack-button>
	</x-slot:actions>

	{{ __( 'Revenue grew 12% this quarter, led by renewals.' ) }}

	<x-slot:footer>
		<x-artisanpack-button variant="outline" color="neutral">{{ __( 'Dismiss' ) }}</x-artisanpack-button>
		<x-artisanpack-button>{{ __( 'Open report' ) }}</x-artisanpack-button>
	</x-slot:footer>
</x-artisanpack-card>
