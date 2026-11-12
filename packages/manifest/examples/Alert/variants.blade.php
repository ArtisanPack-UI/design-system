<x-artisanpack-alert variant="outline" color="info" :title="__( 'Outline variant' )" :description="__( 'For alerts inside dense forms, where a tint would be too loud.' )" />
<x-artisanpack-alert variant="solid" color="error" :title="__( 'Solid variant' )" :description="__( 'For page-level failures that block work.' )" />
<x-artisanpack-alert color="success" :title="__( 'Listing published' )" dismissible x-on:open-change="$wire.markSeen()" />
