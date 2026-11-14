<x-artisanpack-pin wire:model="pin" :label="__( 'PIN' )" :length="4" mask />
<x-artisanpack-pin wire:model="recoveryCode" :label="__( 'Recovery code' )" :length="8" type="alphanumeric" :group-size="4" />
