{{-- The error comes from $errors for the wire:model name. --}}
<x-artisanpack-textarea wire:model="summary" :label="__( 'Summary' )" required />
<x-artisanpack-textarea :label="__( 'Imported text' )" value="Imported from the March listing feed." readonly />
<x-artisanpack-textarea :label="__( 'Internal notes' )" value="Locked while the listing is reviewed." disabled />
