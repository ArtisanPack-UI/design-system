<x-artisanpack-list variant="bordered">
	@foreach ( $members as $member )
		<x-artisanpack-list-item wire:key="member-{{ $member->id }}" :title="$member->name" :description="$member->email" :href="route( 'members.show', $member )">
			<x-slot:leading><x-artisanpack-avatar :name="$member->name" :src="$member->avatar_url" /></x-slot:leading>
			<x-slot:trailing><x-artisanpack-badge>{{ $member->role }}</x-artisanpack-badge></x-slot:trailing>
		</x-artisanpack-list-item>
	@endforeach
</x-artisanpack-list>
