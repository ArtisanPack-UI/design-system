<x-artisanpack-progress :value="$uploaded / 12 * 100" :label="__( 'Uploading 12 photos' )" :value-text="__( ':done of :total', [ 'done' => $uploaded, 'total' => 12 ] )" />
<x-artisanpack-progress :value="92" color="warning" :label="__( 'Monthly visits used' )" value-text="46,120 / 50,000" />
<x-artisanpack-progress :value="40" size="sm" :aria-label="__( 'Profile completeness' )" />
