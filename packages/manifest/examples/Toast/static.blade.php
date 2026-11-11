<x-artisanpack-toast color="success" :title="__( 'Listing saved' )" :description="__( 'Cedarwood Estates is live now.' )" />
<x-artisanpack-toast color="error" :title="__( 'Upload failed' )" :description="__( 'The file is larger than 10 MB.' )" />
<x-artisanpack-toast variant="inverse" :title="__( 'Listing archived' )">
	<x-slot:actions>
		<x-artisanpack-button size="sm" variant="outline" color="neutral">{{ __( 'Undo' ) }}</x-artisanpack-button>
	</x-slot:actions>
</x-artisanpack-toast>
