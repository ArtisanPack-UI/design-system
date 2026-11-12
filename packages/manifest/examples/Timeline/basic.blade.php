<x-artisanpack-timeline :label="__( 'Activity' )">
	<x-artisanpack-timeline-item icon="circle-check" color="success" :time="__( '2h ago' )" datetime="2026-11-12T08:00" :description="__( 'Phoenix Baker accepted $248,000.' )">
		<strong>{{ __( 'Offer accepted' ) }}</strong> {{ __( 'on Lakeview Lofts' ) }}
	</x-artisanpack-timeline-item>
	<x-artisanpack-timeline-item icon="message-square" :time="__( '5h ago' )" :card="__( 'Can we move the viewing to Thursday at 11:00?' )">
		<strong>Olivia Rhye</strong> {{ __( 'commented' ) }}
	</x-artisanpack-timeline-item>
	<x-artisanpack-timeline-item icon="house" color="primary" :time="__( 'Dec 13' )" datetime="2026-12-13" :title="__( 'Listing published' )" />
</x-artisanpack-timeline>
