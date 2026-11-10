<?php

/**
 * Generated from packages/manifest/components/*.json. Do not edit; run `npm run manifest`.
 *
 * @package ArtisanPack_UI
 */

return [
	'Button'   => [
		'name'        => 'Button',
		'description' => 'Triggers an action. The one solid primary Button marks the main action of a view.',
		'status'      => 'draft',
		'issue'       => 44,
		'rootClass'   => 'apui-button',
		'stacks'      => [
			'livewire' => [
				'name' => 'button',
			],
			'react'    => [
				'name' => 'Button',
			],
			'vue'      => [
				'name' => 'Button',
			],
		],
		'props'       => [
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'solid', 'soft', 'outline', 'ghost', 'link' ],
				'default'     => 'solid',
				'description' => 'Visual treatment. Emitted as data-variant.',
			],
			[
				'name'        => 'color',
				'type'        => 'enum',
				'values'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
				'default'     => 'primary',
				'description' => 'Semantic color. Emitted as data-color.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'xs', 'sm', 'md', 'lg', 'xl' ],
				'default'     => 'md',
				'description' => 'Control height. Emitted as data-size.',
			],
			[
				'name'        => 'iconOnly',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Renders only the icon.',
				'a11y'        => 'Requires aria-label.',
			],
			[
				'name'        => 'loading',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Shows the spinner over the label and keeps the button\'s width. Pointer clicks are ignored while loading.',
				'a11y'        => 'Sets aria-busy and keeps the label for screen readers.',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables the button. With href, renders an anchor without href and with aria-disabled.',
			],
			[
				'name'        => 'href',
				'type'        => 'string',
				'description' => 'Renders an anchor with the same styles.',
			],
			[
				'name'        => 'leadingIcon',
				'type'        => 'string',
				'description' => 'Icon name before the label, resolved through the icon registry. A slot or node overrides it.',
			],
			[
				'name'        => 'trailingIcon',
				'type'        => 'string',
				'description' => 'Icon name after the label, resolved through the icon registry. A slot or node overrides it.',
			],
			[
				'name'        => 'type',
				'type'        => 'enum',
				'values'      => [ 'button', 'submit', 'reset' ],
				'default'     => 'button',
				'description' => 'The native button type. Ignored when href renders an anchor.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { root: \'…\', label: \'…\' }.',
			],
		],
		'variants'    => [ 'solid', 'soft', 'outline', 'ghost', 'link' ],
		'sizes'       => [ 'xs', 'sm', 'md', 'lg', 'xl' ],
		'colors'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'button | a',
				'description' => 'The native button, or an anchor when href is set.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'Leading icon.',
			],
			[
				'name'        => 'iconEnd',
				'element'     => 'span',
				'description' => 'Trailing icon.',
			],
			[
				'name'        => 'label',
				'element'     => 'span',
				'description' => 'The button text. Stays in the accessibility tree while loading.',
			],
			[
				'name'        => 'spinner',
				'element'     => 'span',
				'description' => 'Loading indicator, centered over the label while loading.',
			],
		],
		'slots'       => [
			[
				'name'        => 'icon',
				'description' => 'Overrides the leading icon.',
			],
			[
				'name'        => 'iconEnd',
				'description' => 'Overrides the trailing icon.',
			],
		],
		'events'      => [],
		'a11y'        => [
			'element'      => 'button',
			'keyboard'     => [
				[
					'keys'   => 'Enter',
					'action' => 'Activates the button.',
				],
				[
					'keys'   => 'Space',
					'action' => 'Activates the button (native button only).',
				],
			],
			'requirements' => [ 'Uses a native button element, or an anchor when href is set.', 'Icon-only buttons need an aria-label.', 'xs buttons extend their hit area to --apui-target-size-min (24px).', 'Loading keeps the label for screen readers and sets aria-busy.', 'Disabled uses --apui-surface-sunken and --apui-text-disabled, never opacity alone.', 'Visible focus ring on :focus-visible.' ],
			'wcag'         => [ '1.4.3', '1.4.11', '2.1.1', '2.4.7', '2.5.8', '4.1.2' ],
		],
		'tokens'      => [ '--apui-button-radius', '--apui-button-weight', '--apui-control-height-xs', '--apui-control-height-sm', '--apui-control-height-md', '--apui-control-height-lg', '--apui-control-height-xl', '--apui-icon-size-sm', '--apui-icon-size-md', '--apui-icon-size-lg', '--apui-state-hover', '--apui-state-pressed', '--apui-surface-sunken', '--apui-text-disabled', '--apui-focus-ring-color', '--apui-target-size-min' ],
		'fixture'     => [
			'content' => 'Button',
			'parts'   => [
				'loading'      => true,
				'leadingIcon'  => 'plus',
				'trailingIcon' => 'arrow-right',
			],
		],
	],
	'Card'     => [
		'name'        => 'Card',
		'description' => 'The default container: a surface with an edge, plus optional media, header, body and footer parts.',
		'status'      => 'draft',
		'issue'       => 48,
		'rootClass'   => 'apui-card',
		'stacks'      => [
			'livewire' => [
				'name' => 'card',
			],
			'react'    => [
				'name' => 'Card',
			],
			'vue'      => [
				'name' => 'Card',
			],
		],
		'props'       => [
			[
				'name'        => 'surface',
				'type'        => 'enum',
				'values'      => [ 'default', 'raised', 'sunken', 'glass' ],
				'default'     => 'default',
				'description' => 'The surface. Emitted as data-surface. Glass falls back to raised under reduced transparency and in high contrast.',
			],
			[
				'name'        => 'interactive',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Adds the hover edge. Emitted as data-interactive. Set by href.',
			],
			[
				'name'        => 'href',
				'type'        => 'string',
				'description' => 'Makes the title a link whose hit area covers the whole card. Buttons inside stay separately focusable.',
				'a11y'        => 'One link per card: the title. Nested controls stay above the stretched hit area.',
			],
			[
				'name'        => 'title',
				'type'        => 'node',
				'description' => 'The heading in the header.',
			],
			[
				'name'        => 'description',
				'type'        => 'node',
				'description' => 'Supporting text under the title.',
			],
			[
				'name'        => 'actions',
				'type'        => 'node',
				'description' => 'Controls at the end of the header.',
			],
			[
				'name'        => 'footer',
				'type'        => 'node',
				'description' => 'The footer row, separated by an edge.',
			],
			[
				'name'        => 'media',
				'type'        => 'string',
				'description' => 'An image URL shown edge to edge above the header. A slot or node overrides it.',
			],
			[
				'name'        => 'mediaAlt',
				'type'        => 'string',
				'default'     => '',
				'description' => 'Alternative text for media. Empty marks it decorative.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { header: \'…\', body: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The surface.',
			],
			[
				'name'        => 'media',
				'element'     => 'img',
				'description' => 'Edge-to-edge media at the top.',
			],
			[
				'name'        => 'header',
				'element'     => 'div',
				'description' => 'Title, description and actions.',
			],
			[
				'name'        => 'title',
				'element'     => 'h3',
				'description' => 'The heading. It holds the link when href is set.',
			],
			[
				'name'        => 'description',
				'element'     => 'p',
				'description' => 'Supporting text.',
			],
			[
				'name'        => 'actions',
				'element'     => 'div',
				'description' => 'Controls at the end of the header.',
			],
			[
				'name'        => 'body',
				'element'     => 'div',
				'description' => 'The default slot.',
			],
			[
				'name'        => 'footer',
				'element'     => 'div',
				'description' => 'The footer row.',
			],
		],
		'slots'       => [
			[
				'name'        => 'media',
				'description' => 'Overrides the media image, such as a video or a chart.',
			],
			[
				'name'        => 'title',
				'description' => 'Rich title content, rendered inside the title heading.',
			],
			[
				'name'        => 'description',
				'description' => 'Rich supporting text.',
			],
			[
				'name'        => 'actions',
				'description' => 'Controls at the end of the header.',
			],
			[
				'name'        => 'footer',
				'description' => 'The footer row.',
			],
		],
		'events'      => [],
		'a11y'        => [
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves to the title link when href is set, then to each control inside.',
				],
			],
			'requirements' => [ 'A card is a plain container; give it a heading so it can be found.', 'With href, the title is the one link, and its hit area covers the card; nested buttons stay separately focusable and clickable.', 'The focus ring sits on the whole card while its title link has :focus-visible.', 'Glass falls back to --apui-surface-raised under prefers-reduced-transparency, without backdrop-filter, and in high contrast.', 'Text keeps 4.5:1 on every surface, glass included (--apui-text-muted-glass).' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.4', '2.4.7' ],
		],
		'tokens'      => [ '--apui-card-radius', '--apui-card-padding', '--apui-surface-default', '--apui-surface-raised', '--apui-surface-sunken', '--apui-surface-glass', '--apui-surface-glass-border', '--apui-surface-glass-blur', '--apui-surface-glass-saturation', '--apui-elevation-raised', '--apui-elevation-glass', '--apui-border-muted', '--apui-border-strong', '--apui-text-default', '--apui-text-muted', '--apui-text-muted-glass', '--apui-focus-ring-color' ],
		'fixture'     => [
			'content' => 'Revenue grew 12% this quarter.',
			'props'   => [
				'title'       => 'Quarterly report',
				'description' => 'Updated 2 hours ago',
				'interactive' => true,
				'media'       => 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 9\'%3E%3Crect width=\'16\' height=\'9\' fill=\'%2394a3b8\'/%3E%3C/svg%3E',
			],
			'parts'   => [
				'actions' => 'Share',
				'footer'  => '3 comments',
			],
			'states'  => [ 'hover' ],
		],
	],
	'Checkbox' => [
		'name'        => 'Checkbox',
		'description' => 'Turns one option on or off, or selects items in a list or table. Supports the indeterminate (mixed) state.',
		'status'      => 'draft',
		'issue'       => 47,
		'rootClass'   => 'apui-checkbox',
		'stacks'      => [
			'livewire' => [
				'name' => 'checkbox',
			],
			'react'    => [
				'name' => 'Checkbox',
			],
			'vue'      => [
				'name' => 'Checkbox',
			],
		],
		'props'       => [
			[
				'name'        => 'checked',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Whether it\'s checked. Livewire binds it with wire:model, Vue with v-model:checked. Emitted as data-state.',
			],
			[
				'name'        => 'defaultChecked',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'The initial state of an uncontrolled checkbox.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'indeterminate',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Shows the mixed state, such as a select-all box with some rows selected. Emitted as data-state="indeterminate".',
				'a11y'        => 'Sets the native indeterminate property, so it is announced as mixed.',
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The visible label, linked to the control.',
			],
			[
				'name'        => 'description',
				'type'        => 'node',
				'description' => 'Supporting text under the label, linked with aria-describedby.',
			],
			[
				'name'        => 'error',
				'type'        => 'string',
				'description' => 'Validation message. Marks it invalid and is linked with aria-describedby.',
			],
			[
				'name'        => 'invalid',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Marks it invalid without a message. Emitted as data-invalid.',
				'a11y'        => 'Sets aria-invalid on the control.',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables the control.',
			],
			[
				'name'        => 'required',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Marks it required, such as consent to terms.',
				'a11y'        => 'Sets required on the control.',
			],
			[
				'name'        => 'errorField',
				'type'        => 'string',
				'description' => 'The validation key to read from $errors. Defaults to the wire:model name.',
				'stacks'      => [ 'livewire' ],
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { box: \'…\', label: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The box, label, description and error.',
			],
			[
				'name'        => 'box',
				'element'     => 'span',
				'description' => 'The visible square. The native control covers it.',
			],
			[
				'name'        => 'control',
				'element'     => 'input',
				'description' => 'The native checkbox, visually hidden over the box. Attributes other than class land here.',
			],
			[
				'name'        => 'indicator',
				'element'     => 'span',
				'description' => 'The check, or the dash when indeterminate.',
			],
			[
				'name'        => 'label',
				'element'     => 'label',
				'description' => 'The visible label, for the control.',
			],
			[
				'name'        => 'description',
				'element'     => 'p',
				'description' => 'Supporting text.',
			],
			[
				'name'        => 'error',
				'element'     => 'p',
				'description' => 'Validation message, with an icon.',
			],
		],
		'events'      => [
			[
				'name'        => 'checked-change',
				'description' => 'The checked state changed. Clearing indeterminate is up to the owner.',
				'payload'     => 'boolean',
			],
		],
		'a11y'        => [
			'keyboard'     => [
				[
					'keys'   => 'Space',
					'action' => 'Toggles the checkbox.',
				],
			],
			'requirements' => [ 'The native input type=checkbox stays in the DOM, visually hidden over the box, so the platform handles keyboard and screen readers.', 'Indeterminate sets the native indeterminate property, announced as mixed.', 'The label is linked with for/id; description and error with aria-describedby.', 'The hit area covers the box plus 4px, and the label toggles it too.', 'Disabled uses --apui-surface-sunken and --apui-text-disabled, never opacity alone.', 'Visible focus ring on the box while the control has :focus-visible.', 'Use Toggle, not Checkbox, for settings that apply instantly.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.7', '2.5.8', '3.3.2', '4.1.2' ],
		],
		'tokens'      => [ '--apui-checkbox-radius', '--apui-color-primary', '--apui-color-primary-hover', '--apui-color-primary-foreground', '--apui-border-default', '--apui-border-strong', '--apui-border-muted', '--apui-color-error-border', '--apui-color-error-text', '--apui-surface-default', '--apui-surface-sunken', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'label' => 'Email me about new offers',
			],
			'parts'  => [
				'description' => 'At most once a day.',
				'error'       => 'Required to continue.',
			],
			'states' => [ 'hover', 'focus-visible', 'checked', 'indeterminate', 'disabled', 'invalid' ],
		],
	],
	'Input'    => [
		'name'        => 'Input',
		'description' => 'Single-line text entry with a visible label, hint and error. It anchors the field anatomy (root, label, control, hint, error) every form component reuses.',
		'status'      => 'draft',
		'issue'       => 45,
		'rootClass'   => 'apui-input',
		'stacks'      => [
			'livewire' => [
				'name' => 'input',
			],
			'react'    => [
				'name' => 'Input',
			],
			'vue'      => [
				'name' => 'Input',
			],
		],
		'props'       => [
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md', 'lg' ],
				'default'     => 'md',
				'description' => 'Control height. Emitted as data-size.',
			],
			[
				'name'        => 'type',
				'type'        => 'string',
				'default'     => 'text',
				'description' => 'The native input type, such as email, url, search or number.',
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The visible label, linked to the control.',
			],
			[
				'name'        => 'hint',
				'type'        => 'node',
				'description' => 'Help text under the control, linked with aria-describedby.',
			],
			[
				'name'        => 'error',
				'type'        => 'string',
				'description' => 'Validation message. Marks the field invalid and is linked with aria-describedby.',
			],
			[
				'name'        => 'invalid',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Marks the field invalid without a message. Emitted as data-invalid.',
				'a11y'        => 'Sets aria-invalid on the control.',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables the control.',
			],
			[
				'name'        => 'readonly',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Makes the control read-only. It stays focusable.',
			],
			[
				'name'        => 'required',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Marks the field required and shows the required mark.',
				'a11y'        => 'Sets required (and so aria-required) on the control.',
			],
			[
				'name'        => 'placeholder',
				'type'        => 'string',
				'description' => 'Placeholder text. Never a replacement for the label.',
			],
			[
				'name'        => 'value',
				'type'        => 'string',
				'description' => 'The value. Livewire binds it with wire:model, Vue with v-model.',
			],
			[
				'name'        => 'defaultValue',
				'type'        => 'string',
				'description' => 'The initial value of an uncontrolled input.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'prefix',
				'type'        => 'node',
				'description' => 'Text inside the box before the value, such as a currency or https://.',
			],
			[
				'name'        => 'suffix',
				'type'        => 'node',
				'description' => 'Text inside the box after the value, such as a unit.',
			],
			[
				'name'        => 'leadingIcon',
				'type'        => 'string',
				'description' => 'Icon name before the value, resolved through the icon registry. A slot or node overrides it.',
			],
			[
				'name'        => 'trailingIcon',
				'type'        => 'string',
				'description' => 'Icon name after the value, resolved through the icon registry. A slot or node overrides it.',
			],
			[
				'name'        => 'errorField',
				'type'        => 'string',
				'description' => 'The validation key to read from $errors. Defaults to the wire:model name.',
				'stacks'      => [ 'livewire' ],
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { label: \'…\', control: \'…\' }.',
			],
		],
		'sizes'       => [ 'sm', 'md', 'lg' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The field: label, box, hint and error.',
			],
			[
				'name'        => 'label',
				'element'     => 'label',
				'description' => 'The visible label, for the control.',
			],
			[
				'name'        => 'required',
				'element'     => 'span',
				'description' => 'The required mark inside the label. Hidden from screen readers; the control is required.',
			],
			[
				'name'        => 'box',
				'element'     => 'div',
				'description' => 'The bordered box around the control, its icons and its prefix and suffix.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'Leading icon.',
			],
			[
				'name'        => 'prefix',
				'element'     => 'span',
				'description' => 'Text before the value.',
			],
			[
				'name'        => 'control',
				'element'     => 'input',
				'description' => 'The native input. Attributes other than class land here.',
			],
			[
				'name'        => 'suffix',
				'element'     => 'span',
				'description' => 'Text after the value.',
			],
			[
				'name'        => 'iconEnd',
				'element'     => 'span',
				'description' => 'Trailing icon.',
			],
			[
				'name'        => 'hint',
				'element'     => 'p',
				'description' => 'Help text.',
			],
			[
				'name'        => 'error',
				'element'     => 'p',
				'description' => 'Validation message, with an icon.',
			],
		],
		'slots'       => [
			[
				'name'        => 'icon',
				'description' => 'Overrides the leading icon.',
			],
			[
				'name'        => 'iconEnd',
				'description' => 'Overrides the trailing icon.',
			],
			[
				'name'        => 'prefix',
				'description' => 'Rich content before the value.',
			],
			[
				'name'        => 'suffix',
				'description' => 'Rich content after the value.',
			],
		],
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'The value changed.',
				'payload'     => 'string',
			],
		],
		'a11y'        => [
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves focus to the control; typing edits the value.',
				],
			],
			'requirements' => [ 'The label is always visible and linked with for/id; a placeholder never replaces it.', 'Hint and error are linked to the control with aria-describedby.', 'Invalid sets aria-invalid on the control; the error is text, never color alone.', 'Required sets required on the control; the visual mark is aria-hidden.', 'Class goes to the root; every other attribute (wire:model, name, autocomplete) goes to the control.', 'Disabled uses --apui-surface-sunken and --apui-text-disabled, never opacity alone.', 'Visible focus ring on the box while the control has :focus-visible.', 'Prefix, suffix and icons sit at the logical start and end, so they swap under RTL.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.7', '2.5.8', '3.3.1', '3.3.2', '4.1.2' ],
		],
		'tokens'      => [ '--apui-input-radius', '--apui-control-height-sm', '--apui-control-height-md', '--apui-control-height-lg', '--apui-border-default', '--apui-border-strong', '--apui-border-muted', '--apui-color-error-border', '--apui-color-error-text', '--apui-surface-default', '--apui-surface-sunken', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'label'       => 'Email',
				'placeholder' => 'you@example.com',
			],
			'parts'  => [
				'required'     => true,
				'hint'         => 'We never share it.',
				'error'        => 'Enter a valid email address.',
				'prefix'       => 'to:',
				'suffix'       => '@work',
				'leadingIcon'  => 'mail',
				'trailingIcon' => 'search',
			],
			'states' => [ 'hover', 'focus-visible', 'disabled', 'invalid', 'readonly' ],
		],
	],
	'Select'   => [
		'name'        => 'Select',
		'description' => 'Chooses one value from a short list with the native select element. It shares the Input field anatomy; searchable and rich options are the Combobox family (#54).',
		'status'      => 'draft',
		'issue'       => 46,
		'rootClass'   => 'apui-select',
		'stacks'      => [
			'livewire' => [
				'name' => 'select',
			],
			'react'    => [
				'name' => 'Select',
			],
			'vue'      => [
				'name' => 'Select',
			],
		],
		'props'       => [
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md', 'lg' ],
				'default'     => 'md',
				'description' => 'Control height. Emitted as data-size.',
			],
			[
				'name'        => 'options',
				'type'        => 'array',
				'description' => 'The options: strings, or { value, label, disabled } objects. Option children (a slot in Blade and Vue) render as well, after them.',
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The visible label, linked to the control.',
			],
			[
				'name'        => 'hint',
				'type'        => 'node',
				'description' => 'Help text under the control, linked with aria-describedby.',
			],
			[
				'name'        => 'error',
				'type'        => 'string',
				'description' => 'Validation message. Marks the field invalid and is linked with aria-describedby.',
			],
			[
				'name'        => 'invalid',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Marks the field invalid without a message. Emitted as data-invalid.',
				'a11y'        => 'Sets aria-invalid on the control.',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables the control.',
			],
			[
				'name'        => 'required',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Marks the field required, shows the required mark and makes the placeholder option unselectable.',
				'a11y'        => 'Sets required on the control.',
			],
			[
				'name'        => 'placeholder',
				'type'        => 'string',
				'default'     => 'Select…',
				'description' => 'The empty first option, shown in the muted color while it\'s selected. Translated by default.',
			],
			[
				'name'        => 'value',
				'type'        => 'string',
				'description' => 'The selected value. Livewire binds it with wire:model, Vue with v-model.',
			],
			[
				'name'        => 'defaultValue',
				'type'        => 'string',
				'description' => 'The initial value of an uncontrolled select.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'leadingIcon',
				'type'        => 'string',
				'description' => 'Icon name before the value, resolved through the icon registry. A slot or node overrides it.',
			],
			[
				'name'        => 'errorField',
				'type'        => 'string',
				'description' => 'The validation key to read from $errors. Defaults to the wire:model name.',
				'stacks'      => [ 'livewire' ],
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { label: \'…\', control: \'…\' }.',
			],
		],
		'sizes'       => [ 'sm', 'md', 'lg' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The field: label, box, hint and error.',
			],
			[
				'name'        => 'label',
				'element'     => 'label',
				'description' => 'The visible label, for the control.',
			],
			[
				'name'        => 'required',
				'element'     => 'span',
				'description' => 'The required mark inside the label. Hidden from screen readers; the control is required.',
			],
			[
				'name'        => 'box',
				'element'     => 'div',
				'description' => 'The bordered box around the control, its icon and the chevron.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'Leading icon.',
			],
			[
				'name'        => 'control',
				'element'     => 'select',
				'description' => 'The native select. Attributes other than class land here.',
			],
			[
				'name'        => 'indicator',
				'element'     => 'span',
				'description' => 'The chevron. It points down in every direction.',
			],
			[
				'name'        => 'hint',
				'element'     => 'p',
				'description' => 'Help text.',
			],
			[
				'name'        => 'error',
				'element'     => 'p',
				'description' => 'Validation message, with an icon.',
			],
		],
		'slots'       => [
			[
				'name'        => 'icon',
				'description' => 'Overrides the leading icon.',
			],
		],
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'The selected value changed. React and Vue pass the matching option\'s value as given (a number stays a number); option children and Livewire give the string.',
				'payload'     => 'string | number',
			],
		],
		'a11y'        => [
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves focus to the select.',
				],
				[
					'keys'   => 'Space, Enter, Alt+ArrowDown',
					'action' => 'Opens the native list (platform behavior).',
				],
				[
					'keys'   => 'ArrowUp, ArrowDown',
					'action' => 'Moves through the options.',
				],
				[
					'keys'   => 'Escape',
					'action' => 'Closes the list and keeps the value.',
				],
			],
			'requirements' => [ 'Uses the native select element, so the platform supplies the listbox, keyboard and screen-reader support.', 'The label is always visible and linked with for/id.', 'Hint and error are linked to the control with aria-describedby; invalid sets aria-invalid.', 'The placeholder is an empty option in the muted color, so it never looks like a value; it can\'t be chosen when required.', 'Class goes to the root; every other attribute (wire:model, name) goes to the control.', 'Visible focus ring on the box while the control has :focus-visible.', 'The chevron doesn\'t mirror under RTL; the icon and chevron swap sides with the text direction.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.7', '2.5.8', '3.3.1', '3.3.2', '4.1.2' ],
		],
		'tokens'      => [ '--apui-input-radius', '--apui-control-height-sm', '--apui-control-height-md', '--apui-control-height-lg', '--apui-border-default', '--apui-border-strong', '--apui-border-muted', '--apui-color-error-border', '--apui-color-error-text', '--apui-surface-default', '--apui-surface-sunken', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'label'   => 'Country',
				'options' => [
					[
						'value' => 'us',
						'label' => 'United States',
					],
					[
						'value' => 'ca',
						'label' => 'Canada',
					],
				],
			],
			'parts'  => [
				'required'    => true,
				'hint'        => 'Where the account is registered.',
				'error'       => 'Choose a country.',
				'leadingIcon' => 'user',
			],
			'states' => [ 'hover', 'focus-visible', 'disabled', 'invalid' ],
		],
	],
];
