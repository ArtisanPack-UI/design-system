<x-artisanpack-accordion wire:model.live="openFaq">
	<x-artisanpack-accordion-item value="live" :title="__( 'How long does a listing stay live?' )">
		{{ __( 'Listings stay live until you archive them or mark them as sold. Drafts are kept for 90 days.' ) }}
	</x-artisanpack-accordion-item>
	<x-artisanpack-accordion-item value="owners" :title="__( 'Can co-owners edit a listing?' )">
		{{ __( 'Yes. Invite them from the listing\'s Sharing tab.' ) }}
	</x-artisanpack-accordion-item>
	<x-artisanpack-accordion-item value="files" :title="__( 'Which file types can I upload?' )">
		{{ __( 'Images, PDFs and floor plans up to 20 MB each.' ) }}
	</x-artisanpack-accordion-item>
</x-artisanpack-accordion>
