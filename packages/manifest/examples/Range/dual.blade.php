{{-- wire:model binds the [from, to] array. --}}
<x-artisanpack-range
    wire:model.live="price"
    :label="__( 'Price' )"
    dual
    :min="100"
    :max="700"
    :step="10"
    format="${value}k"
    show-value="always"
/>
