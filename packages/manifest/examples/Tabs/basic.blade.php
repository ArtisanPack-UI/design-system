<x-artisanpack-tabs wire:model.live="section" :label="__( 'Account' )">
	<x-artisanpack-tab value="profile" :label="__( 'Profile' )" icon="user">
		<livewire:account.profile />
	</x-artisanpack-tab>
	<x-artisanpack-tab value="notifications" :label="__( 'Notifications' )" icon="mail">
		<livewire:account.notifications />
	</x-artisanpack-tab>
	<x-artisanpack-tab value="security" :label="__( 'Security' )" icon="lock">
		<livewire:account.security />
	</x-artisanpack-tab>
</x-artisanpack-tabs>
