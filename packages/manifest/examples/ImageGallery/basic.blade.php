<x-artisanpack-image-gallery :images="$property->photos->map( fn ( $photo ) => [
	'src'     => $photo->url,
	'alt'     => $photo->alt,
	'caption' => $photo->caption,
] )->all()" />
