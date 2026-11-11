{{-- The error comes from $errors for the wire:model name. --}}
<x-artisanpack-password wire:model="passwordConfirmation" :label="__( 'Confirm password' )" autocomplete="new-password" />
<x-artisanpack-password :label="__( 'Current password' )" :error="__( 'That password is incorrect.' )" />
