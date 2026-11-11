<x-artisanpack-input wire:model="search" type="search" :label="__( 'Search' )" leading-icon="search" />
<x-artisanpack-input wire:model="price" type="number" :label="__( 'Price' )" prefix="USD" suffix="/mo" />
<x-artisanpack-input wire:model="website" type="url" :label="__( 'Website' )" prefix="https://" trailing-icon="arrow-right" />
