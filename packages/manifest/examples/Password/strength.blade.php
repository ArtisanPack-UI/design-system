<x-artisanpack-password
    wire:model.live="newPassword"
    :label="__( 'New password' )"
    autocomplete="new-password"
    leading-icon="lock"
    strength-meter
    :requirements="[
        [ 'label' => __( 'At least 12 characters' ), 'pattern' => '.{12,}' ],
        [ 'label' => __( 'One number' ), 'pattern' => '\d' ],
        [ 'label' => __( 'One symbol' ), 'pattern' => '[^A-Za-z0-9]' ],
    ]"
/>
