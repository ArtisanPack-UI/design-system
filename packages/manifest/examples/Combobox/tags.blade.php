<x-artisanpack-combobox
	wire:model="tags"
	wire:create="addTag( $event.detail.value )"
	multiple
	allow-create
	:max="8"
	:label="__( 'Listing tags' )"
	:placeholder="__( 'Add a tag…' )"
	:hint="__( 'Press Enter to add, Backspace to remove the last tag.' )"
	:options="$this->tagOptions"
/>
