<?php

/**
 * Generated from packages/manifest/components/*.json. Do not edit; run `npm run manifest`.
 *
 * @package ArtisanPack_UI
 */

return [
	'Button'       => [
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
	'Card'         => [
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
	'Checkbox'     => [
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
	'Dialog'       => [
		'name'        => 'Dialog',
		'description' => 'A modal window for a focused task or a confirmation. Traps focus, locks scroll and hides the page behind it from assistive technology; Escape, the close button and the backdrop close it, and focus returns to the trigger. Replaces Modal.',
		'status'      => 'draft',
		'issue'       => 49,
		'rootClass'   => 'apui-dialog',
		'stacks'      => [
			'livewire' => [
				'name'         => 'dialog',
				'capabilities' => [ 'wire:model binds open both ways through $wire.entangle()' ],
			],
			'react'    => [
				'name' => 'Dialog',
			],
			'vue'      => [
				'name' => 'Dialog',
			],
		],
		'props'       => [
			[
				'name'        => 'open',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Whether it\'s open. Livewire binds it with wire:model, Vue with v-model:open. Emitted as data-state on every part.',
			],
			[
				'name'        => 'defaultOpen',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'The initial state of an uncontrolled dialog.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md', 'lg' ],
				'default'     => 'md',
				'description' => 'The panel\'s width: 360px, --apui-dialog-width (480px) or 640px, never wider than the viewport. Emitted as data-size.',
			],
			[
				'name'        => 'role',
				'type'        => 'enum',
				'values'      => [ 'dialog', 'alertdialog' ],
				'default'     => 'dialog',
				'description' => 'alertdialog for confirmations that interrupt: the backdrop doesn\'t close it, and focus starts on the close button, the safe action.',
				'a11y'        => 'Sets the panel\'s role.',
			],
			[
				'name'        => 'surface',
				'type'        => 'enum',
				'values'      => [ 'overlay', 'glass' ],
				'default'     => 'overlay',
				'description' => 'The panel\'s surface. Emitted as data-surface. Glass falls back to the overlay surface under reduced transparency and in high contrast.',
			],
			[
				'name'        => 'color',
				'type'        => 'enum',
				'values'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
				'description' => 'Tints the header icon, for confirmations. Emitted as data-color.',
			],
			[
				'name'        => 'icon',
				'type'        => 'string',
				'description' => 'An icon name from the registry, shown in a tinted circle before the title. A slot or node overrides it.',
			],
			[
				'name'        => 'title',
				'type'        => 'node',
				'description' => 'The heading, linked to the panel with aria-labelledby.',
				'a11y'        => 'Every dialog needs a title; it is the panel\'s accessible name.',
			],
			[
				'name'        => 'description',
				'type'        => 'node',
				'description' => 'Supporting text under the title, linked with aria-describedby.',
			],
			[
				'name'        => 'footer',
				'type'        => 'node',
				'description' => 'The actions row. Name the confirm action ("Delete listing"), not "OK".',
			],
			[
				'name'        => 'trigger',
				'type'        => 'node',
				'description' => 'Content for a trigger button that opens the dialog. Without it, open the dialog through open.',
			],
			[
				'name'        => 'modal',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Traps focus, locks scroll and hides the rest of the page from assistive technology. Turn it off only for a dialog that must leave the page usable.',
				'a11y'        => 'Sets aria-modal.',
			],
			[
				'name'        => 'portal',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Renders the dialog at the end of the body, above everything (x-teleport, a React portal, Vue Teleport). Off renders it in place.',
			],
			[
				'name'        => 'hideClose',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Hides the close button in the header. Escape still closes the dialog.',
			],
			[
				'name'        => 'closeLabel',
				'type'        => 'string',
				'default'     => 'Close',
				'description' => 'The close button\'s accessible name. Translate it: Livewire defaults it through __( \'Close\' ).',
				'a11y'        => 'The close button is icon-only, so this is its only name.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { header: \'…\', body: \'…\' }.',
			],
		],
		'sizes'       => [ 'sm', 'md', 'lg' ],
		'colors'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The panel, carrying the root class. It is Zag\'s content part, so it also carries data-part="content" (D-019).',
			],
			[
				'name'        => 'content',
				'element'     => 'div',
				'description' => 'The panel: the same element as root.',
			],
			[
				'name'        => 'trigger',
				'element'     => 'button',
				'description' => 'The button that opens the dialog, when trigger is set.',
			],
			[
				'name'        => 'backdrop',
				'element'     => 'div',
				'description' => 'The scrim behind the panel.',
			],
			[
				'name'        => 'positioner',
				'element'     => 'div',
				'description' => 'Fills the viewport and centers the panel.',
			],
			[
				'name'        => 'header',
				'element'     => 'div',
				'description' => 'Icon, title, description and close button.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'The tinted icon before the title.',
			],
			[
				'name'        => 'title',
				'element'     => 'h2',
				'description' => 'The heading.',
			],
			[
				'name'        => 'description',
				'element'     => 'p',
				'description' => 'Supporting text.',
			],
			[
				'name'        => 'closeTrigger',
				'element'     => 'button',
				'description' => 'The close button: a ghost, neutral, small icon-only Button.',
			],
			[
				'name'        => 'body',
				'element'     => 'div',
				'description' => 'The default slot.',
			],
			[
				'name'        => 'footer',
				'element'     => 'div',
				'description' => 'The actions row.',
			],
		],
		'slots'       => [
			[
				'name'        => 'trigger',
				'description' => 'Content for the trigger button.',
			],
			[
				'name'        => 'icon',
				'description' => 'Overrides the icon.',
			],
			[
				'name'        => 'title',
				'description' => 'Rich title content, rendered inside the heading.',
			],
			[
				'name'        => 'description',
				'description' => 'Rich supporting text.',
			],
			[
				'name'        => 'footer',
				'description' => 'The actions row.',
			],
		],
		'events'      => [
			[
				'name'        => 'open-change',
				'description' => 'The dialog opened or closed itself: the trigger, Escape, the backdrop or the close button. Setting open doesn\'t fire it.',
				'payload'     => 'boolean',
			],
		],
		'a11y'        => [
			'role'         => 'dialog',
			'roles'        => [ 'alertdialog' ],
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Tab, Shift+Tab',
					'action' => 'Move between the controls inside; focus stays in the dialog.',
				],
				[
					'keys'   => 'Escape',
					'action' => 'Closes the dialog and returns focus to the trigger.',
				],
				[
					'keys'   => 'Enter, Space',
					'action' => 'On the trigger, opens the dialog.',
				],
			],
			'requirements' => [ 'Focus moves into the dialog on open and is trapped there while it\'s modal; it returns to the trigger on close.', 'The title is linked with aria-labelledby and the description with aria-describedby.', 'A modal dialog sets aria-modal and hides everything else from assistive technology, and locks page scroll.', 'Destructive confirmations use alertdialog: the backdrop doesn\'t close them and focus starts on the safe action.', 'The close button has an accessible name (translatable, "Close").', 'Text keeps 4.5:1 and the panel\'s edge 3:1 on the overlay surface in every theme, glass included.', 'Glass falls back to the overlay surface under prefers-reduced-transparency, without backdrop-filter, and in high contrast.', 'Every part keeps a stable, server-rendered id in Livewire, so morphs never replace the panel (D-015).' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.1.2', '2.4.3', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-dialog-radius', '--apui-dialog-width', '--apui-surface-overlay', '--apui-surface-glass', '--apui-surface-glass-border', '--apui-surface-glass-blur', '--apui-surface-glass-saturation', '--apui-elevation-overlay', '--apui-elevation-glass', '--apui-backdrop', '--apui-z-modal', '--apui-border-muted', '--apui-text-default', '--apui-text-muted', '--apui-text-muted-glass', '--apui-field-gap' ],
		'fixture'     => [
			'content' => 'They\'ll get an email with a link to join the project.',
			'props'   => [
				'open'        => true,
				'modal'       => false,
				'portal'      => false,
				'title'       => 'Invite member',
				'description' => 'Members can edit every listing.',
				'icon'        => 'user',
				'footer'      => 'Send invite',
			],
			'parts'   => [
				'trigger' => 'Invite',
			],
			'states'  => [],
		],
	],
	'DropdownMenu' => [
		'name'        => 'DropdownMenu',
		'description' => 'A list of actions or options anchored to a trigger button: action, checkbox and radio items, in groups with labels. Arrow keys move, typeahead jumps, Escape closes. Replaces Dropdown.',
		'status'      => 'draft',
		'issue'       => 50,
		'rootClass'   => 'apui-dropdown-menu',
		'stacks'      => [
			'livewire' => [
				'name'         => 'dropdown-menu',
				'capabilities' => [ 'Children: dropdown-menu-item, dropdown-menu-group and dropdown-menu-separator; items renders the same children', 'wire:click on an item runs from the keyboard too: choosing an item clicks it' ],
			],
			'react'    => [
				'name'         => 'DropdownMenu',
				'capabilities' => [ 'Children: DropdownMenuItem, DropdownMenuGroup and DropdownMenuSeparator' ],
			],
			'vue'      => [
				'name'         => 'DropdownMenu',
				'capabilities' => [ 'Children: DropdownMenuItem, DropdownMenuGroup and DropdownMenuSeparator' ],
			],
		],
		'props'       => [
			[
				'name'        => 'open',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Whether it\'s open. Livewire binds it with wire:model, Vue with v-model:open. Emitted as data-state on every part.',
			],
			[
				'name'        => 'defaultOpen',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'The initial state of an uncontrolled menu.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The trigger button\'s content.',
				'a11y'        => 'An icon-only trigger needs an aria-label through classes or the slot\'s text.',
			],
			[
				'name'        => 'items',
				'type'        => 'array',
				'description' => 'The items as data, rendering the same children as composition: { value, label, icon, shortcut, color: \'error\', disabled }, { type: \'checkbox\' | \'radio\', value, label, checked }, { type: \'separator\' } and { type: \'group\', label, items }.',
			],
			[
				'name'        => 'align',
				'type'        => 'enum',
				'values'      => [ 'start', 'center', 'end' ],
				'default'     => 'start',
				'description' => 'Which of the menu\'s edges lines up with the trigger\'s, along the inline axis; start and end follow the text direction. Emitted as data-align.',
			],
			[
				'name'        => 'surface',
				'type'        => 'enum',
				'values'      => [ 'overlay', 'glass' ],
				'default'     => 'overlay',
				'description' => 'The menu\'s surface. Emitted as data-surface. Glass falls back to the overlay surface under reduced transparency and in high contrast.',
			],
			[
				'name'        => 'portal',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Renders the menu at the end of the body, above everything (x-teleport, a React portal, Vue Teleport). Off renders it in place.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { trigger: \'…\', item: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The menu panel, carrying the root class. It is Zag\'s content part, so it also carries data-part="content" (D-019).',
			],
			[
				'name'        => 'content',
				'element'     => 'div',
				'description' => 'The menu panel: the same element as root.',
			],
			[
				'name'        => 'trigger',
				'element'     => 'button',
				'description' => 'The button that opens the menu.',
			],
			[
				'name'        => 'positioner',
				'element'     => 'div',
				'description' => 'Places the panel against the trigger.',
			],
			[
				'name'        => 'itemGroup',
				'element'     => 'div',
				'description' => 'A group of items, labelled by its label.',
			],
			[
				'name'        => 'itemGroupLabel',
				'element'     => 'div',
				'description' => 'A group\'s label.',
			],
			[
				'name'        => 'item',
				'element'     => 'div',
				'description' => 'An action, checkbox or radio item: role menuitem, menuitemcheckbox or menuitemradio.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'An item\'s leading icon.',
			],
			[
				'name'        => 'itemText',
				'element'     => 'span',
				'description' => 'An item\'s label.',
			],
			[
				'name'        => 'shortcut',
				'element'     => 'kbd',
				'description' => 'An item\'s keyboard shortcut, shown at the end.',
			],
			[
				'name'        => 'itemIndicator',
				'element'     => 'span',
				'description' => 'The check on a checkbox or radio item, shown while it\'s checked.',
			],
			[
				'name'        => 'separator',
				'element'     => 'hr',
				'description' => 'A rule between items.',
			],
		],
		'slots'       => [
			[
				'name'        => 'label',
				'description' => 'The trigger button\'s content.',
			],
		],
		'events'      => [
			[
				'name'        => 'open-change',
				'description' => 'The menu opened or closed itself: the trigger, Escape, an outside click or a choice. Setting open doesn\'t fire it.',
				'payload'     => 'boolean',
			],
			[
				'name'        => 'select',
				'description' => 'An action item was chosen, by click or Enter. The payload is its value.',
				'payload'     => 'string',
			],
			[
				'name'        => 'checked-change',
				'description' => 'A checkbox or radio item was chosen. Its checked state stays the owner\'s to set.',
				'payload'     => '{ value: string, checked: boolean }',
			],
		],
		'a11y'        => [
			'role'         => 'menu',
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Enter, Space, ArrowDown',
					'action' => 'On the trigger, opens the menu on the first item.',
				],
				[
					'keys'   => 'ArrowUp',
					'action' => 'On the trigger, opens the menu on the last item.',
				],
				[
					'keys'   => 'ArrowDown, ArrowUp',
					'action' => 'Move to the next or previous item, skipping disabled ones.',
				],
				[
					'keys'   => 'Home, End',
					'action' => 'Move to the first or last item.',
				],
				[
					'keys'   => 'A–Z',
					'action' => 'Typeahead: moves to the next item whose label starts with the typed text.',
				],
				[
					'keys'   => 'Enter, Space',
					'action' => 'Chooses the item; a checkbox or radio item toggles.',
				],
				[
					'keys'   => 'Escape',
					'action' => 'Closes the menu and returns focus to the trigger.',
				],
				[
					'keys'   => 'Tab',
					'action' => 'Closes the menu and moves on.',
				],
			],
			'requirements' => [ 'role=menu with menuitem, menuitemcheckbox and menuitemradio items; checked items set aria-checked.', 'The trigger sets aria-haspopup=menu, aria-expanded and aria-controls.', 'Focus moves into the menu on open and returns to the trigger when it closes.', 'Disabled items set aria-disabled and are skipped by the arrow keys.', 'Groups are labelled by their label with aria-labelledby.', 'The highlighted item shows the hover tint and the focus ring.', 'Danger items (color error) use --apui-color-error-text, 4.5:1 on the overlay surface; put them last, after a separator.', 'The panel opens below the trigger at its start edge and mirrors in RTL; it flips when there\'s no room.', 'Every part keeps a stable, server-rendered id in Livewire and items carry wire:key (D-015).' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.1.2', '2.4.3', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-menu-radius', '--apui-menu-item-radius', '--apui-menu-item-height', '--apui-surface-overlay', '--apui-surface-glass', '--apui-surface-glass-border', '--apui-surface-glass-blur', '--apui-surface-glass-saturation', '--apui-elevation-overlay', '--apui-elevation-glass', '--apui-z-dropdown', '--apui-border-muted', '--apui-state-hover', '--apui-selected-bg', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-color-primary-text', '--apui-color-primary-soft-foreground', '--apui-color-error-text', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'open'   => true,
				'portal' => false,
				'label'  => 'Options',
				'items'  => [
					[
						'type'  => 'group',
						'label' => 'Listing',
						'items' => [
							[
								'value'    => 'edit',
								'label'    => 'Edit',
								'icon'     => 'pencil',
								'shortcut' => 'E',
							],
							[
								'value' => 'duplicate',
								'label' => 'Duplicate',
								'icon'  => 'copy',
							],
							[
								'value'    => 'archive',
								'label'    => 'Archive',
								'disabled' => true,
							],
						],
					],
					[
						'type' => 'separator',
					],
					[
						'type'    => 'checkbox',
						'value'   => 'grid',
						'label'   => 'Show grid',
						'checked' => true,
					],
					[
						'type' => 'separator',
					],
					[
						'value' => 'delete',
						'label' => 'Delete',
						'icon'  => 'trash',
						'color' => 'error',
					],
				],
			],
			'states' => [],
		],
	],
	'Input'        => [
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
	'Select'       => [
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
	'Toast'        => [
		'name'        => 'Toast',
		'description' => 'A brief, non-blocking message about something that just happened. A toaster (the region) shows toasts created from data, stacked, timed and paused on hover and focus; Livewire triggers them from the server. Rendered on its own, a Toast is static.',
		'status'      => 'draft',
		'issue'       => 51,
		'rootClass'   => 'apui-toast',
		'stacks'      => [
			'livewire' => [
				'name'         => 'toast',
				'capabilities' => [ 'toaster renders the region; $this->dispatch(\'toast\', …) from a Livewire component, and toasts flashed to the session, show in it', 'ApuiBehavior.toast({ … }) shows one from JavaScript' ],
			],
			'react'    => [
				'name'         => 'Toast',
				'capabilities' => [ 'Toaster renders the region; toast.create({ … }) shows one' ],
			],
			'vue'      => [
				'name'         => 'Toast',
				'capabilities' => [ 'Toaster renders the region; toast.create({ … }) shows one' ],
			],
		],
		'props'       => [
			[
				'name'        => 'title',
				'type'        => 'node',
				'description' => 'The message, linked with aria-labelledby.',
			],
			[
				'name'        => 'description',
				'type'        => 'node',
				'description' => 'Supporting text, linked with aria-describedby.',
			],
			[
				'name'        => 'color',
				'type'        => 'enum',
				'values'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
				'default'     => 'neutral',
				'description' => 'Tints the icon. Emitted as data-color. error makes the toast an alert.',
				'a11y'        => 'error sets role=alert, so it\'s announced at once.',
			],
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'default', 'inverse' ],
				'default'     => 'default',
				'description' => 'inverse uses the inverse surface, for a toast that must stand out. Emitted as data-variant.',
			],
			[
				'name'        => 'surface',
				'type'        => 'enum',
				'values'      => [ 'overlay', 'glass' ],
				'default'     => 'overlay',
				'description' => 'The toast\'s surface. Emitted as data-surface. Glass falls back to the overlay surface under reduced transparency and in high contrast.',
			],
			[
				'name'        => 'icon',
				'type'        => 'string',
				'description' => 'An icon name from the registry. Defaults to the color\'s status icon: circle-check, triangle-alert, circle-alert or info. A slot or node overrides it.',
			],
			[
				'name'        => 'actions',
				'type'        => 'node',
				'description' => 'Buttons under the text, such as Undo. In a toaster, a toast with an action doesn\'t dismiss itself.',
			],
			[
				'name'        => 'hideClose',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Hides the close button.',
			],
			[
				'name'        => 'closeLabel',
				'type'        => 'string',
				'default'     => 'Dismiss notification',
				'description' => 'The close button\'s accessible name. Translate it: Livewire defaults it through __( \'Dismiss notification\' ).',
				'a11y'        => 'The close button is icon-only, so this is its only name.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { title: \'…\', actions: \'…\' }.',
			],
		],
		'variants'    => [ 'default', 'inverse' ],
		'colors'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The toast: role status, or alert for errors.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'The status icon.',
			],
			[
				'name'        => 'title',
				'element'     => 'p',
				'description' => 'The message.',
			],
			[
				'name'        => 'description',
				'element'     => 'p',
				'description' => 'Supporting text.',
			],
			[
				'name'        => 'actions',
				'element'     => 'div',
				'description' => 'The action buttons.',
			],
			[
				'name'        => 'closeTrigger',
				'element'     => 'button',
				'description' => 'The close button: a ghost, neutral, small icon-only Button.',
			],
		],
		'slots'       => [
			[
				'name'        => 'icon',
				'description' => 'Overrides the icon.',
			],
			[
				'name'        => 'title',
				'description' => 'Rich message content.',
			],
			[
				'name'        => 'description',
				'description' => 'Rich supporting text.',
			],
			[
				'name'        => 'actions',
				'description' => 'The action buttons.',
			],
		],
		'events'      => [
			[
				'name'        => 'open-change',
				'description' => 'The close button was pressed. In a toaster the toast also dismisses itself; on its own, hiding it is the owner\'s job.',
				'payload'     => 'boolean',
			],
		],
		'a11y'        => [
			'role'         => 'status',
			'roles'        => [ 'alert' ],
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Alt+T',
					'action' => 'Moves focus to the toaster\'s region.',
				],
				[
					'keys'   => 'Tab',
					'action' => 'Moves through the toasts\' actions and close buttons.',
				],
				[
					'keys'   => 'Escape',
					'action' => 'On a toast in a toaster, dismisses it.',
				],
			],
			'requirements' => [ 'The toaster\'s region is a labelled landmark (role=region, translatable "Notifications") with aria-live=polite; an error toast is role=alert, announced at once.', 'A toast times out after its duration (default 5000ms), paused while the region is hovered or focused; duration 0 keeps it.', 'Toasts with actions don\'t dismiss themselves (WCAG 2.2.1).', 'Never the only place an error is reported: blocking errors use Alert.', 'The close button has an accessible name (translatable, "Dismiss notification").', 'Text keeps 4.5:1 on the overlay, inverse and glass surfaces; the icon tint is --apui-color-<c>-text.', 'The region sits at the bottom end of the viewport and mirrors in RTL.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.2.1', '2.4.7', '4.1.2', '4.1.3' ],
		],
		'tokens'      => [ '--apui-toast-radius', '--apui-surface-overlay', '--apui-surface-inverse', '--apui-surface-glass', '--apui-surface-glass-border', '--apui-surface-glass-blur', '--apui-surface-glass-saturation', '--apui-elevation-overlay', '--apui-elevation-glass', '--apui-z-toast', '--apui-border-muted', '--apui-text-default', '--apui-text-muted', '--apui-text-muted-glass', '--apui-text-inverse', '--apui-color-success-text', '--apui-color-warning-text', '--apui-color-error-text', '--apui-color-info-text' ],
		'fixture'     => [
			'props'  => [
				'title'       => 'Listing saved',
				'description' => 'Cedarwood Estates is live now.',
			],
			'parts'  => [
				'actions' => 'Undo',
			],
			'states' => [],
		],
	],
];
