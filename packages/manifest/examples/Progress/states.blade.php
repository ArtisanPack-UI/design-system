<x-artisanpack-progress indeterminate :label="__( 'Preparing export' )" :value-text="__( 'Estimating…' )" />
<x-artisanpack-progress segmented :value="3" :max="5" :label="__( 'Listing setup' )" :value-text="__( ':done of :total', [ 'done' => 3, 'total' => 5 ] )" />
