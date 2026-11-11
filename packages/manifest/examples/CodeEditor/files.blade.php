<x-artisanpack-code-editor
	wire:model="source"
	:label="__( 'Source' )"
	:tabs="[ 'format-price.ts', 'listing.blade.php' ]"
	:tab="$file"
	:languages="[ [ 'value' => 'typescript', 'label' => 'TypeScript' ], [ 'value' => 'php', 'label' => 'PHP' ] ]"
	:language="$language"
	x-on:tab-change="$wire.openFile( $event.detail.value )"
	x-on:language-change="$wire.set( 'language', $event.detail.value )"
/>
