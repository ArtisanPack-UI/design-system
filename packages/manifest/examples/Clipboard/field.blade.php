<x-artisanpack-clipboard
	:value="$listing->shareUrl()"
	variant="field"
	size="md"
	:label="__( 'Copy share link' )"
	x-on:copied="$wire.trackShare()"
/>
