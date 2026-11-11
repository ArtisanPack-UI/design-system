{{-- Lists the first message of every key in $errors, linked to its field. --}}
<x-artisanpack-validation-summary />

{{-- Or only some keys, in order, with your own title. --}}
<x-artisanpack-validation-summary :only="[ 'postalCode', 'photos' ]" :title="__( 'Fix these before publishing' )" />
