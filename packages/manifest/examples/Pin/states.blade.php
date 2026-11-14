{{-- The error comes from $errors for the wire:model name. --}}
<x-artisanpack-pin wire:model="code" :label="__( 'Verification code' )" :group-size="3" />
<x-artisanpack-pin :label="__( 'Small' )" size="sm" :group-size="3" />
<x-artisanpack-pin :label="__( 'Disabled' )" value="503186" :group-size="3" disabled />
