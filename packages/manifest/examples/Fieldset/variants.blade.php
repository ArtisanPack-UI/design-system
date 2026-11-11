<x-artisanpack-fieldset variant="divided" :title="__( 'Billing address' )">
    <x-artisanpack-checkbox wire:model="sameAddress" :label="__( 'Same as property address' )" />
</x-artisanpack-fieldset>
<x-artisanpack-fieldset variant="plain" :title="__( 'Payout account' )" :description="__( 'Locked while a payout is processing.' )" disabled>
    <x-artisanpack-input :label="__( 'IBAN' )" value="ES91 •••• •••• 1332" />
</x-artisanpack-fieldset>
