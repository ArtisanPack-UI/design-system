<x-artisanpack-breadcrumbs :items="[
	[ 'label' => __( 'Dashboard' ), 'href' => route( 'dashboard' ) ],
	[ 'label' => __( 'Properties' ), 'href' => route( 'properties.index' ) ],
	[ 'label' => $property->name ],
]" />
