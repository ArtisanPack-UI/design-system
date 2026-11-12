<x-artisanpack-clipboard
	:value="$listing->shareUrl()"
	variant="field"
	size="md"
	:label="__( 'Copy share link' )"
	x-on:copy="$wire.trackShare()"
/>
