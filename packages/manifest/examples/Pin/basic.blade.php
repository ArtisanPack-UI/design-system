{{-- `complete` fires with the code once every cell is filled. --}}
<x-artisanpack-pin
    wire:model="code"
    wire:complete="verify"
    :label="__( 'Verification code' )"
    :hint="__( 'Enter the 6-digit code we sent to your phone.' )"
    :group-size="3"
/>
