<x-artisanpack-swap wire:model="menuOpen" :label="__( 'Menu' )" transition="rotate" on-icon="x" off-icon="list" size="lg" />

<x-artisanpack-swap wire:model="starred" :label="__( 'Starred' )" transition="none">
	<x-slot:on><x-artisanpack-icon name="star" color="warning" /></x-slot:on>
	<x-slot:off><x-artisanpack-icon name="star" /></x-slot:off>
</x-artisanpack-swap>
