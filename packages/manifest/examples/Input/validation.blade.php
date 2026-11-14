{{-- The error comes from $errors for the wire:model name. --}}
<x-artisanpack-input wire:model="username" :label="__( 'Username' )" :hint="__( 'Letters and numbers only.' )" />
<x-artisanpack-input :label="__( 'Account ID' )" value="AP-20931" readonly />
<x-artisanpack-input :label="__( 'Team' )" value="Design" disabled />
