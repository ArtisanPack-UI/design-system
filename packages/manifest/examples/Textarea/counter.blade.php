<x-artisanpack-textarea
    wire:model.live="description"
    :label="__( 'Description' )"
    :placeholder="__( 'Describe the property, nearby amenities and anything renters should know…' )"
    :max-length="500"
    auto-resize
/>
