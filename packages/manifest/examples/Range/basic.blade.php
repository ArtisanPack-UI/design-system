<x-artisanpack-range
    wire:model.live="radius"
    :label="__( 'Search radius' )"
    :max="50"
    format="{value} km"
    :marks="[ [ 'value' => 0, 'label' => '0 km' ], [ 'value' => 25, 'label' => '25 km' ], [ 'value' => 50, 'label' => '50 km' ] ]"
/>
