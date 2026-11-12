<x-artisanpack-image-library
	:assets="$media->map( fn ( $item ) => [
		'id'     => (string) $item->id,
		'src'    => $item->url(),
		'name'   => $item->file_name,
		'alt'    => $item->alt_text,
		'size'   => $item->humanFileSize(),
		'width'  => $item->width,
		'height' => $item->height,
	] )->all()"
	selectable="single"
	view="list"
	x-on:insert="$wire.choose( $event.detail.value[0] )"
/>
