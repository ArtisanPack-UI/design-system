<x-artisanpack-image-slider
	wire:model="photo"
	:images="$photos"
	aspect-ratio="16 / 9"
	thumbnails
	autoplay
	:interval="6000"
/>
