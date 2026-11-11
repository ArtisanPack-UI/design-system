<?php

/**
 * Generated from packages/manifest/components/*.json. Do not edit; run `npm run manifest`.
 *
 * @package ArtisanPack_UI
 */

return [
	'Breadcrumbs'       => [
		'name'        => 'Breadcrumbs',
		'description' => 'Shows where the current page sits in the hierarchy: a trail of links ending in the current page. Compose it from item children, or pass the same levels as items. Long trails collapse their middle behind an overflow button that reveals it.',
		'status'      => 'draft',
		'issue'       => 56,
		'rootClass'   => 'apui-breadcrumbs',
		'stacks'      => [
			'livewire' => [
				'name'         => 'breadcrumbs',
				'capabilities' => [ 'Children: breadcrumbs-item; 2.x link children in the slot still render as levels', 'navigate adds wire:navigate to every link', 'Items also accept the 2.x link key for href' ],
			],
			'react'    => [
				'name'         => 'Breadcrumbs',
				'capabilities' => [ 'Children: BreadcrumbsItem, after items', 'An item\'s renderLink renders a router link (Inertia, React Router) instead of the anchor' ],
			],
			'vue'      => [
				'name'         => 'Breadcrumbs',
				'capabilities' => [ 'Children: BreadcrumbsItem, after items', 'The scoped link slot renders a router link instead of the anchor' ],
			],
		],
		'props'       => [
			[
				'name'        => 'items',
				'type'        => 'array',
				'description' => 'The trail as data, from the section down to the current page: { label, href, icon, hideLabel }. Item children follow it, and the last level is the current page, never a link. icon is a registry name shown before the label; hideLabel keeps the label for screen readers only (a home icon).',
			],
			[
				'name'        => 'maxItems',
				'type'        => 'number',
				'default'     => 4,
				'description' => 'How many entries show before the middle collapses: the first item, an overflow button and the last maxItems - 2 items. The overflow button reveals the hidden levels in place. 0 never collapses.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'default'     => 'Breadcrumb',
				'description' => 'The navigation landmark\'s accessible name. Translate it: Livewire defaults it through __( \'Breadcrumb\' ).',
				'a11y'        => 'Names the nav landmark, so it is distinct from the main navigation.',
			],
			[
				'name'        => 'overflowLabel',
				'type'        => 'string',
				'default'     => 'Show {count} more levels',
				'description' => 'The overflow button\'s accessible name; {count} is the number of hidden levels. Translate it: Livewire defaults it through __( \'Show {count} more levels\' ).',
			],
			[
				'name'        => 'navigate',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Adds wire:navigate to every internal link, so Livewire swaps the page in without a full reload. Off-site, `#` and `mailto:` links load normally.',
				'stacks'      => [ 'livewire' ],
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { link: \'…\', current: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'nav',
				'description' => 'The navigation landmark.',
			],
			[
				'name'        => 'list',
				'element'     => 'ol',
				'description' => 'The ordered trail.',
			],
			[
				'name'        => 'item',
				'element'     => 'li',
				'description' => 'One level: a separator (after the first), then a link, the overflow button or the current page.',
			],
			[
				'name'        => 'link',
				'element'     => 'a',
				'description' => 'A level above the current page.',
			],
			[
				'name'        => 'separator',
				'element'     => 'span',
				'description' => 'The chevron between levels. Hidden from assistive technology; mirrors in RTL.',
			],
			[
				'name'        => 'current',
				'element'     => 'span',
				'description' => 'The current page, with aria-current="page". Not a link.',
			],
			[
				'name'        => 'overflow',
				'element'     => 'button',
				'description' => 'Stands in for the collapsed middle levels and reveals them.',
			],
		],
		'events'      => [],
		'a11y'        => [
			'role'         => 'navigation',
			'element'      => 'nav',
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves through the links and the overflow button. The current page isn\'t a stop.',
				],
				[
					'keys'   => 'Enter / Space',
					'action' => 'On the overflow button, reveals the hidden levels and moves focus to the first of them.',
				],
			],
			'requirements' => [ 'A nav landmark named by label ("Breadcrumb"), holding an ordered list.', 'The current page has aria-current="page" and isn\'t a link.', 'Separators are aria-hidden and mirror in RTL.', 'The overflow button names how many levels it hides and sets aria-expanded; revealed levels follow it in the reading order.', 'Links keep 4.5:1 (--apui-text-muted) and show a visible focus ring.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '2.1.1', '2.4.4', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-text-muted', '--apui-text-default', '--apui-text-subtle', '--apui-type-body-sm-font-size', '--apui-type-body-sm-line-height', '--apui-font-weight-medium', '--apui-radius-xs', '--apui-icon-size-sm', '--apui-state-hover', '--apui-focus-ring-color', '--apui-focus-ring-offset-color' ],
		'fixture'     => [
			'props' => [
				'items' => [
					[
						'label'     => 'Home',
						'href'      => '#',
						'icon'      => 'house',
						'hideLabel' => true,
					],
					[
						'label' => 'Properties',
						'href'  => '#',
					],
					[
						'label' => 'Lakeview Lofts',
						'href'  => '#',
					],
					[
						'label' => 'Analytics',
						'href'  => '#',
					],
					[
						'label' => 'Visitor',
					],
				],
			],
		],
	],
	'Button'            => [
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
	'Card'              => [
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
	'Checkbox'          => [
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
	'CheckboxGroup'     => [
		'name'        => 'CheckboxGroup',
		'description' => 'A labeled set of related checkboxes in a fieldset, with a shared hint and error, an optional select-all box, columns and a cards layout. Each option is a Checkbox; the value is the array of checked values.',
		'status'      => 'draft',
		'issue'       => 53,
		'rootClass'   => 'apui-checkbox-group',
		'stacks'      => [
			'livewire' => [
				'name' => 'checkbox-group',
			],
			'react'    => [
				'name' => 'CheckboxGroup',
			],
			'vue'      => [
				'name' => 'CheckboxGroup',
			],
		],
		'props'       => [
			[
				'name'        => 'options',
				'type'        => 'array',
				'description' => 'The options: strings, or { value, label, description, disabled } objects.',
			],
			[
				'name'        => 'value',
				'type'        => 'array',
				'description' => 'The checked values. Livewire binds it with wire:model (an array property), Vue with v-model.',
			],
			[
				'name'        => 'defaultValue',
				'type'        => 'array',
				'description' => 'The initially checked values of an uncontrolled group.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The group label, rendered as the fieldset\'s legend.',
			],
			[
				'name'        => 'hint',
				'type'        => 'node',
				'description' => 'Help text under the options, linked to the group with aria-describedby.',
			],
			[
				'name'        => 'error',
				'type'        => 'string',
				'description' => 'Validation message. Marks the group invalid and is linked with aria-describedby.',
			],
			[
				'name'        => 'invalid',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Marks the group invalid without a message. Emitted as data-invalid.',
				'a11y'        => 'Sets aria-invalid on every checkbox.',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables every option, and select all.',
			],
			[
				'name'        => 'orientation',
				'type'        => 'enum',
				'values'      => [ 'vertical', 'horizontal' ],
				'default'     => 'vertical',
				'description' => 'Stacks the options or wraps them in a row. Emitted as data-orientation.',
			],
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'default', 'cards' ],
				'default'     => 'default',
				'description' => 'Plain checkboxes, or bordered cards that are clickable anywhere. Emitted as data-variant.',
			],
			[
				'name'        => 'columns',
				'type'        => 'number',
				'default'     => 1,
				'description' => 'Lays vertical options out in 1, 2 or 3 columns. Emitted as data-columns.',
			],
			[
				'name'        => 'selectAll',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Adds a select-all checkbox before the options. It shows the mixed state while some, not all, are checked.',
			],
			[
				'name'        => 'selectAllLabel',
				'type'        => 'string',
				'default'     => 'Select all',
				'description' => 'The select-all checkbox\'s label. Translated by default.',
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
				'description' => 'Extra classes per part, such as { items: \'…\', label: \'…\' }.',
			],
		],
		'variants'    => [ 'default', 'cards' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'fieldset',
				'description' => 'The group: legend, select all, items, hint and error.',
			],
			[
				'name'        => 'label',
				'element'     => 'legend',
				'description' => 'The group label.',
			],
			[
				'name'        => 'selectAll',
				'element'     => 'div',
				'description' => 'Holds the select-all Checkbox, which takes the indeterminate state while some options are checked.',
			],
			[
				'name'        => 'items',
				'element'     => 'div',
				'description' => 'The options, each a Checkbox (.apui-checkbox) whose native input gets the group\'s attributes.',
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
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'The checked values changed, in option order. Select all reports every enabled option, or none.',
				'payload'     => 'Array<string | number>',
			],
		],
		'a11y'        => [
			'element'      => 'fieldset',
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves between select all and the checkboxes.',
				],
				[
					'keys'   => 'Space',
					'action' => 'Toggles the focused checkbox.',
				],
			],
			'requirements' => [ 'A fieldset and legend group native checkboxes; each option is a Checkbox with its own label.', 'Hint and error are linked to the fieldset with aria-describedby; invalid sets aria-invalid on each checkbox.', 'Select all is a real checkbox with the mixed (indeterminate) state while some options are checked.', 'Cards are clickable anywhere: the label covers the card.', 'Use RadioGroup for mutually exclusive options.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.7', '2.5.8', '3.3.1', '3.3.2', '4.1.2' ],
		],
		'tokens'      => [ '--apui-selected-bg', '--apui-selected-border', '--apui-radius-md', '--apui-border-default', '--apui-color-error-border', '--apui-color-error-text', '--apui-surface-default', '--apui-text-default', '--apui-text-muted' ],
		'fixture'     => [
			'props'  => [
				'label'     => 'Notify me about',
				'value'     => [ 'offers' ],
				'selectAll' => true,
				'options'   => [
					[
						'value'       => 'offers',
						'label'       => 'New offers',
						'description' => 'Within an hour of submission',
					],
					[
						'value' => 'prices',
						'label' => 'Price changes in saved searches',
					],
					[
						'value'    => 'digest',
						'label'    => 'Weekly analytics digest',
						'disabled' => true,
					],
				],
			],
			'parts'  => [
				'hint'  => 'We never send more than one email a day.',
				'error' => 'Choose at least one.',
			],
			'states' => [ 'hover', 'focus-visible', 'disabled', 'invalid' ],
		],
	],
	'CodeEditor'        => [
		'name'        => 'CodeEditor',
		'description' => 'Editable code in a native textarea, with file tabs, a language select, line numbers, the active line, diagnostics listed in text and a status bar. Code stays left to right in RTL.',
		'status'      => 'draft',
		'issue'       => 53,
		'rootClass'   => 'apui-code-editor',
		'stacks'      => [
			'livewire' => [
				'name' => 'code-editor',
			],
			'react'    => [
				'name' => 'CodeEditor',
			],
			'vue'      => [
				'name' => 'CodeEditor',
			],
		],
		'props'       => [
			[
				'name'        => 'language',
				'type'        => 'string',
				'description' => 'The code\'s language, shown in the status bar and selected in the language select.',
			],
			[
				'name'        => 'languages',
				'type'        => 'array',
				'description' => 'Options for the language select, as strings or { value, label }. The select renders when there are any.',
			],
			[
				'name'        => 'tabs',
				'type'        => 'array',
				'description' => 'File tabs, as strings or { value, label }. They render as a tablist over the code.',
			],
			[
				'name'        => 'tab',
				'type'        => 'string',
				'description' => 'The selected tab\'s value. Defaults to the first tab.',
			],
			[
				'name'        => 'diagnostics',
				'type'        => 'array',
				'description' => 'Problems as { line, column?, message, severity? } (error, warning or info). Marked in the gutter and listed in text under the code.',
			],
			[
				'name'        => 'tabSize',
				'type'        => 'number',
				'default'     => 2,
				'description' => 'Spaces Tab inserts, shown in the status bar.',
			],
			[
				'name'        => 'rows',
				'type'        => 'number',
				'default'     => 12,
				'description' => 'The fewest lines shown. The editor grows with its content.',
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The visible label, linked to the control.',
			],
			[
				'name'        => 'hint',
				'type'        => 'node',
				'description' => 'Help text under the editor, linked with aria-describedby.',
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
				'description' => 'Disables the control. Emitted as data-disabled.',
			],
			[
				'name'        => 'readonly',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Makes the code read-only. It stays focusable and selectable. Emitted as data-readonly.',
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
				'description' => 'The code. Livewire binds it with wire:model on the textarea, Vue with v-model.',
			],
			[
				'name'        => 'defaultValue',
				'type'        => 'string',
				'stacks'      => [ 'react' ],
				'description' => 'The initial value of an uncontrolled editor.',
			],
			[
				'name'        => 'tabsLabel',
				'type'        => 'string',
				'description' => 'The file tablist\'s accessible name. Defaults to "Open files", translated in Livewire.',
			],
			[
				'name'        => 'languageLabel',
				'type'        => 'string',
				'description' => 'The language select\'s accessible name. Defaults to "Language", translated in Livewire.',
			],
			[
				'name'        => 'positionLabel',
				'type'        => 'string',
				'description' => 'The caret position in the status bar; :line and :column are numbers. Defaults to "Ln :line, Col :column", translated in Livewire.',
			],
			[
				'name'        => 'spacesLabel',
				'type'        => 'string',
				'description' => 'The indentation in the status bar; :count is tabSize. Defaults to "Spaces: :count", translated in Livewire.',
			],
			[
				'name'        => 'errorCountLabel',
				'type'        => 'string',
				'description' => 'The status bar\'s count for one error. Defaults to ":count error", translated in Livewire.',
			],
			[
				'name'        => 'errorsCountLabel',
				'type'        => 'string',
				'description' => 'The status bar\'s error count; :count is the number. Defaults to ":count errors", translated in Livewire.',
			],
			[
				'name'        => 'warningCountLabel',
				'type'        => 'string',
				'description' => 'The status bar\'s count for one warning. Defaults to ":count warning", translated in Livewire.',
			],
			[
				'name'        => 'warningsCountLabel',
				'type'        => 'string',
				'description' => 'The status bar\'s warning count; :count is the number. Defaults to ":count warnings", translated in Livewire.',
			],
			[
				'name'        => 'problemsLabel',
				'type'        => 'string',
				'description' => 'The diagnostics list\'s accessible name. Defaults to "Problems", translated in Livewire.',
			],
			[
				'name'        => 'lineLabel',
				'type'        => 'string',
				'description' => 'A diagnostic\'s line; :line is the number. Defaults to "Line :line", translated in Livewire.',
			],
			[
				'name'        => 'severityErrorLabel',
				'type'        => 'string',
				'description' => 'The visually hidden severity name of an error. Defaults to "Error", translated in Livewire.',
			],
			[
				'name'        => 'severityWarningLabel',
				'type'        => 'string',
				'description' => 'The visually hidden severity name of a warning. Defaults to "Warning", translated in Livewire.',
			],
			[
				'name'        => 'severityInfoLabel',
				'type'        => 'string',
				'description' => 'The visually hidden severity name of an info diagnostic. Defaults to "Info", translated in Livewire.',
			],
			[
				'name'        => 'instructionsLabel',
				'type'        => 'string',
				'description' => 'The visually hidden keyboard instructions linked to the control. Defaults to "Tab inserts indentation. To leave the editor, press Escape, then Tab.", translated in Livewire.',
			],
			[
				'name'        => 'errorField',
				'type'        => 'string',
				'stacks'      => [ 'livewire' ],
				'description' => 'The validation key to read from $errors. Defaults to the wire:model name.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { gutter: \'…\', control: \'…\' }.',
			],
		],
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
				'description' => 'The bordered frame: header, body, diagnostics and status. The spec\'s root.',
			],
			[
				'name'        => 'header',
				'element'     => 'div',
				'description' => 'The bar over the code with the tabs and the language select. Renders with tabs or languages.',
			],
			[
				'name'        => 'tabs',
				'element'     => 'div',
				'description' => 'The file tabs, role=tablist with roving focus.',
			],
			[
				'name'        => 'tab',
				'element'     => 'button',
				'description' => 'One file tab, role=tab with aria-selected.',
			],
			[
				'name'        => 'languageSelect',
				'element'     => 'select',
				'description' => 'The native language select, with an accessible name.',
			],
			[
				'name'        => 'body',
				'element'     => 'div',
				'description' => 'The gutter beside the control, left to right in every direction. The tab panel when there are tabs.',
			],
			[
				'name'        => 'gutter',
				'element'     => 'div',
				'description' => 'Line numbers. Hidden from screen readers.',
			],
			[
				'name'        => 'line',
				'element'     => 'span',
				'description' => 'One line number, with data-active on the caret\'s line and data-severity on lines with diagnostics.',
			],
			[
				'name'        => 'control',
				'element'     => 'textarea',
				'description' => 'The native textarea. Attributes other than class land here.',
			],
			[
				'name'        => 'diagnostics',
				'element'     => 'ul',
				'description' => 'The diagnostics listed in text, so they\'re never only a mark.',
			],
			[
				'name'        => 'diagnostic',
				'element'     => 'li',
				'description' => 'One diagnostic: an icon, its line and message, with data-severity.',
			],
			[
				'name'        => 'status',
				'element'     => 'div',
				'description' => 'The status bar: problems, the caret\'s line and column, indentation and language.',
			],
			[
				'name'        => 'instructions',
				'element'     => 'span',
				'description' => 'Visually hidden keyboard instructions, linked to the control with aria-describedby.',
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
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'The code changed.',
				'payload'     => 'string',
			],
			[
				'name'        => 'tab-change',
				'description' => 'A tab was selected. The app swaps the value for that file.',
				'payload'     => 'string',
			],
			[
				'name'        => 'language-change',
				'description' => 'A language was chosen in the select.',
				'payload'     => 'string',
			],
		],
		'a11y'        => [
			'keyboard'     => [
				[
					'keys'   => 'Tab / Shift+Tab',
					'action' => 'Inside the code, indents or outdents the line or every selected line by tabSize spaces.',
				],
				[
					'keys'   => 'Escape, then Tab',
					'action' => 'Leaves the editor: after Escape, Tab and Shift+Tab move focus as usual.',
				],
				[
					'keys'   => 'ArrowLeft / ArrowRight',
					'action' => 'Moves between file tabs and selects them, following the text direction; Home and End go to the first and last.',
				],
			],
			'requirements' => [ 'The label is always visible and linked with for/id.', 'Tab inserts indentation; the way out (Escape, then Tab) is documented and read out through the instructions linked to the control.', 'Diagnostics are listed in text with their line and severity, not only marked in the gutter.', 'The file tabs are a tablist with one tab stop, and arrow keys follow the text direction (RTL); the body is their tab panel.', 'Hint, error and the instructions are linked to the control with aria-describedby; invalid sets aria-invalid.', 'The code and gutter stay left to right in RTL; the header and status bar mirror (D-004).', 'Colors come from tokens, so the editor follows the theme: never a hard-coded dark editor inside a light theme.', 'Class goes to the root; every other attribute (wire:model, name) goes to the control.' ],
			'wcag'         => [ '1.3.1', '1.4.1', '1.4.3', '1.4.11', '2.1.1', '2.1.2', '2.4.3', '2.4.7', '3.3.1', '3.3.2', '4.1.2' ],
		],
		'tokens'      => [ '--apui-input-radius', '--apui-border-default', '--apui-border-muted', '--apui-surface-default', '--apui-surface-sunken', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-color-primary', '--apui-color-error', '--apui-color-error-border', '--apui-color-error-text', '--apui-color-warning', '--apui-color-warning-text', '--apui-color-info', '--apui-color-info-text', '--apui-state-hover', '--apui-font-family-mono', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'label' => 'Source',
				'rows'  => 6,
				'tabs'  => [
					[
						'value' => 'format-price.ts',
						'label' => 'format-price.ts',
					],
					[
						'value' => 'listing.blade.php',
						'label' => 'listing.blade.php',
					],
				],
			],
			'parts'  => [
				'required'    => true,
				'hint'        => 'TypeScript, two spaces.',
				'error'       => 'Fix the errors before saving.',
				'languages'   => [
					[
						'value' => 'typescript',
						'label' => 'TypeScript',
					],
					[
						'value' => 'php',
						'label' => 'PHP',
					],
				],
				'language'    => 'typescript',
				'diagnostics' => [
					[
						'line'     => 2,
						'message'  => 'Type \'string\' is not assignable to type \'number\'.',
						'severity' => 'error',
					],
				],
				'tabsLabel'   => 'Files',
			],
			'states' => [ 'hover', 'focus-visible', 'disabled', 'invalid', 'readonly' ],
		],
	],
	'ColorPicker'       => [
		'name'        => 'ColorPicker',
		'description' => 'A color field: a swatch that opens a popover (saturation and brightness area, hue and opacity sliders, format select, eyedropper and preset swatches) and a text value that is always available for typing. On the behavior engine\'s color-picker machine (Zag).',
		'status'      => 'draft',
		'issue'       => 53,
		'rootClass'   => 'apui-color-picker',
		'stacks'      => [
			'livewire' => [
				'name'         => 'color-picker',
				'capabilities' => [ 'wire:model binds value (text in the current format) through $wire.entangle()', 'colorpicker stays as a deprecated alias' ],
			],
			'react'    => [
				'name' => 'ColorPicker',
			],
			'vue'      => [
				'name' => 'ColorPicker',
			],
		],
		'props'       => [
			[
				'name'        => 'value',
				'type'        => 'string',
				'description' => 'The color as text in any of the formats (#1f74bf, rgb(…), hsl(…), oklch(…)); reported back in the current format. Livewire binds it with wire:model, Vue with v-model.',
			],
			[
				'name'        => 'defaultValue',
				'type'        => 'string',
				'description' => 'The initial color of an uncontrolled picker.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'format',
				'type'        => 'enum',
				'values'      => [ 'hex', 'rgb', 'hsl', 'oklch' ],
				'default'     => 'hex',
				'description' => 'The text format of the value. The format select switches it, rewriting the value. Emitted as data-format.',
			],
			[
				'name'        => 'alpha',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Offers opacity: the opacity slider, and an alpha in the text (#rrggbbaa, / 0.5) when below 1. Off keeps every value opaque.',
			],
			[
				'name'        => 'swatches',
				'type'        => 'array',
				'description' => 'Preset colors as text, such as the brand palette, shown in the popover.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md', 'lg' ],
				'default'     => 'md',
				'description' => 'Control height, matching Input. Emitted as data-size.',
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The visible label, linked to the text value.',
			],
			[
				'name'        => 'hint',
				'type'        => 'node',
				'description' => 'Help text under the field, linked with aria-describedby.',
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
				'a11y'        => 'Sets aria-invalid on the text value.',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables the field and the popover\'s controls.',
			],
			[
				'name'        => 'required',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Marks the field required and shows the required mark.',
				'a11y'        => 'Sets required on the text value.',
			],
			[
				'name'        => 'open',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Whether the popover is open. Vue binds it with v-model:open. Emitted as data-state.',
			],
			[
				'name'        => 'defaultOpen',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'The initial state of an uncontrolled popover.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'portal',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Renders the popover at the end of the body (x-teleport, a React portal, Vue Teleport). Off renders it in place.',
			],
			[
				'name'        => 'triggerLabel',
				'type'        => 'string',
				'default'     => 'Choose a color',
				'description' => 'The swatch button\'s and the popover\'s accessible name. Translated by default.',
			],
			[
				'name'        => 'areaLabel',
				'type'        => 'string',
				'default'     => 'Saturation and brightness',
				'description' => 'The area\'s accessible name. Translated by default.',
			],
			[
				'name'        => 'hueLabel',
				'type'        => 'string',
				'default'     => 'Hue',
				'description' => 'The hue slider\'s accessible name. Translated by default.',
			],
			[
				'name'        => 'alphaLabel',
				'type'        => 'string',
				'default'     => 'Opacity',
				'description' => 'The opacity slider\'s accessible name. Translated by default.',
			],
			[
				'name'        => 'formatLabel',
				'type'        => 'string',
				'default'     => 'Format',
				'description' => 'The format select\'s accessible name. Translated by default.',
			],
			[
				'name'        => 'eyeDropperLabel',
				'type'        => 'string',
				'default'     => 'Pick a color from the screen',
				'description' => 'The eyedropper\'s accessible name. Translated by default.',
			],
			[
				'name'        => 'swatchesLabel',
				'type'        => 'string',
				'default'     => 'Swatches',
				'description' => 'The preset swatch group\'s accessible name. Translated by default.',
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
				'description' => 'Extra classes per part, such as { trigger: \'…\', content: \'…\' }.',
			],
		],
		'sizes'       => [ 'sm', 'md', 'lg' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The field: label, box, hint and error, then the popover. Zag\'s root part.',
			],
			[
				'name'        => 'label',
				'element'     => 'label',
				'description' => 'The visible label, for the text value.',
			],
			[
				'name'        => 'required',
				'element'     => 'span',
				'description' => 'The required mark inside the label. Hidden from screen readers; the text value is required.',
			],
			[
				'name'        => 'box',
				'element'     => 'div',
				'description' => 'The bordered box around the trigger and the text value: Zag\'s control part, renamed to the field anatomy\'s box (D-018).',
			],
			[
				'name'        => 'trigger',
				'element'     => 'button',
				'description' => 'The spec\'s swatch: a button at the start of the box that opens the popover. Zag\'s trigger.',
			],
			[
				'name'        => 'swatch',
				'element'     => 'span',
				'description' => 'A color fill: the current color in the trigger, or a preset in a swatch trigger.',
			],
			[
				'name'        => 'control',
				'element'     => 'input',
				'description' => 'The text value, always visible. Enter or blur sets the color from any format. Attributes other than class land here.',
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
			[
				'name'        => 'positioner',
				'element'     => 'div',
				'description' => 'Places the popover under the field.',
			],
			[
				'name'        => 'content',
				'element'     => 'div',
				'description' => 'The popover (role=dialog), named by triggerLabel.',
			],
			[
				'name'        => 'area',
				'element'     => 'div',
				'description' => 'The saturation (inline axis) and brightness (block axis) area.',
			],
			[
				'name'        => 'areaBackground',
				'element'     => 'div',
				'description' => 'The area\'s gradients, drawn by the machine for the current hue.',
			],
			[
				'name'        => 'areaThumb',
				'element'     => 'div',
				'description' => 'The spec\'s cursor: a 2D slider (role=slider) with aria-valuetext.',
			],
			[
				'name'        => 'channelSlider',
				'element'     => 'div',
				'description' => 'A channel slider, data-channel="hue" or "alpha".',
			],
			[
				'name'        => 'channelSliderTrack',
				'element'     => 'div',
				'description' => 'The slider\'s track, with the channel\'s gradient.',
			],
			[
				'name'        => 'channelSliderThumb',
				'element'     => 'div',
				'description' => 'The slider\'s thumb (role=slider), with aria-valuetext in degrees or percent.',
			],
			[
				'name'        => 'transparencyGrid',
				'element'     => 'div',
				'description' => 'The checkerboard under the opacity slider\'s gradient.',
			],
			[
				'name'        => 'row',
				'element'     => 'div',
				'description' => 'The row with the format select and the eyedropper.',
			],
			[
				'name'        => 'formatSelect',
				'element'     => 'select',
				'description' => 'A native select of the text formats: HEX, RGB, HSL, OKLCH.',
			],
			[
				'name'        => 'eyeDropperTrigger',
				'element'     => 'button',
				'description' => 'Picks a color from the screen. Hidden where the browser has no EyeDropper API.',
			],
			[
				'name'        => 'swatchGroup',
				'element'     => 'div',
				'description' => 'role=group of the preset swatches, named by swatchesLabel.',
			],
			[
				'name'        => 'swatchTrigger',
				'element'     => 'button',
				'description' => 'One preset, named by its value, aria-pressed while it is the color.',
			],
		],
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'The color changed: dragged, typed, picked, chosen from a swatch, or rewritten by a format change. Reports the text in the current format.',
				'payload'     => 'string',
			],
			[
				'name'        => 'open-change',
				'description' => 'The popover opened or closed itself: the trigger, Escape or an outside click. Setting open doesn\'t fire it.',
				'payload'     => 'boolean',
			],
			[
				'name'        => 'format-change',
				'description' => 'The format select changed the text format.',
				'payload'     => '\'hex\' | \'rgb\' | \'hsl\' | \'oklch\'',
			],
		],
		'a11y'        => [
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves between the trigger and the text value; in the popover, between the area, the sliders, the format select, the eyedropper and the swatches.',
				],
				[
					'keys'   => 'Enter, Space',
					'action' => 'On the trigger, opens the popover; on a swatch, chooses it.',
				],
				[
					'keys'   => 'ArrowLeft, ArrowRight',
					'action' => 'On the area, less or more saturation; on a slider, less or more of its channel. They follow the text direction, so they swap under RTL.',
				],
				[
					'keys'   => 'ArrowUp, ArrowDown',
					'action' => 'On the area, more or less brightness; on a slider, more or less of its channel.',
				],
				[
					'keys'   => 'PageUp, PageDown, Shift+Arrow',
					'action' => 'Larger steps.',
				],
				[
					'keys'   => 'Enter',
					'action' => 'In the text value, sets the color from the typed text.',
				],
				[
					'keys'   => 'Escape',
					'action' => 'Closes the popover and returns focus to the trigger.',
				],
			],
			'requirements' => [ 'The text value is always visible outside the popover and always available for typing, in any of the four formats.', 'The area and sliders are keyboard-operable role=slider elements with aria-valuetext ("72%, 75%", "208°", "80%").', 'The area and sliders mirror under RTL, and ArrowLeft and ArrowRight follow the text direction.', 'Swatches are buttons named by their value, with aria-pressed on the current one, in a named group.', 'The trigger is labelled and reports aria-expanded and aria-controls; the popover is a named dialog.', 'The eyedropper is hidden where the browser can\'t pick from the screen.', 'Every built-in label is a translatable prop.', 'Hint and error are linked to the text value with aria-describedby; invalid sets aria-invalid.', 'Every server-rendered part keeps a stable id in Livewire; the popover is wire:ignore (D-015).' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.3', '2.4.7', '2.5.7', '2.5.8', '3.3.1', '3.3.2', '4.1.2' ],
		],
		'tokens'      => [ '--apui-input-radius', '--apui-popover-radius', '--apui-control-height-sm', '--apui-control-height-md', '--apui-control-height-lg', '--apui-radius-xs', '--apui-radius-md', '--apui-radius-full', '--apui-surface-default', '--apui-surface-sunken', '--apui-surface-overlay', '--apui-elevation-overlay', '--apui-z-dropdown', '--apui-border-default', '--apui-border-strong', '--apui-border-muted', '--apui-color-error-border', '--apui-color-error-text', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-font-family-mono', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'label'    => 'Primary color',
				'value'    => '#1f74bf',
				'swatches' => [ '#1f74bf', '#0b9488', '#1f6f3d', '#de9d16', '#e88761', '#c92f33', '#91256c', '#23272b' ],
				'open'     => true,
				'portal'   => false,
			],
			'parts'  => [
				'required' => true,
				'hint'     => 'Used for buttons and links.',
				'error'    => 'Enter a color, such as #1f74bf.',
			],
			'states' => [ 'hover', 'focus-visible', 'disabled', 'invalid' ],
		],
	],
	'Combobox'          => [
		'name'        => 'Combobox',
		'description' => 'A text input that filters a listbox: pick one match, or several shown as removable chips, and optionally create a value that isn\'t listed. It shares the field anatomy with Input and Select. Filtering is local by default; remote hands the search to the app or server. Replaces Choices, ChoicesOffline and Tags (multiple + allowCreate).',
		'status'      => 'draft',
		'issue'       => 54,
		'rootClass'   => 'apui-combobox',
		'stacks'      => [
			'livewire' => [
				'name'         => 'combobox',
				'capabilities' => [ 'wire:model binds value (a string, or an array with multiple) through $wire.entangle()', 'search-model entangles the search text with a Livewire property, debounced, for remote search' ],
			],
			'react'    => [
				'name' => 'Combobox',
			],
			'vue'      => [
				'name' => 'Combobox',
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
				'description' => 'The options: strings, or { value, label, description, icon, color, disabled } objects. description is a second line; color tints the option\'s chip with multiple.',
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The visible label, linked to the input.',
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
				'a11y'        => 'Sets aria-invalid on the input.',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables the input, the buttons and the chips.',
			],
			[
				'name'        => 'required',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Marks the field required and shows the required mark.',
				'a11y'        => 'Sets required on the input.',
			],
			[
				'name'        => 'placeholder',
				'type'        => 'string',
				'default'     => 'Search…',
				'description' => 'Shown in the empty input. Translated by default.',
			],
			[
				'name'        => 'name',
				'type'        => 'string',
				'description' => 'Submits the value with a native form: a hidden input carrying the value, or one per value with multiple (use a name such as tags[] if the server expects an array). None while the value is empty. The text input itself has no name.',
			],
			[
				'name'        => 'value',
				'type'        => 'string',
				'description' => 'The selected value: a string, or an array of strings with multiple. Livewire binds it with wire:model, Vue with v-model.',
			],
			[
				'name'        => 'defaultValue',
				'type'        => 'string',
				'description' => 'The initial value of an uncontrolled combobox.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'multiple',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Selects several values, shown as removable chips before the input. Backspace in the empty input removes the last one. Emitted as data-multiple.',
			],
			[
				'name'        => 'max',
				'type'        => 'number',
				'description' => 'With multiple, the most values that can be chosen. Once reached, the other options are disabled.',
			],
			[
				'name'        => 'allowCreate',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Offers “Create …” for typed text that matches no option, ignoring case and accents. Choosing it adds the text as a value and fires create. With multiple, this is the tags input.',
			],
			[
				'name'        => 'remote',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'The app filters the options: typing fires search-change and the combobox shows the options it\'s given, unfiltered. Without it, options are filtered by label here.',
			],
			[
				'name'        => 'search',
				'type'        => 'string',
				'description' => 'The text in the input when it renders: it filters the options (unless remote) and marks the matches.',
			],
			[
				'name'        => 'loading',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Shows a spinner in the control and the loading text in the listbox, while remote results load. Emitted as data-loading.',
				'a11y'        => 'Sets aria-busy on the listbox.',
			],
			[
				'name'        => 'clearable',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Adds a button that clears the value, shown while there is one.',
			],
			[
				'name'        => 'open',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Whether the listbox is open. Vue binds it with v-model:open.',
			],
			[
				'name'        => 'defaultOpen',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'The initial state of an uncontrolled listbox.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'portal',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Renders the listbox at the end of the body, above everything (x-teleport, a React portal, Vue Teleport). Off renders it in place.',
			],
			[
				'name'        => 'leadingIcon',
				'type'        => 'string',
				'description' => 'Icon name before the input, resolved through the icon registry. A slot or node overrides it.',
			],
			[
				'name'        => 'emptyLabel',
				'type'        => 'string',
				'default'     => 'No matches for “{search}”.',
				'description' => 'Shown in the listbox when nothing matches; {search} is the typed text. The empty slot overrides it. Livewire translates it with :search.',
			],
			[
				'name'        => 'loadingLabel',
				'type'        => 'string',
				'default'     => 'Loading…',
				'description' => 'Shown in the listbox while loading.',
			],
			[
				'name'        => 'createLabel',
				'type'        => 'string',
				'default'     => 'Create “{value}”',
				'description' => 'The create option\'s text; {value} is the typed text. Livewire translates it with :value.',
			],
			[
				'name'        => 'removeLabel',
				'type'        => 'string',
				'default'     => 'Remove {label}',
				'description' => 'Each chip\'s remove button\'s accessible name; {label} is the chip\'s label. Livewire translates it with :label.',
			],
			[
				'name'        => 'removedLabel',
				'type'        => 'string',
				'default'     => 'Removed {label}.',
				'description' => 'Announced when a chip is removed. Livewire translates it with :label.',
			],
			[
				'name'        => 'clearLabel',
				'type'        => 'string',
				'default'     => 'Clear',
				'description' => 'The clear button\'s accessible name.',
			],
			[
				'name'        => 'triggerLabel',
				'type'        => 'string',
				'default'     => 'Show options',
				'description' => 'The chevron button\'s accessible name.',
			],
			[
				'name'        => 'searchModel',
				'type'        => 'string',
				'description' => 'The Livewire property the search text is entangled with, after debounce. The component reads it to filter the options it renders.',
				'stacks'      => [ 'livewire' ],
			],
			[
				'name'        => 'debounce',
				'type'        => 'number',
				'default'     => 250,
				'description' => 'Milliseconds to wait after typing before setting search-model.',
				'stacks'      => [ 'livewire' ],
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
				'description' => 'Extra classes per part, such as { label: \'…\', content: \'…\', chip: \'…\' }.',
			],
		],
		'sizes'       => [ 'sm', 'md', 'lg' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The field: label, control, hint, error and the listbox. Zag\'s root part.',
			],
			[
				'name'        => 'label',
				'element'     => 'label',
				'description' => 'The visible label, for the input.',
			],
			[
				'name'        => 'required',
				'element'     => 'span',
				'description' => 'The required mark inside the label. Hidden from screen readers; the input is required.',
			],
			[
				'name'        => 'box',
				'element'     => 'div',
				'description' => 'The bordered box around the icon, the chips, the input and the buttons, as in Input and Select (D-018). Zag\'s control part, renamed.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'Leading icon in the control, and an option\'s icon.',
			],
			[
				'name'        => 'chip',
				'element'     => 'span',
				'description' => 'With multiple, one chosen value. Tinted by the option\'s color.',
			],
			[
				'name'        => 'chipRemove',
				'element'     => 'button',
				'description' => 'A chip\'s remove button, labelled by removeLabel.',
			],
			[
				'name'        => 'control',
				'element'     => 'input',
				'description' => 'The text input: role combobox. Attributes go to the root, not here, since its text isn\'t the value. Zag\'s input part, renamed (D-018).',
			],
			[
				'name'        => 'spinner',
				'element'     => 'span',
				'description' => 'Shown in the control while loading.',
			],
			[
				'name'        => 'clearTrigger',
				'element'     => 'button',
				'description' => 'Clears the value. Rendered with clearable, hidden while there\'s no value.',
			],
			[
				'name'        => 'trigger',
				'element'     => 'button',
				'description' => 'The chevron that opens and closes the listbox. Not in the tab order; the input has the keyboard.',
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
			[
				'name'        => 'positioner',
				'element'     => 'div',
				'description' => 'Places the listbox under the control, as wide as it.',
			],
			[
				'name'        => 'content',
				'element'     => 'div',
				'description' => 'The listbox: role listbox. The spec\'s listbox.',
			],
			[
				'name'        => 'item',
				'element'     => 'div',
				'description' => 'An option: role option. The spec\'s option. The create option is an item with data-create.',
			],
			[
				'name'        => 'itemText',
				'element'     => 'span',
				'description' => 'An option\'s label.',
			],
			[
				'name'        => 'mark',
				'element'     => 'mark',
				'description' => 'The part of a label that matches the typed text: bold and underlined, never color alone.',
			],
			[
				'name'        => 'itemDescription',
				'element'     => 'span',
				'description' => 'An option\'s second line. The spec\'s description.',
			],
			[
				'name'        => 'itemIndicator',
				'element'     => 'span',
				'description' => 'With multiple, the check on a chosen option.',
			],
			[
				'name'        => 'empty',
				'element'     => 'div',
				'description' => 'Shown in the listbox when nothing matches, or while loading.',
			],
			[
				'name'        => 'status',
				'element'     => 'span',
				'description' => 'Visually hidden live region that announces a removed chip.',
			],
		],
		'slots'       => [
			[
				'name'        => 'icon',
				'description' => 'Overrides the leading icon.',
			],
			[
				'name'        => 'empty',
				'description' => 'Overrides the empty text, such as a link to add a record.',
			],
			[
				'name'        => 'item',
				'description' => 'Renders each option\'s content, given the option. Scoped: @scope(\'item\', $option) in Blade, #item="{ option }" in Vue, renderItem in React.',
			],
		],
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'A choice changed the value: a string or null, or an array with multiple.',
				'payload'     => 'string | string[] | null',
			],
			[
				'name'        => 'search-change',
				'description' => 'The person typed. The payload is the text; with remote, that\'s the query to filter by.',
				'payload'     => 'string',
			],
			[
				'name'        => 'open-change',
				'description' => 'The listbox opened or closed itself. Setting open doesn\'t fire it.',
				'payload'     => 'boolean',
			],
			[
				'name'        => 'create',
				'description' => 'The create option was chosen. The payload is the new value, already in the value; add it to the options to keep it.',
				'payload'     => 'string',
			],
		],
		'a11y'        => [
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves focus to the input.',
				],
				[
					'keys'   => 'Typing',
					'action' => 'Filters the options (or sends the search, with remote) and highlights the first match.',
				],
				[
					'keys'   => 'ArrowDown, ArrowUp',
					'action' => 'Opens the listbox and moves through the options, skipping disabled ones.',
				],
				[
					'keys'   => 'Home, End',
					'action' => 'Moves to the first or last option while open.',
				],
				[
					'keys'   => 'Enter',
					'action' => 'Chooses the highlighted option; with multiple, toggles it and keeps the listbox open.',
				],
				[
					'keys'   => 'Escape',
					'action' => 'Closes the listbox; the value stays.',
				],
				[
					'keys'   => 'Backspace',
					'action' => 'With multiple, in the empty input, removes the last chip and announces it.',
				],
			],
			'requirements' => [ 'The input is role combobox with aria-expanded, aria-controls, aria-autocomplete=list and aria-activedescendant on the highlighted option.', 'The listbox is role listbox, labelled by the label; with multiple it sets aria-multiselectable, and chosen options set aria-selected.', 'Matches are shown with weight and an underline, not color.', 'The result count is announced as the list changes (translated); the empty state explains what to do next.', 'Each chip\'s remove button is labelled “Remove {label}”; removing a chip with Backspace is announced through the status region.', 'The label is always visible and linked with for/id; hint and error are linked with aria-describedby; invalid sets aria-invalid.', 'Visible focus ring on the box while the input (control) has :focus-visible; the highlighted option shows the hover tint and, from the keyboard, the ring.', 'The listbox opens under the control at its start edge and mirrors in RTL; it flips when there\'s no room.', 'Every part keeps a stable, server-rendered id in Livewire and options carry wire:key (D-015).', 'With name, the value is submitted through hidden inputs; the visible input\'s text (a label) is never submitted.' ],
			'wcag'         => [ '1.3.1', '1.4.1', '1.4.3', '1.4.11', '2.1.1', '2.4.3', '2.4.7', '2.5.8', '3.3.1', '3.3.2', '4.1.2', '4.1.3' ],
		],
		'tokens'      => [ '--apui-input-radius', '--apui-chip-radius', '--apui-control-height-sm', '--apui-control-height-md', '--apui-control-height-lg', '--apui-menu-radius', '--apui-menu-item-radius', '--apui-menu-item-height', '--apui-surface-default', '--apui-surface-sunken', '--apui-surface-overlay', '--apui-elevation-overlay', '--apui-z-dropdown', '--apui-border-default', '--apui-border-strong', '--apui-border-muted', '--apui-state-hover', '--apui-selected-bg', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-color-primary-text', '--apui-color-primary-border', '--apui-color-primary-soft-foreground', '--apui-color-neutral-soft', '--apui-color-neutral-soft-foreground', '--apui-color-error-border', '--apui-color-error-text', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'label'       => 'Property',
				'options'     => [
					[
						'value'       => 'lakeview',
						'label'       => 'Lakeview Lofts',
						'description' => 'United States, Chicago',
					],
					[
						'value'       => 'lakeside',
						'label'       => 'Lakeside Commons',
						'description' => 'Canada, Toronto',
						'color'       => 'success',
					],
					[
						'value'       => 'silver-lake',
						'label'       => 'Silver Lake Bungalows',
						'description' => 'United States, Los Angeles',
						'color'       => 'info',
					],
					[
						'value'       => 'harbor',
						'label'       => 'Harbor Point',
						'description' => 'United States, Boston',
					],
				],
				'search'      => 'Lake',
				'allowCreate' => true,
				'open'        => true,
				'portal'      => false,
			],
			'parts'  => [
				'required'    => true,
				'hint'        => 'Start typing a property name.',
				'error'       => 'Choose a property from the list.',
				'leadingIcon' => 'search',
				'multiple'    => true,
				'value'       => [ 'lakeside', 'silver-lake' ],
				'clearable'   => true,
				'loading'     => true,
			],
			'states' => [ 'hover', 'focus-visible', 'disabled', 'invalid', 'loading' ],
		],
	],
	'DatePicker'        => [
		'name'        => 'DatePicker',
		'description' => 'A text field with a calendar popover for a single date or a range, and with time it\'s DateTime: date and time in one field. Typing a date always works; the calendar is an aid. Replaces Livewire\'s datepicker and datetime.',
		'status'      => 'draft',
		'issue'       => 55,
		'rootClass'   => 'apui-date-picker',
		'stacks'      => [
			'livewire' => [
				'name'         => 'date-picker',
				'capabilities' => [ 'wire:model binds value (an ISO string, or an array of two in range mode) through $wire.entangle()', 'datepicker and datetime stay as deprecated aliases (datetime renders time mode)' ],
			],
			'react'    => [
				'name' => 'DatePicker',
			],
			'vue'      => [
				'name' => 'DatePicker',
			],
		],
		'props'       => [
			[
				'name'        => 'value',
				'type'        => 'string',
				'description' => 'The value as ISO 8601: a date (2026-11-12), a date and time in time mode (2026-11-12T11:00), or an array of two dates in range mode. Livewire binds it with wire:model, Vue with v-model.',
			],
			[
				'name'        => 'defaultValue',
				'type'        => 'string',
				'description' => 'The initial value of an uncontrolled date picker.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'mode',
				'type'        => 'enum',
				'values'      => [ 'single', 'range' ],
				'default'     => 'single',
				'description' => 'One date, or a range of two (two inputs in one box). Emitted as data-mode.',
			],
			[
				'name'        => 'time',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Date and time (DateTime): adds a time list beside the month, and the value carries the time. Single mode only. Emitted as data-time.',
			],
			[
				'name'        => 'step',
				'type'        => 'number',
				'default'     => 30,
				'description' => 'Minutes between the times in the time list.',
			],
			[
				'name'        => 'timeZone',
				'type'        => 'string',
				'description' => 'The IANA time zone the time is in, shown under the field in time mode and used for today\'s date. Default: none shown, UTC for today.',
			],
			[
				'name'        => 'locale',
				'type'        => 'string',
				'description' => 'BCP 47 locale for month and weekday names, the first day of the week and the default text pattern. Livewire defaults to the app locale, React and Vue to en-US.',
			],
			[
				'name'        => 'min',
				'type'        => 'string',
				'description' => 'The earliest date that can be chosen, ISO.',
			],
			[
				'name'        => 'max',
				'type'        => 'string',
				'description' => 'The latest date that can be chosen, ISO.',
			],
			[
				'name'        => 'disabledDates',
				'type'        => 'array',
				'description' => 'Dates that can\'t be chosen, as ISO strings. They\'re struck through.',
				'a11y'        => 'Sets aria-disabled on the day.',
			],
			[
				'name'        => 'weekStartsOn',
				'type'        => 'number',
				'description' => 'First day of the week, 0 (Sunday) to 6. Follows the locale unless set.',
			],
			[
				'name'        => 'format',
				'type'        => 'string',
				'description' => 'The text pattern, with yyyy, MM and dd tokens (dd.MM.yyyy). Follows the locale unless set; typing always works in it.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md', 'lg' ],
				'default'     => 'md',
				'description' => 'Control height. Emitted as data-size.',
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The visible label, linked to the (first) input.',
			],
			[
				'name'        => 'hint',
				'type'        => 'node',
				'description' => 'Help text under the field, linked with aria-describedby. Show the expected format here.',
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
				'a11y'        => 'Sets aria-invalid on the input.',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables the field and the calendar.',
			],
			[
				'name'        => 'readonly',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Makes the field read-only: it stays focusable, the calendar doesn\'t open.',
			],
			[
				'name'        => 'required',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Marks the field required and shows the required mark.',
				'a11y'        => 'Sets required on the input.',
			],
			[
				'name'        => 'placeholder',
				'type'        => 'string',
				'description' => 'Placeholder text. Defaults to the pattern, MM/DD/YYYY.',
			],
			[
				'name'        => 'name',
				'type'        => 'string',
				'description' => 'Submits the ISO value under this name in a hidden input (two, name[], in range mode).',
			],
			[
				'name'        => 'open',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Whether the calendar is open. Vue binds it with v-model:open. Emitted as data-state.',
			],
			[
				'name'        => 'defaultOpen',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'The initial state of an uncontrolled popover.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'portal',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Renders the popover at the end of the body (x-teleport, a React portal, Vue Teleport). Off renders it in place.',
			],
			[
				'name'        => 'footer',
				'type'        => 'node',
				'description' => 'A row under the calendar, such as a summary and an Apply button.',
			],
			[
				'name'        => 'triggerLabel',
				'type'        => 'string',
				'default'     => 'Choose date',
				'description' => 'The calendar button\'s accessible name. Translate it: Livewire defaults it through __( \'Choose date\' ) (or \'Choose date and time\').',
				'a11y'        => 'The button is icon-only, so this is its only name.',
			],
			[
				'name'        => 'previousLabel',
				'type'        => 'string',
				'default'     => 'Previous month',
				'description' => 'The previous-month button\'s accessible name. Livewire defaults it through __( \'Previous month\' ).',
			],
			[
				'name'        => 'nextLabel',
				'type'        => 'string',
				'default'     => 'Next month',
				'description' => 'The next-month button\'s accessible name. Livewire defaults it through __( \'Next month\' ).',
			],
			[
				'name'        => 'calendarLabel',
				'type'        => 'string',
				'default'     => 'Calendar',
				'description' => 'The popover\'s accessible name. Livewire defaults it through __( \'Calendar\' ).',
			],
			[
				'name'        => 'timeLabel',
				'type'        => 'string',
				'default'     => 'Time',
				'description' => 'The time list\'s name and heading. Livewire defaults it through __( \'Time\' ).',
			],
			[
				'name'        => 'endLabel',
				'type'        => 'string',
				'default'     => 'End date',
				'description' => 'The end input\'s accessible name in range mode. Livewire defaults it through __( \'End date\' ).',
			],
			[
				'name'        => 'timeZoneLabel',
				'type'        => 'string',
				'default'     => 'Time zone: {zone}',
				'description' => 'The time-zone line, with {zone} for the zone. Livewire defaults it through __( \'Time zone: :zone\' ).',
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
				'description' => 'Extra classes per part, such as { control: \'…\', content: \'…\' }.',
			],
		],
		'sizes'       => [ 'sm', 'md', 'lg' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The field: label, control, hint, time zone and error. Zag\'s root part.',
			],
			[
				'name'        => 'label',
				'element'     => 'label',
				'description' => 'The visible label, for the first input.',
			],
			[
				'name'        => 'required',
				'element'     => 'span',
				'description' => 'The required mark inside the label. Hidden from screen readers; the input is required.',
			],
			[
				'name'        => 'box',
				'element'     => 'div',
				'description' => 'The bordered box around the trigger and the input(s): Zag\'s control part, renamed to the field anatomy\'s box (D-018).',
			],
			[
				'name'        => 'trigger',
				'element'     => 'button',
				'description' => 'The calendar icon at the start of the box: an icon-only button that opens the popover.',
			],
			[
				'name'        => 'control',
				'element'     => 'input',
				'description' => 'The native text input, typed in the pattern: Zag\'s input part, renamed to the field anatomy\'s control (D-018). Range mode has two. Attributes other than class land on the first.',
			],
			[
				'name'        => 'hint',
				'element'     => 'p',
				'description' => 'Help text.',
			],
			[
				'name'        => 'timeZone',
				'element'     => 'p',
				'description' => 'The time zone, in time mode.',
			],
			[
				'name'        => 'error',
				'element'     => 'p',
				'description' => 'Validation message, with an icon.',
			],
			[
				'name'        => 'positioner',
				'element'     => 'div',
				'description' => 'Places the popover under the field.',
			],
			[
				'name'        => 'content',
				'element'     => 'div',
				'description' => 'The popover panel: the month, the time column and the footer.',
			],
			[
				'name'        => 'view',
				'element'     => 'div',
				'description' => 'The month: its header and grid.',
			],
			[
				'name'        => 'viewControl',
				'element'     => 'div',
				'description' => 'The header: previous month, the month\'s name, next month.',
			],
			[
				'name'        => 'prevTrigger',
				'element'     => 'button',
				'description' => 'Previous month: a ghost, neutral, small icon-only Button. Its arrow mirrors in RTL.',
			],
			[
				'name'        => 'rangeText',
				'element'     => 'span',
				'description' => 'The visible month and year, from Intl in the locale.',
			],
			[
				'name'        => 'nextTrigger',
				'element'     => 'button',
				'description' => 'Next month. Its arrow mirrors in RTL.',
			],
			[
				'name'        => 'table',
				'element'     => 'table',
				'description' => 'The month grid (role=grid).',
			],
			[
				'name'        => 'tableHead',
				'element'     => 'thead',
				'description' => 'The weekday row. Hidden from screen readers; each day\'s name says its weekday.',
			],
			[
				'name'        => 'tableRow',
				'element'     => 'tr',
				'description' => 'A week, or the weekday row.',
			],
			[
				'name'        => 'tableHeader',
				'element'     => 'th',
				'description' => 'A weekday name, from Intl in the locale.',
			],
			[
				'name'        => 'tableBody',
				'element'     => 'tbody',
				'description' => 'The weeks.',
			],
			[
				'name'        => 'tableCell',
				'element'     => 'td',
				'description' => 'A day\'s cell (role=gridcell, aria-selected).',
			],
			[
				'name'        => 'tableCellTrigger',
				'element'     => 'div',
				'description' => 'A day: today, selected, in range, outside the month or unavailable through data attributes.',
			],
			[
				'name'        => 'time',
				'element'     => 'div',
				'description' => 'The time column, in time mode.',
			],
			[
				'name'        => 'timeLabel',
				'element'     => 'span',
				'description' => 'The time column\'s heading. Hidden from screen readers; the list carries the same name.',
			],
			[
				'name'        => 'timeList',
				'element'     => 'div',
				'description' => 'The times (role=listbox).',
			],
			[
				'name'        => 'timeOption',
				'element'     => 'div',
				'description' => 'One time (role=option, aria-selected).',
			],
			[
				'name'        => 'footer',
				'element'     => 'div',
				'description' => 'The row under the calendar.',
			],
		],
		'slots'       => [
			[
				'name'        => 'label',
				'description' => 'Rich label content.',
			],
			[
				'name'        => 'hint',
				'description' => 'Rich help text.',
			],
			[
				'name'        => 'footer',
				'description' => 'The row under the calendar.',
			],
		],
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'A day, a time or typed text changed the value. Reports the ISO value.',
				'payload'     => 'string',
			],
			[
				'name'        => 'open-change',
				'description' => 'The popover opened or closed itself: the trigger, Escape, outside click or a choice. Setting open doesn\'t fire it.',
				'payload'     => 'boolean',
			],
		],
		'a11y'        => [
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves between the trigger and the input; typing a date in the pattern always works.',
				],
				[
					'keys'   => 'Enter, Space',
					'action' => 'On the trigger, opens the calendar; on a day, chooses it.',
				],
				[
					'keys'   => 'ArrowLeft, ArrowRight',
					'action' => 'Previous and next day. They follow the text direction, so they swap under RTL.',
				],
				[
					'keys'   => 'ArrowUp, ArrowDown',
					'action' => 'Same day of the previous and next week; in the time list, the previous and next time.',
				],
				[
					'keys'   => 'PageUp, PageDown',
					'action' => 'Previous and next month (Shift for a year).',
				],
				[
					'keys'   => 'Home, End',
					'action' => 'Start and end of the week; in the time list, the first and last time.',
				],
				[
					'keys'   => 'Escape',
					'action' => 'Closes the calendar and returns focus to the field.',
				],
			],
			'requirements' => [ 'Typing a date always works; the calendar never replaces the input.', 'The month is role=grid; each day names its full localized date, and its cell carries aria-selected, aria-disabled and aria-current=date for today.', 'Arrow keys follow the text direction, and the previous and next arrows mirror in RTL.', 'Month and weekday names come from Intl in the locale; every built-in label is a translatable prop.', 'The calendar button is labelled and reports aria-expanded and aria-controls.', 'The time list is a listbox of options with roving focus; the time zone is always visible when set.', 'Unavailable days are struck through as well as muted, never color alone; the selected day is filled, today has a ring.', 'Hint and error are linked to the input with aria-describedby; invalid sets aria-invalid.', 'Every server-rendered part keeps a stable id in Livewire; the calendar is client-rendered inside wire:ignore (D-015).' ],
			'wcag'         => [ '1.3.1', '1.4.1', '1.4.3', '1.4.11', '2.1.1', '2.4.3', '2.4.7', '2.5.8', '3.3.1', '3.3.2', '4.1.2' ],
		],
		'tokens'      => [ '--apui-input-radius', '--apui-menu-radius', '--apui-menu-item-radius', '--apui-radius-full', '--apui-control-height-sm', '--apui-control-height-md', '--apui-control-height-lg', '--apui-surface-default', '--apui-surface-sunken', '--apui-surface-overlay', '--apui-elevation-overlay', '--apui-z-dropdown', '--apui-border-default', '--apui-border-muted', '--apui-border-strong', '--apui-color-primary', '--apui-color-primary-foreground', '--apui-color-primary-soft', '--apui-color-primary-soft-foreground', '--apui-selected-bg', '--apui-state-hover', '--apui-color-error-border', '--apui-color-error-text', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'label'  => 'Move-in date',
				'locale' => 'en-US',
				'value'  => '2031-03-12',
				'open'   => true,
				'portal' => false,
			],
			'parts'  => [
				'required' => true,
				'hint'     => 'MM/DD/YYYY',
				'error'    => 'That date doesn\'t exist.',
				'time'     => true,
				'timeZone' => 'Europe/Madrid',
				'footer'   => 'Thu, Mar 12',
			],
			'states' => [ 'hover', 'focus-visible', 'disabled', 'invalid', 'readonly' ],
		],
	],
	'Dialog'            => [
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
	'DropdownMenu'      => [
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
	'Fieldset'          => [
		'name'        => 'Fieldset',
		'description' => 'Groups related fields under a legend (title and description), as a panel, a divided section or plain.',
		'status'      => 'draft',
		'issue'       => 53,
		'rootClass'   => 'apui-fieldset',
		'stacks'      => [
			'livewire' => [
				'name' => 'fieldset',
			],
			'react'    => [
				'name' => 'Fieldset',
			],
			'vue'      => [
				'name' => 'Fieldset',
			],
		],
		'props'       => [
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'panel', 'divided', 'plain' ],
				'default'     => 'panel',
				'description' => 'A bordered panel, a section with an edge under it, or no chrome. Emitted as data-variant.',
			],
			[
				'name'        => 'title',
				'type'        => 'node',
				'description' => 'The group\'s name, in the legend. Announced with each field inside.',
			],
			[
				'name'        => 'description',
				'type'        => 'node',
				'description' => 'Supporting text in the legend, under the title.',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables every control inside (native fieldset disabled). Emitted as data-disabled.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { legend: \'…\', title: \'…\' }.',
			],
		],
		'variants'    => [ 'panel', 'divided', 'plain' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'fieldset',
				'description' => 'The native fieldset; the default slot holds the fields.',
			],
			[
				'name'        => 'legend',
				'element'     => 'legend',
				'description' => 'The native legend, holding the title and description.',
			],
			[
				'name'        => 'title',
				'element'     => 'span',
				'description' => 'The group\'s name.',
			],
			[
				'name'        => 'description',
				'element'     => 'span',
				'description' => 'Supporting text.',
			],
		],
		'slots'       => [
			[
				'name'        => 'title',
				'description' => 'Rich title content.',
			],
			[
				'name'        => 'description',
				'description' => 'Rich supporting text.',
			],
		],
		'a11y'        => [
			'role'         => 'group',
			'requirements' => [ 'A native fieldset and legend, so the group\'s name is announced with each field inside.', 'Disabled uses the native disabled attribute, which disables every control inside.', 'Don\'t nest fieldsets more than one level.', 'Fields side by side go in a row: <div data-scope="fieldset" data-part="row">, a grid that wraps on narrow screens.' ],
			'wcag'         => [ '1.3.1', '2.4.6', '3.3.2' ],
		],
		'tokens'      => [ '--apui-panel-padding', '--apui-field-gap', '--apui-radius-lg', '--apui-border-muted', '--apui-surface-default', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled' ],
		'fixture'     => [
			'content' => 'Full name, email and phone fields go here.',
			'props'   => [
				'title' => 'Contact',
			],
			'parts'   => [
				'description' => 'Who buyers and renters should reach.',
			],
			'states'  => [ 'disabled' ],
		],
	],
	'File'              => [
		'name'        => 'File',
		'description' => 'Uploads files by dropping or browsing: a native file input over a drop zone, and a list of the chosen files with their size, progress, errors and a remove button. Livewire uploads through wire:model on the native input.',
		'status'      => 'draft',
		'issue'       => 53,
		'rootClass'   => 'apui-file',
		'stacks'      => [
			'livewire' => [
				'name'        => 'file',
				'differences' => [ 'The list reads the wire:model property\'s uploads (or value), and its remove buttons call $removeUpload for temporary uploads. Upload progress comes from Livewire\'s upload events.' ],
			],
			'react'    => [
				'name'        => 'File',
				'differences' => [ 'The list shows the chosen files unless value is given.' ],
			],
			'vue'      => [
				'name'        => 'File',
				'differences' => [ 'Exported as File (FileUpload stays as a deprecated alias). The list shows the chosen files unless v-model is bound.' ],
			],
		],
		'props'       => [
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The visible label above the drop zone, for the native input.',
			],
			[
				'name'        => 'title',
				'type'        => 'string',
				'default'     => 'Drop files here or browse',
				'description' => 'The drop zone\'s main line. Translated by default.',
			],
			[
				'name'        => 'hint',
				'type'        => 'node',
				'description' => 'Limits under the title (types, size, count), linked with aria-describedby.',
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
				'a11y'        => 'Sets aria-invalid on the native input.',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables the input and the drop zone.',
			],
			[
				'name'        => 'required',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Marks the field required and shows the required mark.',
				'a11y'        => 'Sets required on the native input.',
			],
			[
				'name'        => 'accept',
				'type'        => 'string',
				'description' => 'The accepted types, as the native accept attribute.',
			],
			[
				'name'        => 'multiple',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Allows choosing several files.',
			],
			[
				'name'        => 'maxSize',
				'type'        => 'number',
				'description' => 'The largest file in bytes, for scripts and the hint to read. Emitted as data-max-size; validate sizes on the server (or in value-change) and pass errors back through value entries.',
			],
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'dropzone', 'compact' ],
				'default'     => 'dropzone',
				'description' => 'A large centered drop zone, or a compact row. Emitted as data-variant.',
			],
			[
				'name'        => 'value',
				'type'        => 'array',
				'description' => 'The files to list: File objects, Livewire uploads, or { name, size, progress, error } entries. Without it React and Vue list the files the user chose.',
			],
			[
				'name'        => 'removeLabel',
				'type'        => 'string',
				'default'     => 'Remove :name',
				'description' => 'Each remove button\'s accessible name, with a :name placeholder. Translated by default.',
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
				'description' => 'Extra classes per part, such as { dropzone: \'…\', item: \'…\' }.',
			],
		],
		'variants'    => [ 'dropzone', 'compact' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The field: label, drop zone, file list and error.',
			],
			[
				'name'        => 'label',
				'element'     => 'label',
				'description' => 'The visible label, for the native input.',
			],
			[
				'name'        => 'required',
				'element'     => 'span',
				'description' => 'The required mark inside the label. Hidden from screen readers; the input is required.',
			],
			[
				'name'        => 'dropzone',
				'element'     => 'div',
				'description' => 'The dashed area. data-state="drag" while files are dragged over it.',
			],
			[
				'name'        => 'control',
				'element'     => 'input',
				'description' => 'The native input type=file, transparent over the drop zone, so a click browses and a drop chooses. Attributes other than class land here.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'The upload icon tile.',
			],
			[
				'name'        => 'title',
				'element'     => 'p',
				'description' => 'The drop zone\'s main line.',
			],
			[
				'name'        => 'hint',
				'element'     => 'p',
				'description' => 'The limits.',
			],
			[
				'name'        => 'list',
				'element'     => 'ul',
				'description' => 'The chosen or uploaded files.',
			],
			[
				'name'        => 'item',
				'element'     => 'li',
				'description' => 'One file. data-state="error" when it failed or is too large.',
			],
			[
				'name'        => 'thumb',
				'element'     => 'span',
				'description' => 'The file icon.',
			],
			[
				'name'        => 'name',
				'element'     => 'span',
				'description' => 'The file name, truncated with an ellipsis.',
			],
			[
				'name'        => 'meta',
				'element'     => 'span',
				'description' => 'The size, or the file\'s error.',
			],
			[
				'name'        => 'progress',
				'element'     => 'progress',
				'description' => 'The native progress bar while a file uploads.',
			],
			[
				'name'        => 'actions',
				'element'     => 'span',
				'description' => 'The remove button, labelled with the file name.',
			],
			[
				'name'        => 'error',
				'element'     => 'p',
				'description' => 'Validation message, with an icon.',
			],
		],
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'The chosen files changed: chosen, dropped or removed. Livewire uploads them through wire:model.',
				'payload'     => 'File[]',
			],
			[
				'name'        => 'remove',
				'description' => 'A file\'s remove button was pressed, with the file or entry. Livewire removes its temporary uploads itself and dispatches remove for other entries, with { index, name }.',
				'payload'     => 'File | { index, name }',
			],
		],
		'a11y'        => [
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves to the file input, then each remove button.',
				],
				[
					'keys'   => 'Enter, Space',
					'action' => 'Opens the file dialog, or removes a file.',
				],
			],
			'requirements' => [ 'The native input type=file stays in the DOM, transparent over the drop zone, so it is keyboard and screen-reader operable; drag and drop is an enhancement the platform supplies.', 'The label, title and hint name and describe the input; error is linked with aria-describedby.', 'Each remove button is labelled with its file\'s name.', 'Progress is a native progress element; a file\'s error shows in its meta text, not by color alone.', 'Visible focus ring on the drop zone while the input has :focus-visible.', 'State the limits (types, size, count) before upload, and never reject a whole batch for one bad file.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.7', '2.5.8', '3.3.1', '3.3.2', '4.1.2' ],
		],
		'tokens'      => [ '--apui-radius-lg', '--apui-radius-md', '--apui-radius-sm', '--apui-selected-bg', '--apui-selected-border', '--apui-border-default', '--apui-border-strong', '--apui-border-muted', '--apui-color-primary', '--apui-color-primary-soft', '--apui-color-primary-soft-foreground', '--apui-color-error-border', '--apui-color-error-text', '--apui-surface-default', '--apui-surface-sunken', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-progress-height', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'label'    => 'Listing photos',
				'multiple' => true,
				'value'    => [
					[
						'name' => 'lakeview-lofts-exterior.jpg',
						'size' => 2400000,
					],
					[
						'name'     => 'courtyard-garden.jpg',
						'size'     => 1250000,
						'progress' => 64,
					],
					[
						'name'  => 'floor-plan.heic',
						'size'  => 830000,
						'error' => 'HEIC isn\'t supported. Use JPG or PNG.',
					],
				],
			],
			'parts'  => [
				'required' => true,
				'hint'     => 'JPG or PNG, up to 20 MB each.',
				'error'    => 'Add at least one photo.',
			],
			'states' => [ 'hover', 'focus-visible', 'disabled', 'invalid' ],
		],
	],
	'Form'              => [
		'name'        => 'Form',
		'description' => 'A native form that lays out its fields with the field gap and ends with an actions row. Livewire submits it with wire:submit; React and Vue with the native submit event.',
		'status'      => 'draft',
		'issue'       => 53,
		'rootClass'   => 'apui-form',
		'stacks'      => [
			'livewire' => [
				'name' => 'form',
			],
			'react'    => [
				'name' => 'Form',
			],
			'vue'      => [
				'name' => 'Form',
			],
		],
		'props'       => [
			[
				'name'        => 'actions',
				'type'        => 'node',
				'description' => 'The buttons at the end of the form, such as Cancel and Save, aligned to the end.',
			],
			[
				'name'        => 'divided',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Separates the actions row with an edge above it. Emitted as data-divided.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { actions: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'form',
				'description' => 'The native form; the default slot holds the fields. Attributes (wire:submit, action, method, novalidate) land here.',
			],
			[
				'name'        => 'actions',
				'element'     => 'div',
				'description' => 'The button row at the end.',
			],
		],
		'slots'       => [
			[
				'name'        => 'actions',
				'description' => 'The buttons at the end of the form.',
			],
		],
		'a11y'        => [
			'requirements' => [ 'A native form, so Enter in a field submits it and the browser\'s validation runs unless novalidate is set.', 'Name the form (aria-label or aria-labelledby) when a page has more than one; a named form is a landmark.', 'The primary action comes last in the actions row and is a submit button.', 'Put a ValidationSummary at the top after a failed submit, and keep each field\'s own error.' ],
			'wcag'         => [ '1.3.1', '3.3.1', '3.3.2', '3.3.4' ],
		],
		'tokens'      => [ '--apui-field-gap', '--apui-panel-gap', '--apui-border-muted' ],
		'fixture'     => [
			'content' => 'Fields go here.',
			'props'   => [],
			'parts'   => [
				'actions' => 'Save listing',
			],
			'states'  => [],
		],
	],
	'Input'             => [
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
	'Link'              => [
		'name'        => 'Link',
		'description' => 'Navigates somewhere. Inline links are always underlined; standalone links drop the underline until hover. Without href it renders a button styled as a link, for an action that reads as one.',
		'status'      => 'draft',
		'issue'       => 56,
		'rootClass'   => 'apui-link',
		'stacks'      => [
			'livewire' => [
				'name'         => 'link',
				'capabilities' => [ 'navigate adds wire:navigate, so Livewire fetches the page without a full reload' ],
			],
			'react'    => [
				'name' => 'Link',
			],
			'vue'      => [
				'name' => 'Link',
			],
		],
		'props'       => [
			[
				'name'        => 'href',
				'type'        => 'string',
				'description' => 'The destination. Only relative, http, https, mailto, tel and sms URLs are used. Without one, Link renders a button (type="button") with the same styles.',
				'a11y'        => 'A link navigates; an action without a destination is a button, so screen readers announce what it does.',
			],
			[
				'name'        => 'tone',
				'type'        => 'enum',
				'values'      => [ 'primary', 'muted' ],
				'default'     => 'primary',
				'description' => 'primary for links in running text and calls to action, muted for secondary links such as footers and legal text. Emitted as data-tone.',
			],
			[
				'name'        => 'standalone',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'A link on its own line ("View all properties"): medium weight, underlined only on hover, with room for icons. Emitted as data-standalone.',
				'a11y'        => 'Only for links that don\'t sit in running text: inline links keep the underline so color isn\'t the only cue.',
			],
			[
				'name'        => 'external',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Opens in a new tab (target="_blank" with rel="noopener noreferrer") and adds the external-link icon and visually hidden text that says so.',
				'a11y'        => 'Announces that it opens a new tab through externalLabel.',
			],
			[
				'name'        => 'externalLabel',
				'type'        => 'string',
				'default'     => '(opens in a new tab)',
				'description' => 'The visually hidden text an external link announces. Translate it: Livewire defaults it through __( \'(opens in a new tab)\' ).',
			],
			[
				'name'        => 'leadingIcon',
				'type'        => 'string',
				'description' => 'Icon name before the text, resolved through the icon registry. A slot or node overrides it.',
			],
			[
				'name'        => 'trailingIcon',
				'type'        => 'string',
				'description' => 'Icon name after the text, such as arrow-right on a standalone link; it replaces the external-link icon. Arrows and chevrons mirror in RTL. A slot or node overrides it.',
			],
			[
				'name'        => 'navigate',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Adds wire:navigate to an internal link, so Livewire fetches the page and swaps it in without a full reload. Off-site, `#`, `mailto:` and new-tab links load normally.',
				'stacks'      => [ 'livewire' ],
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { icon: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'a | button',
				'description' => 'The link, or a button when there\'s no href.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'The leading icon.',
			],
			[
				'name'        => 'iconEnd',
				'element'     => 'span',
				'description' => 'The trailing icon, or the external-link icon.',
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
			'keyboard'     => [
				[
					'keys'   => 'Enter',
					'action' => 'Follows the link, or activates the button form.',
				],
			],
			'requirements' => [ 'Uses a native anchor, or a native button when there\'s no href.', 'Inline links are underlined, so color isn\'t the only cue (1.4.1); standalone links are set apart by position and weight.', 'External links say they open a new tab, in visually hidden text (externalLabel).', 'The link text says where it goes: never "click here".', 'Icons are decorative (aria-hidden); an icon-only link needs an aria-label.', 'Visible focus ring on :focus-visible.' ],
			'wcag'         => [ '1.4.1', '1.4.3', '2.1.1', '2.4.4', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-color-primary-text', '--apui-color-primary-border', '--apui-text-muted', '--apui-text-default', '--apui-border-default', '--apui-radius-xs', '--apui-font-weight-medium', '--apui-focus-ring-color', '--apui-focus-ring-offset-color' ],
		'fixture'     => [
			'content' => 'View all properties',
			'props'   => [
				'href'     => '#',
				'external' => true,
			],
			'parts'   => [
				'leadingIcon'  => 'download',
				'trailingIcon' => 'arrow-right',
			],
		],
	],
	'Menu'              => [
		'name'        => 'Menu',
		'description' => 'A navigation list in a nav landmark: links with icons and badges, section titles, separators and collapsible sub-menus, with the current page marked. Not for actions; use DropdownMenu.',
		'status'      => 'draft',
		'issue'       => 56,
		'rootClass'   => 'apui-menu',
		'stacks'      => [
			'livewire' => [
				'name'         => 'menu',
				'capabilities' => [ 'Children: menu-item, menu-sub, menu-title and menu-separator; items renders the same children', 'menu-item takes route and activates by the current URL (activate-by-route on the menu or the item)' ],
			],
			'react'    => [
				'name'         => 'Menu',
				'capabilities' => [ 'Children: MenuItem, MenuSub, MenuTitle and MenuSeparator; items renders the same children' ],
			],
			'vue'      => [
				'name'         => 'Menu',
				'capabilities' => [ 'Children: MenuItem, MenuSub, MenuTitle and MenuSeparator; items renders the same children' ],
			],
		],
		'props'       => [
			[
				'name'        => 'items',
				'type'        => 'array',
				'description' => 'The menu as data, rendering the same children as composition: { label, href, icon, badge, current, disabled }, { label, icon, open, items: [...] } for a sub-menu, { type: \'title\', label } and { type: \'separator\' }.',
			],
			[
				'name'        => 'collapsible',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Sub-menus open and close from their item, a button with aria-expanded. Off shows every sub-menu, with its item as a plain heading. Emitted as data-collapsible.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'description' => 'Names the nav landmark, such as Main or Settings.',
				'a11y'        => 'Name every Menu when a page has more than one nav landmark.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { item: \'…\', sub: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'nav',
				'description' => 'The nav landmark, carrying the root class.',
			],
			[
				'name'        => 'list',
				'element'     => 'ul',
				'description' => 'The top-level list.',
			],
			[
				'name'        => 'item',
				'element'     => 'a | button | span',
				'description' => 'A link (aria-current=page when it\'s the current page), a sub-menu\'s toggle button, or a sub-menu\'s heading when collapsible is off.',
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
				'name'        => 'badge',
				'element'     => 'span',
				'description' => 'An item\'s count or status, at the end of the item.',
			],
			[
				'name'        => 'chevron',
				'element'     => 'span',
				'description' => 'A sub-menu toggle\'s chevron. It points to the inline end and turns down while open; it mirrors in RTL.',
			],
			[
				'name'        => 'sub',
				'element'     => 'ul',
				'description' => 'A sub-menu\'s list, hidden while it\'s closed.',
			],
			[
				'name'        => 'title',
				'element'     => 'li',
				'description' => 'A section title between items.',
			],
			[
				'name'        => 'separator',
				'element'     => 'li',
				'description' => 'A rule between items, hidden from assistive technology.',
			],
		],
		'a11y'        => [
			'element'      => 'nav',
			'keyboard'     => [
				[
					'keys'   => 'Tab, Shift+Tab',
					'action' => 'Move through the links and sub-menu toggles in order. Items in a closed sub-menu are skipped.',
				],
				[
					'keys'   => 'Enter',
					'action' => 'Follows a link; opens or closes a sub-menu.',
				],
				[
					'keys'   => 'Space',
					'action' => 'Opens or closes a sub-menu.',
				],
			],
			'requirements' => [ 'A nav landmark, named with label when the page has more than one.', 'The current page\'s item sets aria-current=page; it is shown by surface and color, not color alone.', 'A sub-menu\'s item is a button with aria-expanded and aria-controls pointing at its list (the disclosure pattern); it is not an ARIA menu, so the arrow keys aren\'t used.', 'A sub-menu holding the current page renders open.', 'Disabled links set aria-disabled, lose their href and leave the Tab order.', 'Titles and badges are text, so screen readers read them in order; separators are aria-hidden.', 'The chevron mirrors in RTL and is aria-hidden; the button\'s expanded state carries the meaning.', 'Keep nesting to two levels.', 'Every toggle and sub-menu keeps a stable, server-rendered id in Livewire (D-015).' ],
			'wcag'         => [ '1.3.1', '1.4.1', '1.4.3', '1.4.11', '2.1.1', '2.4.3', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-control-height-sm', '--apui-control-height-md', '--apui-radius-full', '--apui-state-hover', '--apui-selected-bg', '--apui-border-muted', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-color-primary-soft-foreground', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'label' => 'Main',
				'items' => [
					[
						'label' => 'Dashboard',
						'href'  => '#dashboard',
						'icon'  => 'list',
					],
					[
						'label' => 'Properties',
						'icon'  => 'settings',
						'open'  => true,
						'items' => [
							[
								'label' => 'All properties',
								'href'  => '#properties',
							],
							[
								'label'   => 'Lakeview Lofts',
								'href'    => '#lakeview',
								'current' => true,
							],
							[
								'label' => 'Drafts',
								'href'  => '#drafts',
								'badge' => '3',
							],
						],
					],
					[
						'label' => 'Analytics',
						'icon'  => 'calendar',
						'items' => [
							[
								'label' => 'Reports',
								'href'  => '#reports',
							],
						],
					],
					[
						'label' => 'Inbox',
						'href'  => '#inbox',
						'icon'  => 'mail',
						'badge' => '12',
					],
					[
						'type'  => 'title',
						'label' => 'Settings',
					],
					[
						'label' => 'Team',
						'href'  => '#team',
						'icon'  => 'user',
					],
					[
						'type' => 'separator',
					],
					[
						'label'    => 'Billing',
						'href'     => '#billing',
						'disabled' => true,
					],
				],
			],
			'states' => [],
		],
	],
	'Navbar'            => [
		'name'        => 'Navbar',
		'description' => 'The top bar: a brand, primary links or a search, and account actions, as a full-width bar or an island. Glass is a surface. Replaces Livewire\'s nav.',
		'status'      => 'draft',
		'issue'       => 56,
		'rootClass'   => 'apui-navbar',
		'stacks'      => [
			'livewire' => [
				'name'         => 'navbar',
				'capabilities' => [ 'Children: navbar-item links in the default slot; links renders the same children', 'Slots: brand, search and actions' ],
			],
			'react'    => [
				'name'         => 'Navbar',
				'capabilities' => [ 'Children: NavbarItem links; links renders the same children' ],
			],
			'vue'      => [
				'name'         => 'Navbar',
				'capabilities' => [ 'Children: NavbarItem links in the default slot; links renders the same children', 'Slots: brand, search and actions' ],
			],
		],
		'props'       => [
			[
				'name'        => 'layout',
				'type'        => 'enum',
				'values'      => [ 'bar', 'island' ],
				'default'     => 'bar',
				'description' => 'A full-width bar with an edge below it (marketing pages), or a rounded island (inside AppShell). Emitted as data-layout.',
			],
			[
				'name'        => 'surface',
				'type'        => 'enum',
				'values'      => [ 'default', 'glass' ],
				'default'     => 'default',
				'description' => 'The surface. Emitted as data-surface. Glass falls back to the raised surface under reduced transparency and without backdrop-filter, and is opaque in high contrast.',
			],
			[
				'name'        => 'sticky',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Sticks to the top of the scrolling container. Emitted as data-sticky.',
			],
			[
				'name'        => 'brand',
				'type'        => 'node',
				'description' => 'The brand at the start: a logo or mark and the product name, usually a link home.',
			],
			[
				'name'        => 'links',
				'type'        => 'array',
				'description' => 'The primary links as data, rendering the same children as composition: { label, href, current }.',
			],
			[
				'name'        => 'search',
				'type'        => 'node',
				'description' => 'A search field between the links and the actions; it takes the free space.',
			],
			[
				'name'        => 'actions',
				'type'        => 'node',
				'description' => 'Controls at the end: sign in, notifications, the account menu.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'default'     => 'Main',
				'description' => 'Names the links\' nav landmark. Livewire translates the default with __().',
				'a11y'        => 'Change it when the page has another nav named Main.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { links: \'…\', actions: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'header',
				'description' => 'The bar, carrying the root class. A header landmark (banner) when it\'s the page\'s top bar.',
			],
			[
				'name'        => 'brand',
				'element'     => 'div',
				'description' => 'The brand at the start.',
			],
			[
				'name'        => 'links',
				'element'     => 'nav',
				'description' => 'The nav landmark holding the links. Scrolls along the inline axis when the bar is too narrow for them.',
			],
			[
				'name'        => 'link',
				'element'     => 'a',
				'description' => 'A primary link, aria-current=page on the current one.',
			],
			[
				'name'        => 'search',
				'element'     => 'div',
				'description' => 'Holds the search field and takes the free space.',
			],
			[
				'name'        => 'actions',
				'element'     => 'div',
				'description' => 'The controls at the end.',
			],
		],
		'slots'       => [
			[
				'name'        => 'brand',
				'description' => 'The brand at the start.',
			],
			[
				'name'        => 'search',
				'description' => 'A search field.',
			],
			[
				'name'        => 'actions',
				'description' => 'Controls at the end.',
			],
		],
		'a11y'        => [
			'element'      => 'header',
			'keyboard'     => [
				[
					'keys'   => 'Tab, Shift+Tab',
					'action' => 'Move through the brand link, the links, the search and the actions in order.',
				],
			],
			'requirements' => [ 'A header element; the links sit in a nav landmark named with label.', 'The current page\'s link sets aria-current=page and is shown by surface, not color alone.', 'An icon-only action is named with aria-label, and a notification indicator is in that name too (Notifications, 3 unread).', 'Keep to about six links; on a narrow bar they scroll rather than wrap or hide, so every link stays reachable.', 'Glass keeps text at 4.5:1 over any backdrop, falls back to an opaque surface under reduced transparency and in high contrast.', 'Links show the focus ring on :focus-visible.' ],
			'wcag'         => [ '1.3.1', '1.4.1', '1.4.3', '1.4.10', '1.4.11', '2.4.1', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-navbar-height', '--apui-radius-lg', '--apui-radius-full', '--apui-surface-default', '--apui-surface-sunken', '--apui-surface-raised', '--apui-surface-glass', '--apui-surface-glass-border', '--apui-surface-glass-blur', '--apui-surface-glass-saturation', '--apui-elevation-glass', '--apui-z-sticky', '--apui-border-muted', '--apui-state-hover', '--apui-control-height-sm', '--apui-text-default', '--apui-text-muted', '--apui-text-muted-glass', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'brand'  => 'Horizon',
				'links'  => [
					[
						'label'   => 'Properties',
						'href'    => '#properties',
						'current' => true,
					],
					[
						'label' => 'Analytics',
						'href'  => '#analytics',
					],
					[
						'label' => 'Tools',
						'href'  => '#tools',
					],
				],
				'sticky' => false,
			],
			'parts'  => [
				'search'  => 'Search',
				'actions' => 'Sign in',
			],
			'states' => [],
		],
	],
	'Pagination'        => [
		'name'        => 'Pagination',
		'description' => 'Moves between the pages of a long list: previous and next, the first and last pages, the pages around the current one, and an optional summary.',
		'status'      => 'draft',
		'issue'       => 56,
		'rootClass'   => 'apui-pagination',
		'stacks'      => [
			'livewire' => [
				'name'         => 'pagination',
				'capabilities' => [ 'rows takes a Laravel paginator: pages become links to its URLs, and inside a Livewire component with WithPagination they call gotoPage() instead of reloading', 'A simple or cursor paginator renders previous and next only' ],
			],
			'react'    => [
				'name' => 'Pagination',
			],
			'vue'      => [
				'name'         => 'Pagination',
				'capabilities' => [ 'v-model:page binds the page (update:page) alongside page-change' ],
			],
		],
		'props'       => [
			[
				'name'        => 'page',
				'type'        => 'number',
				'default'     => 1,
				'description' => 'The current page, from 1. Clamped to the page count.',
			],
			[
				'name'        => 'pageCount',
				'type'        => 'number',
				'description' => 'How many pages there are. Without it, Pagination works it out from total and perPage.',
			],
			[
				'name'        => 'total',
				'type'        => 'number',
				'description' => 'How many items the whole list has. With perPage it gives the page count and the summary\'s range.',
			],
			[
				'name'        => 'perPage',
				'type'        => 'number',
				'default'     => 10,
				'description' => 'How many items a page holds.',
			],
			[
				'name'        => 'siblings',
				'type'        => 'number',
				'default'     => 1,
				'description' => 'How many pages show on each side of the current one. The first and last pages always show, and gaps collapse into an ellipsis, so the control keeps one width as the page changes.',
			],
			[
				'name'        => 'summary',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Shows the summary before the pages: "Showing 21–30 of 318", or "Page 3 of 32" without a total.',
			],
			[
				'name'        => 'rows',
				'type'        => 'object',
				'description' => 'A Laravel paginator (LengthAwarePaginator, Paginator or CursorPaginator). It supplies page, total, perPage and each page\'s URL; a simple or cursor paginator renders previous and next only.',
				'stacks'      => [ 'livewire' ],
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'default'     => 'Pagination',
				'description' => 'The navigation landmark\'s accessible name. Translate it: Livewire defaults it through __( \'Pagination\' ).',
				'a11y'        => 'Names the nav landmark; give two paginations on one page different labels.',
			],
			[
				'name'        => 'previousLabel',
				'type'        => 'string',
				'default'     => 'Previous page',
				'description' => 'The previous button\'s accessible name. Translate it: Livewire defaults it through __( \'Previous page\' ).',
				'a11y'        => 'The previous button is icon-only, so this is its only name.',
			],
			[
				'name'        => 'nextLabel',
				'type'        => 'string',
				'default'     => 'Next page',
				'description' => 'The next button\'s accessible name. Translate it: Livewire defaults it through __( \'Next page\' ).',
				'a11y'        => 'The next button is icon-only, so this is its only name.',
			],
			[
				'name'        => 'pageLabel',
				'type'        => 'string',
				'default'     => 'Page {page}',
				'description' => 'Each page\'s accessible name; {page} is its number. Translate it: Livewire defaults it through __( \'Page {page}\' ).',
			],
			[
				'name'        => 'summaryLabel',
				'type'        => 'string',
				'default'     => 'Showing {from}–{to} of {total}',
				'description' => 'The summary\'s text, with {from}, {to}, {total}, {page} and {pageCount}. Without a total the default is "Page {page} of {pageCount}". Translate it: Livewire defaults both through __().',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { page: \'…\', summary: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'nav',
				'description' => 'The navigation landmark.',
			],
			[
				'name'        => 'summary',
				'element'     => 'span',
				'description' => 'Which items or page are showing, when summary is set.',
			],
			[
				'name'        => 'previous',
				'element'     => 'button | a',
				'description' => 'Goes to the previous page. Icon-only, named by previousLabel; aria-disabled on the first page. Its chevron mirrors in RTL.',
			],
			[
				'name'        => 'page',
				'element'     => 'button | a',
				'description' => 'Goes to a page. The current page has aria-current="page".',
			],
			[
				'name'        => 'ellipsis',
				'element'     => 'span',
				'description' => 'Stands in for the pages between two shown ones. Hidden from assistive technology.',
			],
			[
				'name'        => 'next',
				'element'     => 'button | a',
				'description' => 'Goes to the next page. Icon-only, named by nextLabel; aria-disabled on the last page. Its chevron mirrors in RTL.',
			],
		],
		'events'      => [
			[
				'name'        => 'page-change',
				'description' => 'A page, previous or next was chosen. Setting page doesn\'t fire it. Livewire dispatches it as a browser event (x-on:page-change, wire:page-change) with { page } in $event.detail.',
				'payload'     => 'number',
			],
		],
		'a11y'        => [
			'role'         => 'navigation',
			'element'      => 'nav',
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves through previous, the pages and next.',
				],
				[
					'keys'   => 'Enter / Space',
					'action' => 'Goes to the focused page (Enter only on links).',
				],
			],
			'requirements' => [ 'A nav landmark named by label ("Pagination").', 'The current page has aria-current="page".', 'Previous and next are icon-only with translatable names; on the first or last page they stay focusable with aria-disabled="true" and do nothing.', 'Each page is named "Page n" (pageLabel); ellipses are aria-hidden.', 'Previous and next chevrons mirror in RTL, and the order follows the text direction.', 'Items are at least --apui-control-height-sm (28px) square, above the 24px target minimum.', 'Visible focus ring on :focus-visible.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.7', '2.5.8', '4.1.2' ],
		],
		'tokens'      => [ '--apui-control-height-sm', '--apui-radius-full', '--apui-selected-bg', '--apui-selected-border', '--apui-color-primary-soft-foreground', '--apui-state-hover', '--apui-state-pressed', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-type-body-sm-font-size', '--apui-type-body-sm-line-height', '--apui-font-weight-medium', '--apui-focus-ring-color', '--apui-focus-ring-offset-color' ],
		'fixture'     => [
			'props'  => [
				'page'    => 3,
				'total'   => 318,
				'perPage' => 10,
				'summary' => true,
			],
			'states' => [],
		],
	],
	'Password'          => [
		'name'        => 'Password',
		'description' => 'Password entry in Input\'s field anatomy, with a reveal toggle, an optional strength meter and live requirements.',
		'status'      => 'draft',
		'issue'       => 53,
		'rootClass'   => 'apui-password',
		'stacks'      => [
			'livewire' => [
				'name' => 'password',
			],
			'react'    => [
				'name' => 'Password',
			],
			'vue'      => [
				'name' => 'Password',
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
				'name'        => 'autocomplete',
				'type'        => 'enum',
				'values'      => [ 'current-password', 'new-password' ],
				'default'     => 'current-password',
				'description' => 'The control\'s autocomplete hint. Use new-password on sign-up and reset forms so password managers offer to generate one.',
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The visible label, linked to the control.',
			],
			[
				'name'        => 'hint',
				'type'        => 'node',
				'description' => 'Help text under the box, linked with aria-describedby.',
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
				'description' => 'Disables the control and the reveal button.',
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
				'description' => 'The initial value of an uncontrolled password.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'leadingIcon',
				'type'        => 'string',
				'description' => 'Icon name before the value, such as lock, resolved through the icon registry. A slot or node overrides it.',
			],
			[
				'name'        => 'strengthMeter',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Shows the four-segment strength meter and its label (Weak, Fair, Good, Strong) under the box.',
			],
			[
				'name'        => 'requirements',
				'type'        => 'array',
				'description' => 'Rules shown under the box and checked as people type: [{ label, pattern }], where pattern is a regular expression source the value must match, such as .{12,} or \\d.',
			],
			[
				'name'        => 'revealLabel',
				'type'        => 'string',
				'default'     => 'Show password',
				'description' => 'The reveal button\'s accessible name. It stays the same; aria-pressed carries the state. Livewire translates the default.',
			],
			[
				'name'        => 'labels',
				'type'        => 'object',
				'default'     => [
					'strength' => 'Strength',
					'weak'     => 'Weak',
					'fair'     => 'Fair',
					'good'     => 'Good',
					'strong'   => 'Strong',
					'met'      => 'Met',
					'unmet'    => 'Not met',
				],
				'description' => 'Built-in text for the strength meter and the requirement states. Keys you leave out keep their defaults; Livewire translates them.',
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
				'description' => 'Extra classes per part, such as { box: \'…\', reveal: \'…\' }.',
			],
		],
		'sizes'       => [ 'sm', 'md', 'lg' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The field: label, box, meter, requirements, hint and error.',
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
				'description' => 'The bordered box around the icon, the control and the reveal button.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'Leading icon.',
			],
			[
				'name'        => 'control',
				'element'     => 'input',
				'description' => 'The native input, type password or text while revealed. Attributes other than class land here.',
			],
			[
				'name'        => 'reveal',
				'element'     => 'button',
				'description' => 'The icon-only toggle that shows and hides the value, with aria-pressed.',
			],
			[
				'name'        => 'strength',
				'element'     => 'div',
				'description' => 'The decorative four-segment meter (aria-hidden). Emits data-level 0 to 4.',
			],
			[
				'name'        => 'segment',
				'element'     => 'span',
				'description' => 'One meter segment.',
			],
			[
				'name'        => 'strengthLabel',
				'element'     => 'div',
				'description' => 'Strength and the level name, which a polite live region announces.',
			],
			[
				'name'        => 'requirements',
				'element'     => 'ul',
				'description' => 'The requirement list.',
			],
			[
				'name'        => 'requirement',
				'element'     => 'li',
				'description' => 'One requirement, with a check or cross and its state for screen readers. Emits data-met.',
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
				'description' => 'The value changed.',
				'payload'     => 'string',
			],
		],
		'a11y'        => [
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves focus to the control, then to the reveal button.',
				],
				[
					'keys'   => 'Enter / Space',
					'action' => 'On the reveal button: shows or hides the value.',
				],
			],
			'requirements' => [ 'The label is always visible and linked with for/id; a placeholder never replaces it.', 'The reveal button keeps one name (Show password) and toggles aria-pressed, so the state is announced without a changing label.', 'The meter is aria-hidden; the level name (Weak, Fair, Good, Strong) is text in a polite live region, never color alone.', 'Each requirement says whether it is met in text for screen readers, not only with the icon.', 'Hint, requirements and error are linked to the control with aria-describedby.', 'Never block paste.', 'Class goes to the root; every other attribute (wire:model, name) goes to the control.', 'Visible focus ring on the box while the control has :focus-visible, and on the reveal button.' ],
			'wcag'         => [ '1.3.1', '1.4.1', '1.4.3', '1.4.11', '2.1.1', '2.4.7', '3.3.1', '3.3.2', '4.1.2', '4.1.3' ],
		],
		'tokens'      => [ '--apui-input-radius', '--apui-control-height-sm', '--apui-control-height-md', '--apui-control-height-lg', '--apui-border-default', '--apui-border-strong', '--apui-border-muted', '--apui-color-error', '--apui-color-warning', '--apui-color-success', '--apui-color-success-text', '--apui-color-error-border', '--apui-color-error-text', '--apui-surface-default', '--apui-surface-sunken', '--apui-state-hover', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'label'       => 'Password',
				'leadingIcon' => 'lock',
			],
			'parts'  => [
				'required'      => true,
				'hint'          => 'Use a password you don\'t use elsewhere.',
				'error'         => 'Passwords don\'t match.',
				'strengthMeter' => true,
				'requirements'  => [
					[
						'label'   => 'At least 12 characters',
						'pattern' => '.{12,}',
					],
					[
						'label'   => 'One number',
						'pattern' => '\\d',
					],
				],
			],
			'states' => [ 'hover', 'focus-visible', 'disabled', 'invalid', 'readonly' ],
		],
	],
	'Pin'               => [
		'name'        => 'Pin',
		'description' => 'A row of single-character cells for one-time codes. One real input with autocomplete=one-time-code drives the cells, so SMS autofill and paste fill every cell at once.',
		'status'      => 'draft',
		'issue'       => 53,
		'rootClass'   => 'apui-pin',
		'stacks'      => [
			'livewire' => [
				'name' => 'pin',
			],
			'react'    => [
				'name' => 'Pin',
			],
			'vue'      => [
				'name' => 'Pin',
			],
		],
		'props'       => [
			[
				'name'        => 'length',
				'type'        => 'number',
				'default'     => 6,
				'description' => 'The number of cells. Sets maxlength on the control.',
			],
			[
				'name'        => 'type',
				'type'        => 'enum',
				'values'      => [ 'numeric', 'alphanumeric' ],
				'default'     => 'numeric',
				'description' => 'The characters allowed. Numeric sets inputmode=numeric; other characters are dropped as people type or paste.',
			],
			[
				'name'        => 'mask',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Shows a dot for each character and makes the control a password input.',
			],
			[
				'name'        => 'groupSize',
				'type'        => 'number',
				'description' => 'Draws a separator after every groupSize cells, such as 3 for a 3 + 3 code.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md' ],
				'default'     => 'md',
				'description' => 'Cell size. Emitted as data-size.',
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The visible label, linked to the control.',
			],
			[
				'name'        => 'hint',
				'type'        => 'node',
				'description' => 'Help text under the cells, linked with aria-describedby.',
			],
			[
				'name'        => 'error',
				'type'        => 'string',
				'description' => 'Validation message. Marks the code invalid and is linked with aria-describedby.',
			],
			[
				'name'        => 'invalid',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Marks the code invalid without a message. Emitted as data-invalid.',
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
				'description' => 'Marks the code required and shows the required mark.',
				'a11y'        => 'Sets required on the control.',
			],
			[
				'name'        => 'value',
				'type'        => 'string',
				'description' => 'The code. Livewire binds it with wire:model, Vue with v-model.',
			],
			[
				'name'        => 'defaultValue',
				'type'        => 'string',
				'description' => 'The initial code of an uncontrolled pin.',
				'stacks'      => [ 'react' ],
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
				'description' => 'Extra classes per part, such as { cell: \'…\', label: \'…\' }.',
			],
		],
		'sizes'       => [ 'sm', 'md' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The field: label, cells, hint and error.',
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
				'name'        => 'cells',
				'element'     => 'div',
				'description' => 'The row of cells, with the control laid over it.',
			],
			[
				'name'        => 'control',
				'element'     => 'input',
				'description' => 'The one native input, transparent over the cells, with autocomplete=one-time-code. Attributes other than class land here.',
			],
			[
				'name'        => 'cell',
				'element'     => 'span',
				'description' => 'One character cell (aria-hidden). Emits data-filled, and data-active on the cell the next character goes in.',
			],
			[
				'name'        => 'separator',
				'element'     => 'span',
				'description' => 'A dash between groups (aria-hidden).',
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
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'The code changed.',
				'payload'     => 'string',
			],
			[
				'name'        => 'complete',
				'description' => 'Every cell is filled. Use it to submit the code.',
				'payload'     => 'string',
			],
		],
		'a11y'        => [
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves focus to the code; typing fills the next cell.',
				],
				[
					'keys'   => 'Backspace',
					'action' => 'Clears the last character.',
				],
			],
			'requirements' => [ 'One native input holds the whole code, so SMS autofill (autocomplete=one-time-code), paste and screen readers work on it as one field.', 'The cells are aria-hidden mirrors of the input\'s value.', 'The label is linked with for/id; hint and error with aria-describedby.', 'Invalid sets aria-invalid on the control; the error is text, never color alone.', 'Visible focus ring on the active cell while the control has :focus-visible.', 'Never clear the code on error without saying so.' ],
			'wcag'         => [ '1.3.1', '1.3.5', '1.4.3', '1.4.11', '2.1.1', '2.4.7', '3.3.1', '3.3.2', '4.1.2' ],
		],
		'tokens'      => [ '--apui-input-radius', '--apui-border-default', '--apui-border-strong', '--apui-border-muted', '--apui-color-error-border', '--apui-color-error-text', '--apui-surface-default', '--apui-surface-sunken', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'label'     => 'Verification code',
				'groupSize' => 3,
			],
			'parts'  => [
				'required' => true,
				'hint'     => 'We sent it to •••• 4821.',
				'error'    => 'That code has expired. We sent a new one.',
			],
			'states' => [ 'hover', 'focus-visible', 'disabled', 'invalid' ],
		],
	],
	'RadioGroup'        => [
		'name'        => 'RadioGroup',
		'description' => 'Chooses exactly one option from a small set, with native radios in a fieldset. Default, cards and segmented (joined buttons) layouts, vertical or horizontal.',
		'status'      => 'draft',
		'issue'       => 53,
		'rootClass'   => 'apui-radio-group',
		'stacks'      => [
			'livewire' => [
				'name' => 'radio-group',
			],
			'react'    => [
				'name' => 'RadioGroup',
			],
			'vue'      => [
				'name' => 'RadioGroup',
			],
		],
		'props'       => [
			[
				'name'        => 'options',
				'type'        => 'array',
				'description' => 'The options: strings, or { value, label, description, meta, disabled } objects.',
			],
			[
				'name'        => 'value',
				'type'        => 'string',
				'description' => 'The selected value. Livewire binds it with wire:model, Vue with v-model.',
			],
			[
				'name'        => 'defaultValue',
				'type'        => 'string',
				'description' => 'The initial value of an uncontrolled group.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The group label, rendered as the fieldset\'s legend.',
			],
			[
				'name'        => 'hint',
				'type'        => 'node',
				'description' => 'Help text under the options, linked to the group with aria-describedby.',
			],
			[
				'name'        => 'error',
				'type'        => 'string',
				'description' => 'Validation message. Marks the group invalid and is linked with aria-describedby.',
			],
			[
				'name'        => 'invalid',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Marks the group invalid without a message. Emitted as data-invalid.',
				'a11y'        => 'Sets aria-invalid on every radio.',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables every option. An option\'s own disabled disables only that one.',
			],
			[
				'name'        => 'required',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Marks the group required and shows the required mark in the legend.',
				'a11y'        => 'Sets required on the radios.',
			],
			[
				'name'        => 'orientation',
				'type'        => 'enum',
				'values'      => [ 'vertical', 'horizontal' ],
				'default'     => 'vertical',
				'description' => 'Stacks the options or lays them in a row. Emitted as data-orientation.',
			],
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'default', 'cards', 'segmented' ],
				'default'     => 'default',
				'description' => 'Plain radios, bordered cards for options with a description or price, or joined segmented buttons (the old Livewire group). Emitted as data-variant.',
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
				'description' => 'Extra classes per part, such as { item: \'…\', itemText: \'…\' }.',
			],
		],
		'variants'    => [ 'default', 'cards', 'segmented' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'fieldset',
				'description' => 'The group: legend, items, hint and error.',
			],
			[
				'name'        => 'label',
				'element'     => 'legend',
				'description' => 'The group label.',
			],
			[
				'name'        => 'required',
				'element'     => 'span',
				'description' => 'The required mark inside the legend. Hidden from screen readers; the radios are required.',
			],
			[
				'name'        => 'items',
				'element'     => 'div',
				'description' => 'The options, stacked or in a row.',
			],
			[
				'name'        => 'item',
				'element'     => 'label',
				'description' => 'One option. The whole item is the radio\'s label, so a card is clickable anywhere.',
			],
			[
				'name'        => 'box',
				'element'     => 'span',
				'description' => 'The visible circle. The native radio covers it.',
			],
			[
				'name'        => 'control',
				'element'     => 'input',
				'description' => 'The native radio, visually hidden over the box. Attributes other than class land on every radio.',
			],
			[
				'name'        => 'indicator',
				'element'     => 'span',
				'description' => 'The dot shown while checked.',
			],
			[
				'name'        => 'itemText',
				'element'     => 'span',
				'description' => 'The option\'s label text.',
			],
			[
				'name'        => 'itemDescription',
				'element'     => 'span',
				'description' => 'Supporting text under the option\'s label, linked with aria-describedby.',
			],
			[
				'name'        => 'itemMeta',
				'element'     => 'span',
				'description' => 'A price or other figure on a card.',
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
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'The selected value changed. React and Vue pass the option\'s value as given; Livewire gives the string.',
				'payload'     => 'string | number',
			],
		],
		'a11y'        => [
			'element'      => 'fieldset',
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves focus into the group, to the checked radio or the first one.',
				],
				[
					'keys'   => 'ArrowDown, ArrowRight',
					'action' => 'Moves to the next option and checks it (platform behavior), following the text direction.',
				],
				[
					'keys'   => 'ArrowUp, ArrowLeft',
					'action' => 'Moves to the previous option and checks it, following the text direction.',
				],
				[
					'keys'   => 'Space',
					'action' => 'Checks the focused option.',
				],
			],
			'requirements' => [ 'Native input type=radio elements sharing one name, in a fieldset with a legend, so the platform supplies the radio group role, roving focus and arrow keys.', 'Arrow keys follow the text direction under RTL (native behavior); the dot and cards mirror with logical properties.', 'Every radio has a name: the given name, else the control id, so arrow keys move between the options.', 'Hint and error are linked to the fieldset with aria-describedby; invalid sets aria-invalid on each radio.', 'An option\'s description is linked to its radio with aria-describedby.', 'Visible focus ring on the box (or the segment) while its radio has :focus-visible.', 'Disabled uses --apui-surface-sunken and --apui-text-disabled, never opacity alone.', 'Use Select for more than about six options.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.7', '2.5.8', '3.3.1', '3.3.2', '4.1.2' ],
		],
		'tokens'      => [ '--apui-color-primary', '--apui-color-primary-hover', '--apui-color-primary-foreground', '--apui-selected-bg', '--apui-selected-border', '--apui-radius-md', '--apui-button-radius', '--apui-border-default', '--apui-border-strong', '--apui-border-muted', '--apui-color-error-border', '--apui-color-error-text', '--apui-surface-default', '--apui-surface-sunken', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'label'   => 'Plan',
				'value'   => 'growth',
				'options' => [
					[
						'value'       => 'starter',
						'label'       => 'Starter',
						'description' => 'Up to 5 listings',
						'meta'        => '$0 / month',
					],
					[
						'value'       => 'growth',
						'label'       => 'Growth',
						'description' => 'Up to 50 listings',
						'meta'        => '$39 / month',
					],
					[
						'value'    => 'portfolio',
						'label'    => 'Portfolio',
						'disabled' => true,
					],
				],
			],
			'parts'  => [
				'required' => true,
				'hint'     => 'You can change plans at any time.',
				'error'    => 'Choose a plan.',
			],
			'states' => [ 'hover', 'focus-visible', 'disabled', 'invalid' ],
		],
	],
	'Range'             => [
		'name'        => 'Range',
		'description' => 'A slider for one value, or two thumbs for a from–to range. Each thumb is a native input type=range laid over the drawn track, so keyboard, touch and screen readers get the platform slider.',
		'status'      => 'draft',
		'issue'       => 53,
		'rootClass'   => 'apui-range',
		'stacks'      => [
			'livewire' => [
				'name' => 'range',
			],
			'react'    => [
				'name' => 'Range',
			],
			'vue'      => [
				'name' => 'Range',
			],
		],
		'props'       => [
			[
				'name'        => 'min',
				'type'        => 'number',
				'default'     => 0,
				'description' => 'The lowest value.',
			],
			[
				'name'        => 'max',
				'type'        => 'number',
				'default'     => 100,
				'description' => 'The highest value.',
			],
			[
				'name'        => 'step',
				'type'        => 'number',
				'default'     => 1,
				'description' => 'The step between values.',
			],
			[
				'name'        => 'value',
				'type'        => 'number',
				'description' => 'The value: a number, or [from, to] with dual. Livewire binds it with wire:model, Vue with v-model.',
			],
			[
				'name'        => 'defaultValue',
				'type'        => 'number',
				'description' => 'The initial value of an uncontrolled range: a number, or [from, to] with dual.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'dual',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Two thumbs for a from–to range. The value is [from, to] and the thumbs can\'t cross.',
			],
			[
				'name'        => 'showValue',
				'type'        => 'enum',
				'values'      => [ 'never', 'focus', 'always' ],
				'default'     => 'focus',
				'description' => 'When the value bubble above a thumb shows. Emitted as data-show-value.',
			],
			[
				'name'        => 'format',
				'type'        => 'string',
				'description' => 'How a value reads in the bubble, the marks and aria-valuetext: a template where {value} is the number, such as {value} km or ${value}k.',
			],
			[
				'name'        => 'marks',
				'type'        => 'array',
				'description' => 'Labels under the track: [{ value, label }], placed at their values.',
			],
			[
				'name'        => 'color',
				'type'        => 'enum',
				'values'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
				'default'     => 'primary',
				'description' => 'The fill and thumb edge. Emitted as data-color.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md' ],
				'default'     => 'md',
				'description' => 'Thumb size. Emitted as data-size.',
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The visible label, linked to the (first) thumb.',
			],
			[
				'name'        => 'hint',
				'type'        => 'node',
				'description' => 'Help text under the track, linked with aria-describedby.',
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
				'a11y'        => 'Sets aria-invalid on the thumbs.',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables the thumbs.',
			],
			[
				'name'        => 'thumbLabels',
				'type'        => 'object',
				'default'     => [
					'start' => 'Minimum',
					'end'   => 'Maximum',
				],
				'description' => 'With dual, the names added to the label for each thumb. Livewire translates the defaults.',
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
				'description' => 'Extra classes per part, such as { track: \'…\', thumb: \'…\' }.',
			],
		],
		'colors'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
		'sizes'       => [ 'sm', 'md' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The field: label, track, marks, hint and error. Its inline --apui-_from and --apui-_to place the fill and thumbs.',
			],
			[
				'name'        => 'label',
				'element'     => 'label',
				'description' => 'The visible label, for the (first) thumb.',
			],
			[
				'name'        => 'track',
				'element'     => 'div',
				'description' => 'The rail the fill and thumbs sit on.',
			],
			[
				'name'        => 'fill',
				'element'     => 'div',
				'description' => 'The filled span: from the start (or the from thumb) to the value.',
			],
			[
				'name'        => 'control',
				'element'     => 'input',
				'description' => 'A native input type=range per thumb, transparent over the track. Attributes other than class land on it (on both with dual).',
			],
			[
				'name'        => 'thumb',
				'element'     => 'span',
				'description' => 'The drawn thumb (aria-hidden), positioned at its value.',
			],
			[
				'name'        => 'bubble',
				'element'     => 'span',
				'description' => 'The value above a thumb, per showValue.',
			],
			[
				'name'        => 'marks',
				'element'     => 'div',
				'description' => 'The labels under the track.',
			],
			[
				'name'        => 'mark',
				'element'     => 'span',
				'description' => 'One label, placed at its value.',
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
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'The value changed: a number, or [from, to] with dual.',
				'payload'     => 'number | [number, number]',
			],
		],
		'a11y'        => [
			'keyboard'     => [
				[
					'keys'   => 'ArrowRight / ArrowUp',
					'action' => 'Increases the value by step. ArrowRight follows text direction, so it decreases in RTL.',
				],
				[
					'keys'   => 'ArrowLeft / ArrowDown',
					'action' => 'Decreases the value by step. ArrowLeft follows text direction, so it increases in RTL.',
				],
				[
					'keys'   => 'PageUp / PageDown',
					'action' => 'Changes the value by a larger step.',
				],
				[
					'keys'   => 'Home / End',
					'action' => 'Jumps to min or max.',
				],
			],
			'requirements' => [ 'Each thumb is a native input type=range, so the platform supplies role=slider, the keys and touch.', 'aria-valuetext carries the formatted value (format), such as $200k.', 'With dual, each thumb is named by the label plus its thumb label (Minimum, Maximum), and the thumbs can\'t cross.', 'The fill and thumbs follow text direction: under RTL the track fills from the right.', 'The thumb is 18px (14px small) with a 24px hit area.', 'Visible focus ring on the thumb while its input has :focus-visible.', 'Disabled uses --apui-text-disabled for the fill and edge, never opacity alone.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.7', '2.5.8', '3.3.1', '3.3.2', '4.1.2' ],
		],
		'tokens'      => [ '--apui-color-primary', '--apui-surface-sunken', '--apui-surface-raised', '--apui-surface-inverse', '--apui-text-inverse', '--apui-tooltip-radius', '--apui-border-default', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'label'  => 'Search radius',
				'value'  => 20,
				'max'    => 50,
				'format' => '{value} km',
			],
			'parts'  => [
				'hint'      => 'Listings within this distance.',
				'error'     => 'Pick at least 5 km.',
				'showValue' => 'always',
				'marks'     => [
					[
						'value' => 0,
						'label' => '0 km',
					],
					[
						'value' => 25,
						'label' => '25 km',
					],
					[
						'value' => 50,
						'label' => '50 km',
					],
				],
			],
			'states' => [ 'hover', 'focus-visible', 'disabled', 'invalid' ],
		],
	],
	'Rating'            => [
		'name'        => 'Rating',
		'description' => 'Shows or collects a star score. Read-only, it is one image with a text alternative and supports half stars; as an input it is a group of native radios.',
		'status'      => 'draft',
		'issue'       => 53,
		'rootClass'   => 'apui-rating',
		'stacks'      => [
			'livewire' => [
				'name' => 'rating',
			],
			'react'    => [
				'name' => 'Rating',
			],
			'vue'      => [
				'name' => 'Rating',
			],
		],
		'props'       => [
			[
				'name'        => 'value',
				'type'        => 'number',
				'description' => 'The score. Read-only, it rounds to the nearest half star. Livewire binds it with wire:model, Vue with v-model.',
			],
			[
				'name'        => 'defaultValue',
				'type'        => 'number',
				'description' => 'The initial score of an uncontrolled input.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'max',
				'type'        => 'number',
				'default'     => 5,
				'description' => 'The number of stars.',
			],
			[
				'name'        => 'readonly',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Shows the score instead of collecting it. Emitted as data-readonly.',
				'a11y'        => 'Renders role=img with the value label instead of radios.',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables the radios.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md', 'lg' ],
				'default'     => 'md',
				'description' => 'Star size. Emitted as data-size.',
			],
			[
				'name'        => 'count',
				'type'        => 'number',
				'description' => 'The number of reviews, shown after the value.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'description' => 'The input\'s accessible name, such as "Rate the viewing". Livewire defaults it to the translated "Rating".',
			],
			[
				'name'        => 'valueLabel',
				'type'        => 'string',
				'default'     => ':value out of :max',
				'description' => 'The text alternative for the score and each star\'s radio, with :value and :max placeholders. Translated by default.',
			],
			[
				'name'        => 'countLabel',
				'type'        => 'string',
				'description' => 'The review count text, with a :count placeholder. Defaults to "(:count reviews)", singular for one, translated in Livewire.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { star: \'…\', value: \'…\' }.',
			],
		],
		'sizes'       => [ 'sm', 'md', 'lg' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'role=radiogroup holding the stars as an input; role=img with the value label when read-only.',
			],
			[
				'name'        => 'item',
				'element'     => 'label',
				'description' => 'One star\'s radio and its star, as an input.',
			],
			[
				'name'        => 'control',
				'element'     => 'input',
				'description' => 'The native radio for one score, visually hidden over its star. Attributes other than class land on every radio.',
			],
			[
				'name'        => 'star',
				'element'     => 'span',
				'description' => 'A star icon. data-filled when it counts, data-half when it is the half star.',
			],
			[
				'name'        => 'half',
				'element'     => 'span',
				'description' => 'The filled half of a half star, on the start side.',
			],
			[
				'name'        => 'value',
				'element'     => 'span',
				'description' => 'The numeric score.',
			],
			[
				'name'        => 'count',
				'element'     => 'span',
				'description' => 'The number of reviews.',
			],
		],
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'The score changed, as a number.',
				'payload'     => 'number',
			],
		],
		'a11y'        => [
			'role'         => 'radiogroup',
			'roles'        => [ 'img' ],
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves focus to the checked star, or the first.',
				],
				[
					'keys'   => 'ArrowRight, ArrowUp',
					'action' => 'Raises the score by one (platform radio behavior), following the text direction.',
				],
				[
					'keys'   => 'ArrowLeft, ArrowDown',
					'action' => 'Lowers the score by one, following the text direction.',
				],
				[
					'keys'   => 'Space',
					'action' => 'Chooses the focused star.',
				],
			],
			'requirements' => [ 'Read-only: role=img with the value label, such as "4.2 out of 5"; the stars are decorative.', 'Input: native radios sharing one name, so the platform supplies roving focus and arrow keys. Each radio is labelled with the value label, such as "3 out of 5".', 'The stars run in the inline direction and mirror under RTL; the half star fills from the start side, and arrow keys follow the text direction.', 'The filled stars follow the native :checked state, so they update before a deferred wire:model round trip.', 'Visible focus ring on the star whose radio has :focus-visible.', 'Show the numeric value next to the stars; color is never the only cue.', 'Every label is translatable.' ],
			'wcag'         => [ '1.1.1', '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.7', '2.5.8', '4.1.2' ],
		],
		'tokens'      => [ '--apui-color-accent', '--apui-color-accent-border', '--apui-color-accent-soft', '--apui-border-default', '--apui-icon-size-sm', '--apui-icon-size-lg', '--apui-radius-xs', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'value' => 4,
				'count' => 17,
				'label' => 'Rate the viewing',
			],
			'states' => [ 'hover', 'focus-visible', 'readonly', 'disabled' ],
		],
	],
	'RichTextEditor'    => [
		'name'        => 'RichTextEditor',
		'description' => 'Formatted text editing with a toolbar over the shared prose styles. All three stacks render the same frame, toolbar and content, on different engines (D-003): TinyMCE in Livewire, a built-in contentEditable engine in React and Vue.',
		'status'      => 'draft',
		'issue'       => 53,
		'rootClass'   => 'apui-rich-text-editor',
		'stacks'      => [
			'livewire' => [
				'name'         => 'rich-text-editor',
				'capabilities' => [ 'tinymce', 'uploads', 'markdown-shortcuts' ],
				'differences'  => [ 'Edits with TinyMCE (inline, under the design-system toolbar) when the page loads it; without TinyMCE it falls back to the built-in contentEditable engine React and Vue use.', 'With TinyMCE, Link and Image open TinyMCE\'s dialogs, and images upload to the package\'s upload route (disk and folder), so pasted and dropped images work.', 'Livewire-only props: engine, config (extra TinyMCE settings), disk and folder.', 'Markdown shortcuts run only on the built-in engine; TinyMCE keeps its own typing behavior.', 'Replaces the TinyMCE-only <x-artisanpack-editor>, which stays as a deprecated alias of the old component.' ],
			],
			'react'    => [
				'name'         => 'RichTextEditor',
				'capabilities' => [ 'markdown-shortcuts' ],
				'differences'  => [ 'Edits with the built-in contentEditable engine (the browser\'s editing commands): no TinyMCE, no uploads.', 'Link and Image ask for a URL (and image description) with the browser prompt; only http, https, mailto, tel and relative URLs are kept.', 'The value is sanitized to the editor\'s formats before it is shown, so untrusted HTML can\'t run script.' ],
			],
			'vue'      => [
				'name'         => 'RichTextEditor',
				'capabilities' => [ 'markdown-shortcuts' ],
				'differences'  => [ 'Edits with the built-in contentEditable engine (the browser\'s editing commands): no TinyMCE, no uploads.', 'Link and Image ask for a URL (and image description) with the browser prompt; only http, https, mailto, tel and relative URLs are kept.', 'The value is sanitized to the editor\'s formats before it is shown, so untrusted HTML can\'t run script.' ],
			],
		],
		'props'       => [
			[
				'name'        => 'toolbar',
				'type'        => 'string',
				'default'     => 'default',
				'description' => 'A preset (default, compact or minimal), or in React and Vue a list of commands and | dividers: bold, italic, underline, strike, heading2, heading3, bulletList, orderedList, quote, code, link, image, undo, redo. Formats the output can\'t hold are left off.',
			],
			[
				'name'        => 'output',
				'type'        => 'enum',
				'values'      => [ 'html', 'markdown' ],
				'default'     => 'html',
				'description' => 'The format value is read and written in. Markdown drops underline from the toolbar. Emitted as data-output.',
			],
			[
				'name'        => 'maxLength',
				'type'        => 'number',
				'description' => 'The most characters allowed. Typing stops there, and the footer counts against it.',
			],
			[
				'name'        => 'counter',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Shows the footer with the word and character count. maxLength shows it too.',
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The visible label. It names the content.',
			],
			[
				'name'        => 'hint',
				'type'        => 'node',
				'description' => 'Help text under the editor, linked with aria-describedby.',
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
				'a11y'        => 'Sets aria-invalid on the content.',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables editing and the toolbar. Emitted as data-disabled.',
			],
			[
				'name'        => 'readonly',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Shows the content without editing it. Emitted as data-readonly.',
				'a11y'        => 'Sets aria-readonly on the content.',
			],
			[
				'name'        => 'required',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Marks the field required and shows the required mark.',
				'a11y'        => 'Sets aria-required on the content.',
			],
			[
				'name'        => 'placeholder',
				'type'        => 'string',
				'description' => 'Text shown while the content is empty. Never a replacement for the label.',
			],
			[
				'name'        => 'value',
				'type'        => 'string',
				'description' => 'The content, in the output format. Livewire binds it with wire:model, Vue with v-model. Sanitized to the editor\'s formats before it is shown.',
			],
			[
				'name'        => 'defaultValue',
				'type'        => 'string',
				'stacks'      => [ 'react' ],
				'description' => 'The initial value of an uncontrolled editor.',
			],
			[
				'name'        => 'toolbarLabel',
				'type'        => 'string',
				'description' => 'The toolbar\'s accessible name. Defaults to "Formatting", translated in Livewire.',
			],
			[
				'name'        => 'boldLabel',
				'type'        => 'string',
				'description' => 'The Bold button\'s accessible name. Defaults to "Bold", translated in Livewire.',
			],
			[
				'name'        => 'italicLabel',
				'type'        => 'string',
				'description' => 'The Italic button\'s accessible name. Defaults to "Italic", translated in Livewire.',
			],
			[
				'name'        => 'underlineLabel',
				'type'        => 'string',
				'description' => 'The Underline button\'s accessible name. Defaults to "Underline", translated in Livewire.',
			],
			[
				'name'        => 'strikeLabel',
				'type'        => 'string',
				'description' => 'The Strikethrough button\'s accessible name. Defaults to "Strikethrough", translated in Livewire.',
			],
			[
				'name'        => 'heading2Label',
				'type'        => 'string',
				'description' => 'The Heading 2 button\'s accessible name. Defaults to "Heading 2", translated in Livewire.',
			],
			[
				'name'        => 'heading3Label',
				'type'        => 'string',
				'description' => 'The Heading 3 button\'s accessible name. Defaults to "Heading 3", translated in Livewire.',
			],
			[
				'name'        => 'bulletListLabel',
				'type'        => 'string',
				'description' => 'The bulleted list button\'s accessible name. Defaults to "Bulleted list", translated in Livewire.',
			],
			[
				'name'        => 'orderedListLabel',
				'type'        => 'string',
				'description' => 'The numbered list button\'s accessible name. Defaults to "Numbered list", translated in Livewire.',
			],
			[
				'name'        => 'quoteLabel',
				'type'        => 'string',
				'description' => 'The Quote button\'s accessible name. Defaults to "Quote", translated in Livewire.',
			],
			[
				'name'        => 'codeLabel',
				'type'        => 'string',
				'description' => 'The Code button\'s accessible name. Defaults to "Code", translated in Livewire.',
			],
			[
				'name'        => 'linkLabel',
				'type'        => 'string',
				'description' => 'The Link button\'s accessible name. Defaults to "Link", translated in Livewire.',
			],
			[
				'name'        => 'imageLabel',
				'type'        => 'string',
				'description' => 'The Image button\'s accessible name. Defaults to "Image", translated in Livewire.',
			],
			[
				'name'        => 'undoLabel',
				'type'        => 'string',
				'description' => 'The Undo button\'s accessible name. Defaults to "Undo", translated in Livewire.',
			],
			[
				'name'        => 'redoLabel',
				'type'        => 'string',
				'description' => 'The Redo button\'s accessible name. Defaults to "Redo", translated in Livewire.',
			],
			[
				'name'        => 'linkPromptLabel',
				'type'        => 'string',
				'description' => 'The prompt that asks for a link URL (built-in engine). Defaults to "Link URL", translated in Livewire.',
			],
			[
				'name'        => 'imagePromptLabel',
				'type'        => 'string',
				'description' => 'The prompt that asks for an image URL (built-in engine). Defaults to "Image URL", translated in Livewire.',
			],
			[
				'name'        => 'imageAltPromptLabel',
				'type'        => 'string',
				'description' => 'The prompt that asks for an image description (built-in engine). Defaults to "Describe the image", translated in Livewire.',
			],
			[
				'name'        => 'shortcutsLabel',
				'type'        => 'string',
				'description' => 'The footer note about Markdown shortcuts. Defaults to "Markdown shortcuts on", translated in Livewire.',
			],
			[
				'name'        => 'wordLabel',
				'type'        => 'string',
				'description' => 'The footer\'s word count for one word; :count is the number. Defaults to ":count word", translated in Livewire.',
			],
			[
				'name'        => 'wordsLabel',
				'type'        => 'string',
				'description' => 'The footer\'s word count; :count is the number. Defaults to ":count words", translated in Livewire.',
			],
			[
				'name'        => 'characterLabel',
				'type'        => 'string',
				'description' => 'The footer\'s character count for one character. Defaults to ":count character", translated in Livewire.',
			],
			[
				'name'        => 'charactersLabel',
				'type'        => 'string',
				'description' => 'The footer\'s character count; :count is the number. Defaults to ":count characters", translated in Livewire.',
			],
			[
				'name'        => 'limitLabel',
				'type'        => 'string',
				'description' => 'The footer\'s count with maxLength; :count and :max are numbers. Defaults to ":count / :max characters", translated in Livewire.',
			],
			[
				'name'        => 'engine',
				'type'        => 'enum',
				'values'      => [ 'tinymce', 'native' ],
				'default'     => 'tinymce',
				'stacks'      => [ 'livewire' ],
				'description' => 'tinymce runs TinyMCE when the page has loaded it; native always uses the built-in engine.',
			],
			[
				'name'        => 'config',
				'type'        => 'object',
				'stacks'      => [ 'livewire' ],
				'description' => 'Extra TinyMCE settings, merged over the defaults.',
			],
			[
				'name'        => 'disk',
				'type'        => 'string',
				'stacks'      => [ 'livewire' ],
				'description' => 'The storage disk TinyMCE image uploads go to. Unset, the upload route uses the first allowed disk.',
			],
			[
				'name'        => 'folder',
				'type'        => 'string',
				'default'     => 'editor',
				'stacks'      => [ 'livewire' ],
				'description' => 'The folder on the disk for uploads.',
			],
			[
				'name'        => 'errorField',
				'type'        => 'string',
				'stacks'      => [ 'livewire' ],
				'description' => 'The validation key to read from $errors. Defaults to the wire:model name.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { toolbar: \'…\', content: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The field: label, box, hint and error.',
			],
			[
				'name'        => 'label',
				'element'     => 'span',
				'description' => 'The visible label. It names the content through aria-labelledby.',
			],
			[
				'name'        => 'required',
				'element'     => 'span',
				'description' => 'The required mark inside the label. Hidden from screen readers.',
			],
			[
				'name'        => 'box',
				'element'     => 'div',
				'description' => 'The bordered frame: toolbar, content and footer. The spec\'s root.',
			],
			[
				'name'        => 'toolbar',
				'element'     => 'div',
				'description' => 'role=toolbar with roving focus.',
			],
			[
				'name'        => 'button',
				'element'     => 'button',
				'description' => 'A formatting button: icon-only, with an accessible name; toggles carry aria-pressed. data-command names it.',
			],
			[
				'name'        => 'divider',
				'element'     => 'span',
				'description' => 'A vertical separator between button groups.',
			],
			[
				'name'        => 'content',
				'element'     => 'div',
				'description' => 'The editable content, role=textbox with aria-multiline, styled with the prose styles.',
			],
			[
				'name'        => 'placeholder',
				'element'     => 'p',
				'description' => 'The placeholder over the empty content. Hidden from screen readers; the content has aria-placeholder.',
			],
			[
				'name'        => 'footer',
				'element'     => 'div',
				'description' => 'The shortcuts note and the count.',
			],
			[
				'name'        => 'count',
				'element'     => 'span',
				'description' => 'Words and characters, or characters against maxLength.',
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
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'The content changed. The payload is in the output format.',
				'payload'     => 'string',
			],
		],
		'a11y'        => [
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves into the toolbar (one stop) and then the content.',
				],
				[
					'keys'   => 'ArrowLeft / ArrowRight',
					'action' => 'Moves between toolbar buttons, following the text direction; Home and End go to the first and last.',
				],
				[
					'keys'   => 'Mod+B / Mod+I / Mod+U',
					'action' => 'Bold, italic and underline. Mod is Ctrl, or ⌘ on Apple platforms.',
				],
				[
					'keys'   => 'Mod+Shift+X / Mod+Shift+7 / Mod+Shift+8',
					'action' => 'Strikethrough, numbered list and bulleted list.',
				],
				[
					'keys'   => 'Mod+K',
					'action' => 'Adds a link to the selection, or removes the one at the caret.',
				],
				[
					'keys'   => '## / ### / - / 1. / > then Space',
					'action' => 'Markdown shortcuts at the start of a line: headings, lists and a quote (built-in engine).',
				],
			],
			'requirements' => [ 'The toolbar is role=toolbar with an accessible name and one tab stop; arrow keys follow the text direction (RTL).', 'Toggle buttons use aria-pressed; every button is icon-only with an accessible name.', 'The content is role=textbox with aria-multiline, named by the label and described by the hint and error.', 'Invalid sets aria-invalid on the content; the error is text, never color alone.', 'The keyboard and Markdown shortcuts are documented.', 'The value is sanitized to the editor\'s formats; links and images keep only safe URLs.', 'Undo and redo icons mirror in RTL; code blocks stay left to right.', 'Disabled and read-only use --apui-surface-sunken, never opacity alone.', 'Visible focus ring on the box while the content has focus.' ],
			'wcag'         => [ '1.1.1', '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.7', '2.5.8', '3.3.1', '3.3.2', '4.1.2' ],
		],
		'tokens'      => [ '--apui-input-radius', '--apui-button-radius', '--apui-border-default', '--apui-border-muted', '--apui-border-strong', '--apui-surface-default', '--apui-surface-sunken', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-selected-bg', '--apui-color-primary-soft-foreground', '--apui-color-primary-text', '--apui-color-error-border', '--apui-color-error-text', '--apui-state-hover', '--apui-state-pressed', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'label'   => 'Description',
				'toolbar' => 'default',
			],
			'parts'  => [
				'required'    => true,
				'hint'        => 'Shown on the listing page.',
				'error'       => 'Write at least 40 characters.',
				'counter'     => true,
				'placeholder' => 'Write a note for the buyer…',
				'boldLabel'   => 'Strong',
			],
			'states' => [ 'disabled', 'invalid', 'readonly' ],
		],
	],
	'Select'            => [
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
				'description' => 'The options: strings, { value, label, disabled } objects, or { label, options } groups rendered as native optgroups (this replaces the Livewire select-group component). Option children (a slot in Blade and Vue) render as well, after them.',
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
	'Signature'         => [
		'name'        => 'Signature',
		'description' => 'Captures a signature by drawing, typing or uploading. Every mode produces the same value, a PNG data URL, and Type mode is always offered as the keyboard-accessible path.',
		'status'      => 'draft',
		'issue'       => 53,
		'rootClass'   => 'apui-signature',
		'stacks'      => [
			'livewire' => [
				'name' => 'signature',
			],
			'react'    => [
				'name' => 'Signature',
			],
			'vue'      => [
				'name' => 'Signature',
			],
		],
		'props'       => [
			[
				'name'        => 'mode',
				'type'        => 'enum',
				'values'      => [ 'draw', 'type', 'upload' ],
				'default'     => 'draw',
				'description' => 'The mode shown first. Emitted as data-mode; the mode switch changes it.',
			],
			[
				'name'        => 'modes',
				'type'        => 'array',
				'default'     => [ 'draw', 'type', 'upload' ],
				'description' => 'The modes offered, from draw, type and upload. Type is always added: it\'s the keyboard path.',
			],
			[
				'name'        => 'penColor',
				'type'        => 'enum',
				'values'      => [ 'default', 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
				'default'     => 'default',
				'description' => 'The ink: default is the text color; the others use the color\'s text tone, which keeps 4.5:1 on the pad. Emitted as data-pen-color.',
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The visible label. It names the group.',
			],
			[
				'name'        => 'hint',
				'type'        => 'node',
				'description' => 'Help text under the pad, such as who is signing and the date. Linked with aria-describedby.',
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
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables drawing, typing, uploading and the tools. Emitted as data-disabled.',
			],
			[
				'name'        => 'required',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Marks the field required and shows the required mark.',
				'a11y'        => 'Sets aria-required on the typed-name input.',
			],
			[
				'name'        => 'placeholder',
				'type'        => 'string',
				'description' => 'The text under the signing line. Defaults to "Sign above the line", translated.',
			],
			[
				'name'        => 'value',
				'type'        => 'string',
				'description' => 'The signature as a PNG data URL, or empty. Livewire binds it with wire:model, Vue with v-model.',
			],
			[
				'name'        => 'defaultValue',
				'type'        => 'string',
				'stacks'      => [ 'react' ],
				'description' => 'The initial value of an uncontrolled signature.',
			],
			[
				'name'        => 'modesLabel',
				'type'        => 'string',
				'description' => 'The mode switch group\'s accessible name. Defaults to "Signature method", translated in Livewire.',
			],
			[
				'name'        => 'drawLabel',
				'type'        => 'string',
				'description' => 'The draw mode button. Defaults to "Draw", translated in Livewire.',
			],
			[
				'name'        => 'typeLabel',
				'type'        => 'string',
				'description' => 'The type mode button. Defaults to "Type", translated in Livewire.',
			],
			[
				'name'        => 'uploadLabel',
				'type'        => 'string',
				'description' => 'The upload mode button. Defaults to "Upload", translated in Livewire.',
			],
			[
				'name'        => 'padLabel',
				'type'        => 'string',
				'description' => 'The canvas\'s accessible name. Defaults to "Signature pad. Draw with a mouse, finger or stylus, or choose Type.", translated in Livewire.',
			],
			[
				'name'        => 'typedLabel',
				'type'        => 'string',
				'description' => 'The typed-name input\'s accessible name. Defaults to "Type your full name", translated in Livewire.',
			],
			[
				'name'        => 'uploadTriggerLabel',
				'type'        => 'string',
				'description' => 'The upload trigger\'s text. Defaults to "Choose an image", translated in Livewire.',
			],
			[
				'name'        => 'undoLabel',
				'type'        => 'string',
				'description' => 'The icon-only undo button\'s accessible name. Defaults to "Undo stroke", translated in Livewire.',
			],
			[
				'name'        => 'clearLabel',
				'type'        => 'string',
				'description' => 'The clear button\'s text. Defaults to "Clear", translated in Livewire.',
			],
			[
				'name'        => 'clearedLabel',
				'type'        => 'string',
				'description' => 'Announced in the live region after clearing. Defaults to "Signature cleared.", translated in Livewire.',
			],
			[
				'name'        => 'errorField',
				'type'        => 'string',
				'stacks'      => [ 'livewire' ],
				'description' => 'The validation key to read from $errors. Defaults to the wire:model name.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { pad: \'…\', typed: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The field: label, mode switch, pad, hint and error. A group named by the label.',
			],
			[
				'name'        => 'label',
				'element'     => 'span',
				'description' => 'The visible label. It names the root group.',
			],
			[
				'name'        => 'required',
				'element'     => 'span',
				'description' => 'The required mark inside the label. Hidden from screen readers.',
			],
			[
				'name'        => 'modes',
				'element'     => 'div',
				'description' => 'The mode switch, a group of toggle buttons.',
			],
			[
				'name'        => 'mode',
				'element'     => 'button',
				'description' => 'One mode\'s toggle button, with aria-pressed.',
			],
			[
				'name'        => 'pad',
				'element'     => 'div',
				'description' => 'The bordered signing surface: the spec\'s frame.',
			],
			[
				'name'        => 'line',
				'element'     => 'span',
				'description' => 'The dashed signing line. Decorative.',
			],
			[
				'name'        => 'mark',
				'element'     => 'span',
				'description' => 'The × at the start of the line. Decorative.',
			],
			[
				'name'        => 'ink',
				'element'     => 'canvas',
				'description' => 'The drawing surface in draw and upload modes, an image to screen readers.',
			],
			[
				'name'        => 'typed',
				'element'     => 'input',
				'description' => 'The typed name, set on the line in a script face. Shown in type mode.',
			],
			[
				'name'        => 'upload',
				'element'     => 'label',
				'description' => 'The upload trigger wrapping a native file input. Shown in upload mode until an image is chosen.',
			],
			[
				'name'        => 'tools',
				'element'     => 'div',
				'description' => 'Undo and clear, at the pad\'s top end.',
			],
			[
				'name'        => 'undo',
				'element'     => 'button',
				'description' => 'Undoes the last stroke. Icon-only with an accessible name; shown in draw mode.',
			],
			[
				'name'        => 'clear',
				'element'     => 'button',
				'description' => 'Clears the signature.',
			],
			[
				'name'        => 'placeholder',
				'element'     => 'span',
				'description' => 'The instruction under the line. Decorative; the pad\'s label says the same.',
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
			[
				'name'        => 'status',
				'element'     => 'span',
				'description' => 'A visually hidden polite live region that announces a cleared signature.',
			],
		],
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'The signature changed: a stroke ended, the name changed, an image loaded, or it was undone or cleared.',
				'payload'     => 'string',
			],
		],
		'a11y'        => [
			'role'         => 'group',
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves through the mode buttons, the typed name or the upload input, then undo and clear.',
				],
				[
					'keys'   => 'Enter / Space',
					'action' => 'Chooses a mode or runs undo and clear.',
				],
			],
			'requirements' => [ 'Type mode is always offered and is the keyboard-accessible path; drawing is never the only option.', 'The root is a group named by the label and described by the hint and error.', 'The canvas is role=img with an accessible name that points to Type mode.', 'Mode buttons are toggle buttons with aria-pressed; switching modes starts over.', 'Undo and clear are labeled buttons; undo is icon-only with an accessible name, and its icon mirrors in RTL.', 'Clearing is announced through a polite live region.', 'The ink and the typed name use text tones, 4.5:1 on the pad in every theme, and CanvasText in forced colors.', 'Invalid shows an error edge on the pad plus the error text, never color alone.', 'Disabled uses --apui-surface-sunken and --apui-text-disabled, never opacity alone.', 'Class goes to the root; wire:model binds value; name goes to a hidden input so forms submit it.' ],
			'wcag'         => [ '1.1.1', '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.7', '2.5.1', '2.5.8', '3.3.1', '3.3.2', '4.1.2', '4.1.3' ],
		],
		'tokens'      => [ '--apui-input-radius', '--apui-tabs-radius', '--apui-button-radius', '--apui-border-default', '--apui-border-muted', '--apui-border-strong', '--apui-surface-default', '--apui-surface-sunken', '--apui-surface-raised', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-color-error-border', '--apui-color-error-text', '--apui-state-hover', '--apui-state-pressed', '--apui-focus-ring-color', '--apui-target-size-min' ],
		'fixture'     => [
			'props'  => [
				'label' => 'Signature',
			],
			'parts'  => [
				'required'   => true,
				'hint'       => 'Olivia Rhye · Nov 7, 2026',
				'error'      => 'Sign to accept the lease.',
				'clearLabel' => 'Erase',
			],
			'states' => [ 'disabled', 'invalid' ],
		],
	],
	'Spotlight'         => [
		'name'        => 'Spotlight',
		'description' => 'A command palette: search across pages, records and actions. A modal dialog holding a combobox whose listbox of grouped results is always open; a global shortcut (⌘K or Ctrl+K) toggles it. Arrow keys move, Enter opens, Escape closes. Replaces SpotlightSearch in React and Vue.',
		'status'      => 'draft',
		'issue'       => 57,
		'rootClass'   => 'apui-spotlight',
		'stacks'      => [
			'livewire' => [
				'name'         => 'spotlight',
				'capabilities' => [ 'wire:model binds open both ways through $wire.entangle()', 'url fetches results as JSON from an endpoint as you type: the artisanpack.spotlight route by default, which runs the configured search class and the ap.livewireUiComponents.spotlightCommands filter', 'navigate adds wire:navigate to link items' ],
			],
			'react'    => [
				'name'         => 'Spotlight',
				'capabilities' => [ 'search with onSearchChange and remote for results the page fetches' ],
			],
			'vue'      => [
				'name'         => 'Spotlight',
				'capabilities' => [ 'search with search-change and remote for results the page fetches' ],
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
				'description' => 'The initial state of an uncontrolled palette.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'groups',
				'type'        => 'array',
				'description' => 'The results, in groups: { id, label, items: [{ value, label, description, href, icon, color, shortcut, keywords, disabled }] }. A link item (href) is followed when it\'s chosen; value defaults to href, then label. Unless remote, items are filtered as the user types, by every word against the label, description and keywords. The matched words are marked in each label with <mark>.',
			],
			[
				'name'        => 'search',
				'type'        => 'string',
				'description' => 'The query text (controlled). Pair it with search-change, and pass the matching groups with remote to search on the server.',
				'stacks'      => [ 'react', 'vue' ],
			],
			[
				'name'        => 'remote',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'The page searches: groups are the results for the query and aren\'t filtered here.',
			],
			[
				'name'        => 'url',
				'type'        => 'string',
				'description' => 'An endpoint that returns results as JSON for ?search=…, fetched as the user types (after a 250ms pause) and listed after the groups. Groups ({ label, items }) or a flat list of items; the 2.x shape (name, link) still reads.',
				'stacks'      => [ 'livewire' ],
			],
			[
				'name'        => 'navigate',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Adds wire:navigate to internal link items, so they load through Livewire\'s SPA navigation. Off-site and `#` links load normally.',
				'stacks'      => [ 'livewire' ],
			],
			[
				'name'        => 'loading',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Shows the loading row and marks the results busy, while the page fetches them.',
				'a11y'        => 'Sets aria-busy on the listbox; the results count is announced when they arrive.',
			],
			[
				'name'        => 'shortcut',
				'type'        => 'string',
				'default'     => 'mod+k',
				'description' => 'The global shortcut that opens and closes the palette, as modifiers and a key joined with +: mod is ⌘ on Apple platforms and Ctrl elsewhere; ctrl, meta, alt and shift are also accepted. Empty turns it off. Livewire still reads the 2.x spelling (meta.g, ctrl.k) as deprecated.',
				'a11y'        => 'Announced with aria-keyshortcuts on the query and the trigger.',
			],
			[
				'name'        => 'recent',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Lists the most recent choices first, in a Recent group, while the query is empty. Off by default: turning it on keeps them in the browser\'s localStorage, per palette id.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'default'     => 'Search',
				'description' => 'The palette\'s accessible name, for the panel, the query and the results. Translate it: Livewire defaults it through __( \'Search\' ).',
				'a11y'        => 'The panel has no visible title, so this is its name.',
			],
			[
				'name'        => 'placeholder',
				'type'        => 'string',
				'default'     => 'Search…',
				'description' => 'The query\'s placeholder. Translate it.',
			],
			[
				'name'        => 'searchText',
				'type'        => 'string',
				'description' => 'The 2.x name of placeholder.',
				'deprecated'  => 'Use placeholder.',
				'stacks'      => [ 'livewire' ],
			],
			[
				'name'        => 'emptyLabel',
				'type'        => 'string',
				'default'     => 'No results.',
				'description' => 'Shown when nothing matches. Translate it. The empty slot overrides it.',
			],
			[
				'name'        => 'emptyText',
				'type'        => 'string',
				'description' => 'An earlier name of emptyLabel.',
				'deprecated'  => 'Use emptyLabel.',
				'stacks'      => [ 'livewire' ],
			],
			[
				'name'        => 'noResultsText',
				'type'        => 'string',
				'description' => 'The 2.x name of emptyLabel.',
				'deprecated'  => 'Use emptyLabel.',
				'stacks'      => [ 'livewire' ],
			],
			[
				'name'        => 'loadingLabel',
				'type'        => 'string',
				'default'     => 'Searching…',
				'description' => 'Shown while loading. Translate it.',
			],
			[
				'name'        => 'loadingText',
				'type'        => 'string',
				'description' => 'An earlier name of loadingLabel.',
				'deprecated'  => 'Use loadingLabel.',
				'stacks'      => [ 'livewire' ],
			],
			[
				'name'        => 'recentLabel',
				'type'        => 'string',
				'default'     => 'Recent',
				'description' => 'The Recent group\'s label. Translate it.',
			],
			[
				'name'        => 'closeLabel',
				'type'        => 'string',
				'default'     => 'Close',
				'description' => 'The Esc button\'s accessible name, after its visible key: "Esc, Close". Translate it: Livewire renders it through __( \'Esc, :label\' ), with the label defaulting to __( \'Close\' ).',
				'a11y'        => 'The button shows only the Esc key, so the name starts with it (WCAG 2.5.3) and the button sets aria-keyshortcuts=Escape.',
			],
			[
				'name'        => 'navigateLabel',
				'type'        => 'string',
				'default'     => 'Navigate',
				'description' => 'The footer\'s hint beside the arrow keys. Translate it.',
			],
			[
				'name'        => 'selectLabel',
				'type'        => 'string',
				'default'     => 'Open',
				'description' => 'The footer\'s hint beside the Enter key. Translate it.',
			],
			[
				'name'        => 'trigger',
				'type'        => 'node',
				'description' => 'Content for a trigger button that opens the palette, shown with the shortcut\'s keys. Without it, open the palette with the shortcut or through open.',
			],
			[
				'name'        => 'footer',
				'type'        => 'node',
				'description' => 'Replaces the footer\'s key hints.',
			],
			[
				'name'        => 'modal',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Traps focus, locks scroll and hides the rest of the page from assistive technology. Turn it off only to render the palette in place.',
				'a11y'        => 'Sets aria-modal.',
			],
			[
				'name'        => 'portal',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Renders the palette at the end of the body, above everything (x-teleport, a React portal, Vue Teleport). Off renders it in place.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { results: \'…\', item: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The panel, carrying the root class. It is the dialog\'s content part, so it also carries data-part="content" (D-019).',
			],
			[
				'name'        => 'content',
				'element'     => 'div',
				'description' => 'The panel: the same element as root.',
			],
			[
				'name'        => 'trigger',
				'element'     => 'button',
				'description' => 'The button that opens the palette, when trigger is set: an outline, neutral Button with the shortcut\'s keys.',
			],
			[
				'name'        => 'backdrop',
				'element'     => 'div',
				'description' => 'The scrim behind the panel.',
			],
			[
				'name'        => 'positioner',
				'element'     => 'div',
				'description' => 'Fills the viewport and places the panel near the top.',
			],
			[
				'name'        => 'search',
				'element'     => 'div',
				'description' => 'The search row: icon, query and the Esc button. The combobox\'s control.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'The search icon before the query.',
			],
			[
				'name'        => 'query',
				'element'     => 'input',
				'description' => 'The search text: role combobox, with aria-activedescendant on the active result. The combobox\'s input.',
			],
			[
				'name'        => 'closeTrigger',
				'element'     => 'button',
				'description' => 'The Esc key at the end of the search row, which closes the palette.',
			],
			[
				'name'        => 'results',
				'element'     => 'div',
				'description' => 'The listbox of results. The combobox\'s content.',
			],
			[
				'name'        => 'itemGroup',
				'element'     => 'div',
				'description' => 'A group of results, labelled by its label.',
			],
			[
				'name'        => 'itemGroupLabel',
				'element'     => 'div',
				'description' => 'A group\'s label.',
			],
			[
				'name'        => 'item',
				'element'     => 'div | a',
				'description' => 'A result: role option, a link when it has href.',
			],
			[
				'name'        => 'tile',
				'element'     => 'span',
				'description' => 'An item\'s icon in a tinted tile.',
			],
			[
				'name'        => 'itemText',
				'element'     => 'span',
				'description' => 'An item\'s label, with the query\'s matches in <mark>.',
			],
			[
				'name'        => 'itemDescription',
				'element'     => 'span',
				'description' => 'An item\'s secondary text, under the label.',
			],
			[
				'name'        => 'shortcut',
				'element'     => 'span',
				'description' => 'Keys shown as a hint, one kbd each: an item\'s shortcut, the trigger\'s and the footer\'s.',
			],
			[
				'name'        => 'itemIndicator',
				'element'     => 'span',
				'description' => 'The Enter glyph at the end of a result, shown on the active one; it mirrors in RTL.',
			],
			[
				'name'        => 'empty',
				'element'     => 'div',
				'description' => 'Shown when nothing matches.',
			],
			[
				'name'        => 'loading',
				'element'     => 'div',
				'description' => 'Shown while loading.',
			],
			[
				'name'        => 'footer',
				'element'     => 'div',
				'description' => 'Key hints under the results.',
			],
		],
		'slots'       => [
			[
				'name'        => 'trigger',
				'description' => 'Content for the trigger button.',
			],
			[
				'name'        => 'empty',
				'description' => 'Shown when nothing matches, instead of emptyLabel.',
			],
			[
				'name'        => 'footer',
				'description' => 'Replaces the footer\'s key hints. Livewire still reads the 2.x append slot as deprecated.',
			],
		],
		'events'      => [
			[
				'name'        => 'open-change',
				'description' => 'The palette opened or closed itself: the trigger, the shortcut, Escape, the backdrop, the Esc button or a choice. Setting open doesn\'t fire it.',
				'payload'     => 'boolean',
			],
			[
				'name'        => 'select',
				'description' => 'An item was chosen, by click or Enter. The payload is the item, with its value; a link item is followed too.',
				'payload'     => 'SpotlightResult',
			],
			[
				'name'        => 'search-change',
				'description' => 'The user typed in the query, or the palette cleared it on closing. The payload is the text.',
				'payload'     => 'string',
			],
		],
		'a11y'        => [
			'role'         => 'dialog',
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => '⌘K, Ctrl+K',
					'action' => 'Anywhere on the page, opens or closes the palette (the shortcut prop).',
				],
				[
					'keys'   => 'ArrowDown, ArrowUp',
					'action' => 'Move to the next or previous result across groups, wrapping, skipping disabled ones. Focus stays in the query.',
				],
				[
					'keys'   => 'Home, End',
					'action' => 'Move to the first or last result.',
				],
				[
					'keys'   => 'Enter',
					'action' => 'Opens the active result: follows its link or reports select, then closes.',
				],
				[
					'keys'   => 'Escape',
					'action' => 'Closes the palette and returns focus to where it was.',
				],
				[
					'keys'   => 'Tab, Shift+Tab',
					'action' => 'Move between the query and the Esc button; focus stays in the palette.',
				],
			],
			'requirements' => [ 'A dialog named by label, holding a combobox (the query) that controls an always-open listbox; the active result is aria-activedescendant and aria-selected.', 'Focus moves to the query on open and returns to where it was on close.', 'A modal palette sets aria-modal, hides the rest of the page from assistive technology and locks scroll.', 'Groups are role group, labelled by their label with aria-labelledby.', 'The results count ("3 results", "No results") is announced politely after typing, inside the panel; the strings are translatable.', 'The listbox sets aria-busy while loading.', 'The shortcut is exposed with aria-keyshortcuts, and a single-key shortcut never fires while typing in a field.', 'The Esc button\'s accessible name contains its visible text: "Esc, Close", with "Close" translatable.', 'Text keeps 4.5:1 and the panel\'s edge 3:1 on the overlay surface in every theme.', 'Arrow keys keep their vertical meaning in RTL; the layout mirrors with logical properties.', 'Every part keeps a stable, server-rendered id in Livewire and items carry wire:key (D-015).', 'Matches are marked with <mark>, whose text stays in the option\'s accessible name; the Enter glyph is aria-hidden.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.1.2', '2.1.4', '2.4.3', '2.4.7', '4.1.2', '4.1.3' ],
		],
		'tokens'      => [ '--apui-spotlight-width', '--apui-radius-overlay', '--apui-menu-item-radius', '--apui-kbd-radius', '--apui-surface-overlay', '--apui-surface-default', '--apui-surface-raised', '--apui-elevation-overlay', '--apui-backdrop', '--apui-z-modal', '--apui-border-muted', '--apui-border-default', '--apui-state-hover', '--apui-selected-bg', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-color-primary-border' ],
		'fixture'     => [
			'props'  => [
				'open'   => true,
				'modal'  => false,
				'portal' => false,
				'groups' => [
					[
						'id'    => 'properties',
						'label' => 'Properties',
						'items' => [
							[
								'value'       => 'grove',
								'label'       => 'The Grove at Greenfield',
								'description' => 'Spain, Barcelona · Draft',
								'icon'        => 'house',
								'color'       => 'primary',
							],
							[
								'value'       => 'golden-hour',
								'label'       => 'Golden Hour Apartments',
								'description' => 'United States, Denver',
								'icon'        => 'house',
								'color'       => 'primary',
							],
						],
					],
					[
						'id'    => 'pages',
						'label' => 'Pages',
						'items' => [
							[
								'value' => 'reports',
								'label' => 'Analytics › Reports',
								'icon'  => 'file-text',
								'href'  => '#reports',
							],
							[
								'value' => 'settings',
								'label' => 'Settings',
								'icon'  => 'settings',
								'href'  => '#settings',
							],
						],
					],
					[
						'id'    => 'actions',
						'label' => 'Actions',
						'items' => [
							[
								'value'    => 'add',
								'label'    => 'Add property',
								'icon'     => 'plus',
								'color'    => 'success',
								'shortcut' => '⌘ N',
							],
							[
								'value' => 'import',
								'label' => 'Import listings from CSV',
								'icon'  => 'upload',
							],
						],
					],
				],
			],
			'parts'  => [
				'trigger' => 'Search',
			],
			'states' => [],
		],
	],
	'Steps'             => [
		'name'        => 'Steps',
		'description' => 'Shows progress through a sequence: an ordered list of steps, each complete, current, upcoming or in error. Compose it from Step children, or pass the same structure as steps.',
		'status'      => 'draft',
		'issue'       => 56,
		'rootClass'   => 'apui-steps',
		'stacks'      => [
			'livewire' => [
				'name'         => 'steps',
				'capabilities' => [ 'Children: step; steps renders the same children', 'wire:model binds value; with clickable, choosing a completed step sets it', 'A step\'s 2.x step and text props still work, as its number and title' ],
			],
			'react'    => [
				'name'         => 'Steps',
				'capabilities' => [ 'Children: Step' ],
			],
			'vue'      => [
				'name'         => 'Steps',
				'capabilities' => [ 'Children: Step' ],
			],
		],
		'props'       => [
			[
				'name'        => 'steps',
				'type'        => 'array',
				'description' => 'The steps as data, rendering the same children as composition: { title, description, state, icon }. state is complete, current, upcoming or error; without it, value decides. icon replaces the marker\'s number or check.',
			],
			[
				'name'        => 'value',
				'type'        => 'number',
				'description' => 'The current step, from 1. Steps before it are complete and steps after it upcoming; a step\'s own state overrides that (error). Livewire binds it with wire:model, Vue with v-model.',
			],
			[
				'name'        => 'orientation',
				'type'        => 'enum',
				'values'      => [ 'horizontal', 'vertical' ],
				'default'     => 'horizontal',
				'description' => 'A row with connectors between the steps, or a column with the connector down the side and room for longer descriptions. Emitted as data-orientation.',
			],
			[
				'name'        => 'clickable',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Lets people go back to a completed step: its title becomes a button that reports value-change. Upcoming steps stay plain text.',
				'a11y'        => 'Only completed steps become buttons, so people can\'t skip ahead.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'description' => 'The list\'s accessible name, such as "Checkout progress".',
			],
			[
				'name'        => 'completeLabel',
				'type'        => 'string',
				'default'     => 'Completed',
				'description' => 'The visually hidden text in a complete step\'s marker, so the state isn\'t only a check icon. Translate it: Livewire defaults it through __( \'Completed\' ).',
			],
			[
				'name'        => 'errorLabel',
				'type'        => 'string',
				'default'     => 'Error',
				'description' => 'The visually hidden text in an error step\'s marker. Translate it: Livewire defaults it through __( \'Error\' ).',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, children included, such as { marker: \'…\', title: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'ol',
				'description' => 'The ordered list of steps. It is the spec\'s list part.',
			],
			[
				'name'        => 'step',
				'element'     => 'li',
				'description' => 'One step, with data-state complete, current, upcoming or error. The current step has aria-current="step".',
			],
			[
				'name'        => 'marker',
				'element'     => 'span',
				'description' => 'The circle: the step\'s number, a check when complete, an x on error, or its icon. Complete and error carry visually hidden text.',
			],
			[
				'name'        => 'title',
				'element'     => 'span | button',
				'description' => 'The step\'s name. A button on completed steps when clickable.',
			],
			[
				'name'        => 'connector',
				'element'     => 'span',
				'description' => 'The line to the next step, filled once the step is complete. Hidden from assistive technology and not drawn after the last step.',
			],
			[
				'name'        => 'description',
				'element'     => 'span',
				'description' => 'Supporting text under the title.',
			],
		],
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'A completed step was chosen while clickable. The payload is its number. Setting value doesn\'t fire it.',
				'payload'     => 'number',
			],
		],
		'a11y'        => [
			'element'      => 'ol',
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves through the completed steps\' buttons, when clickable. Otherwise Steps has no stops.',
				],
				[
					'keys'   => 'Enter / Space',
					'action' => 'Goes back to the focused completed step.',
				],
			],
			'requirements' => [ 'An ordered list, so the count and position are announced.', 'The current step has aria-current="step".', 'Complete and error steps carry visually hidden text (completeLabel, errorLabel), not only an icon.', 'Markers and connectors meet 3:1 against the surface; titles and descriptions 4.5:1.', 'Only completed steps are buttons when clickable; upcoming steps can\'t be reached.', 'Visible focus ring on :focus-visible.' ],
			'wcag'         => [ '1.3.1', '1.4.1', '1.4.3', '1.4.11', '2.1.1', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-color-primary', '--apui-color-primary-foreground', '--apui-color-primary-text', '--apui-color-primary-soft', '--apui-color-error-soft', '--apui-color-error-border', '--apui-color-error-soft-foreground', '--apui-color-error-text', '--apui-surface-default', '--apui-border-default', '--apui-border-muted', '--apui-border-width', '--apui-text-default', '--apui-text-muted', '--apui-type-body-sm-font-size', '--apui-type-body-sm-line-height', '--apui-type-caption-font-size', '--apui-type-caption-line-height', '--apui-font-weight-medium', '--apui-font-weight-semibold', '--apui-focus-ring-color', '--apui-focus-ring-offset-color' ],
		'fixture'     => [
			'props' => [
				'value' => 4,
				'steps' => [
					[
						'title'       => 'Basics',
						'description' => 'Title and type',
					],
					[
						'title'       => 'Location',
						'description' => 'Address and map',
					],
					[
						'title'       => 'Pricing',
						'description' => 'Price rejected',
						'state'       => 'error',
					],
					[
						'title'       => 'Photos',
						'description' => 'At least 6',
					],
					[
						'title'       => 'Review',
						'description' => 'Publish',
					],
				],
			],
		],
	],
	'Tabs'              => [
		'name'        => 'Tabs',
		'description' => 'Switches between views of the same content: a tablist of triggers and one panel per tab. Arrow keys move between tabs and follow the text direction; activation is automatic or manual.',
		'status'      => 'draft',
		'issue'       => 56,
		'rootClass'   => 'apui-tabs',
		'stacks'      => [
			'livewire' => [
				'name'         => 'tabs',
				'capabilities' => [ 'Children: tab, each rendering its trigger and its panel; tabs renders the same children from data', 'wire:model binds the selected tab\'s value' ],
			],
			'react'    => [
				'name'         => 'Tabs',
				'capabilities' => [ 'Children: Tab, each rendering its trigger and its panel; tabs renders the same children from data' ],
			],
			'vue'      => [
				'name'         => 'Tabs',
				'capabilities' => [ 'Children: Tab, each rendering its trigger and its panel; tabs renders the same children from data' ],
			],
		],
		'props'       => [
			[
				'name'        => 'value',
				'type'        => 'string',
				'description' => 'The selected tab\'s value. Livewire binds it with wire:model, Vue with v-model. Without it, the first enabled tab is selected.',
			],
			[
				'name'        => 'defaultValue',
				'type'        => 'string',
				'description' => 'The initially selected tab of uncontrolled tabs.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'tabs',
				'type'        => 'array',
				'description' => 'The tabs as data, rendering the same children as composition: { value, label, icon, count, disabled, content }.',
			],
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'segmented', 'underline' ],
				'default'     => 'segmented',
				'description' => 'Segmented for filters and small view switches, underline under a PageHeader. Emitted as data-variant.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md' ],
				'default'     => 'md',
				'description' => 'The triggers\' size. Emitted as data-size.',
			],
			[
				'name'        => 'orientation',
				'type'        => 'enum',
				'values'      => [ 'horizontal', 'vertical' ],
				'default'     => 'horizontal',
				'description' => 'Lays the tablist out in a row or a column, and picks the arrow keys that move between tabs. Emitted as data-orientation.',
			],
			[
				'name'        => 'activationMode',
				'type'        => 'enum',
				'values'      => [ 'automatic', 'manual' ],
				'default'     => 'automatic',
				'description' => 'Automatic selects a tab as the arrow keys reach it; manual only moves focus, and Enter or Space selects. Emitted as data-activation-mode.',
				'a11y'        => 'Use manual when showing a panel is slow, such as a server round trip.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'description' => 'Names the tablist for assistive technology. Needed when a page has more than one set of tabs.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { list: \'…\', trigger: \'…\' }.',
			],
		],
		'variants'    => [ 'segmented', 'underline' ],
		'sizes'       => [ 'sm', 'md' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'Holds the tablist and the panels.',
			],
			[
				'name'        => 'list',
				'element'     => 'div',
				'description' => 'The tablist: the track the triggers sit in.',
			],
			[
				'name'        => 'trigger',
				'element'     => 'button',
				'description' => 'A tab: role tab, aria-selected while selected, and only the selected one in the Tab order.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'A tab\'s leading icon.',
			],
			[
				'name'        => 'count',
				'element'     => 'span',
				'description' => 'A tab\'s count, such as unread items, at the end of the trigger.',
			],
			[
				'name'        => 'content',
				'element'     => 'div',
				'description' => 'A tab\'s panel: role tabpanel, labelled by its trigger and hidden while another tab is selected. The spec calls it panel; it keeps Zag\'s name (D-019).',
			],
		],
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'Another tab was selected, by click or the keyboard. Setting value doesn\'t fire it.',
				'payload'     => 'string',
			],
		],
		'a11y'        => [
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'ArrowRight, ArrowLeft',
					'action' => 'Horizontal tabs: move to the next or previous tab, wrapping, and following the text direction, so in RTL ArrowLeft moves to the next tab. Automatic activation selects it too.',
				],
				[
					'keys'   => 'ArrowDown, ArrowUp',
					'action' => 'Vertical tabs: move to the next or previous tab, wrapping.',
				],
				[
					'keys'   => 'Home, End',
					'action' => 'Move to the first or last tab.',
				],
				[
					'keys'   => 'Enter, Space',
					'action' => 'Manual activation: selects the focused tab.',
				],
				[
					'keys'   => 'Tab',
					'action' => 'From the selected tab, moves into its panel; the other tabs are out of the Tab order.',
				],
			],
			'requirements' => [ 'role=tablist with role=tab triggers and role=tabpanel panels; the selected trigger sets aria-selected=true and aria-controls its panel.', 'Each panel is labelled by its trigger with aria-labelledby and is hidden while another tab is selected.', 'Only the selected tab is in the Tab order (roving tabindex); the panel takes focus next.', 'Disabled tabs set disabled and aria-disabled and are skipped by the arrow keys.', 'The tablist sets aria-orientation; the arrow keys follow it, and follow the text direction in RTL.', 'A tablist on a page with several sets of tabs is named with label.', 'A count in a trigger is part of its name, so screen readers announce it.', 'The focus ring shows on the focused trigger; the selected trigger is shown by surface and edge, not by color alone.', 'Every part keeps a stable, server-rendered id in Livewire (D-015).' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.3', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-tabs-radius', '--apui-surface-sunken', '--apui-surface-raised', '--apui-border-muted', '--apui-selected-indicator-width', '--apui-color-primary', '--apui-color-primary-soft', '--apui-color-primary-soft-foreground', '--apui-color-neutral-soft', '--apui-color-neutral-soft-foreground', '--apui-control-height-sm', '--apui-control-height-md', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'tabs' => [
					[
						'value'   => 'overview',
						'label'   => 'Overview',
						'icon'    => 'list',
						'content' => 'Your portfolio at a glance.',
					],
					[
						'value'   => 'notifications',
						'label'   => 'Notifications',
						'count'   => '4',
						'content' => 'Four unread notifications.',
					],
					[
						'value'   => 'history',
						'label'   => 'Trade history',
						'content' => 'Every trade in the last year.',
					],
					[
						'value'    => 'archived',
						'label'    => 'Archived',
						'disabled' => true,
						'content'  => 'Archived trades.',
					],
				],
			],
			'states' => [],
		],
	],
	'Textarea'          => [
		'name'        => 'Textarea',
		'description' => 'Multi-line text entry. It shares Input\'s field anatomy (label, box, hint, error) and adds an optional character counter.',
		'status'      => 'draft',
		'issue'       => 53,
		'rootClass'   => 'apui-textarea',
		'stacks'      => [
			'livewire' => [
				'name' => 'textarea',
			],
			'react'    => [
				'name' => 'Textarea',
			],
			'vue'      => [
				'name' => 'Textarea',
			],
		],
		'props'       => [
			[
				'name'        => 'rows',
				'type'        => 'number',
				'default'     => 4,
				'description' => 'Visible lines of text. With autoResize, the minimum.',
			],
			[
				'name'        => 'maxLength',
				'type'        => 'number',
				'description' => 'The most characters allowed. Sets maxlength on the control and shows the counter.',
				'a11y'        => 'The counter is aria-hidden; a polite live region announces the characters left only near the limit.',
			],
			[
				'name'        => 'autoResize',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Grows the box with its content (CSS field-sizing). Emitted as data-auto-resize.',
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The visible label, linked to the control.',
			],
			[
				'name'        => 'hint',
				'type'        => 'node',
				'description' => 'Help text under the box, linked with aria-describedby.',
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
				'description' => 'The initial value of an uncontrolled textarea.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'remainingLabel',
				'type'        => 'string',
				'default'     => 'Characters left: {count}',
				'description' => 'The counter\'s announcement near the limit. {count} is replaced with the characters left. Livewire translates the default.',
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
				'description' => 'The bordered box around the control and the counter.',
			],
			[
				'name'        => 'control',
				'element'     => 'textarea',
				'description' => 'The native textarea. Attributes other than class land here.',
			],
			[
				'name'        => 'count',
				'element'     => 'span',
				'description' => 'The counter, such as 118 / 500, at the end of the box. Shown with maxLength.',
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
					'action' => 'Moves focus to the control; typing edits the value and Enter adds a line.',
				],
			],
			'requirements' => [ 'The label is always visible and linked with for/id; a placeholder never replaces it.', 'Hint and error are linked to the control with aria-describedby.', 'Invalid sets aria-invalid on the control; the error is text, never color alone.', 'The counter is aria-hidden. A polite live region announces the characters left once within 10% of the limit (at least 10), never on every keystroke.', 'Class goes to the root; every other attribute (wire:model, name, autocomplete) goes to the control.', 'Disabled uses --apui-surface-sunken and --apui-text-disabled, never opacity alone.', 'Visible focus ring on the box while the control has :focus-visible.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.7', '3.3.1', '3.3.2', '4.1.2', '4.1.3' ],
		],
		'tokens'      => [ '--apui-input-radius', '--apui-border-default', '--apui-border-strong', '--apui-border-muted', '--apui-color-error-border', '--apui-color-error-text', '--apui-surface-default', '--apui-surface-sunken', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'label'       => 'Description',
				'placeholder' => 'Describe the property, nearby amenities and anything renters should know…',
				'maxLength'   => 500,
			],
			'parts'  => [
				'required' => true,
				'hint'     => 'Shown on the listing page.',
				'error'    => 'Write at least 40 characters.',
			],
			'states' => [ 'hover', 'focus-visible', 'disabled', 'invalid', 'readonly' ],
		],
	],
	'Toast'             => [
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
	'Toggle'            => [
		'name'        => 'Toggle',
		'description' => 'A switch for settings that take effect immediately: a native checkbox with role=switch in Checkbox\'s field anatomy.',
		'status'      => 'draft',
		'issue'       => 53,
		'rootClass'   => 'apui-toggle',
		'stacks'      => [
			'livewire' => [
				'name' => 'toggle',
			],
			'react'    => [
				'name' => 'Toggle',
			],
			'vue'      => [
				'name' => 'Toggle',
			],
		],
		'props'       => [
			[
				'name'        => 'checked',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Whether it\'s on. Livewire binds it with wire:model, Vue with v-model:checked. Emitted as data-state.',
			],
			[
				'name'        => 'defaultChecked',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'The initial state of an uncontrolled toggle.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md', 'lg' ],
				'default'     => 'md',
				'description' => 'Track size. Emitted as data-size.',
			],
			[
				'name'        => 'color',
				'type'        => 'enum',
				'values'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
				'default'     => 'primary',
				'description' => 'The track color when on. Emitted as data-color.',
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The visible label, linked to the control. Name the setting, not the state.',
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
				'description' => 'Marks it required.',
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
				'description' => 'Extra classes per part, such as { track: \'…\', label: \'…\' }.',
			],
		],
		'colors'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
		'sizes'       => [ 'sm', 'md', 'lg' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The track, label, description and error.',
			],
			[
				'name'        => 'track',
				'element'     => 'span',
				'description' => 'The pill. The native control covers it.',
			],
			[
				'name'        => 'control',
				'element'     => 'input',
				'description' => 'The native checkbox with role=switch, transparent over the track with a 6px larger hit area. Attributes other than class land here.',
			],
			[
				'name'        => 'thumb',
				'element'     => 'span',
				'description' => 'The knob; it moves to the end when on.',
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
				'description' => 'The toggle turned on or off.',
				'payload'     => 'boolean',
			],
		],
		'a11y'        => [
			'keyboard'     => [
				[
					'keys'   => 'Space',
					'action' => 'Turns it on or off.',
				],
			],
			'requirements' => [ 'A native input type=checkbox with role=switch stays in the DOM over the track, so the platform handles keyboard and screen readers.', 'The label is linked with for/id; description and error with aria-describedby.', 'Off keeps a 3:1 outline (--apui-border-default) so the control is visible without color; on fills with the color.', 'The thumb moves toward the logical end, so it mirrors under RTL.', 'Thumb motion is removed under prefers-reduced-motion.', 'Disabled uses --apui-surface-sunken and --apui-text-disabled, never opacity alone.', 'Visible focus ring on the track while the control has :focus-visible.', 'Use Checkbox, not Toggle, in forms that need a submit.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.7', '2.5.8', '3.3.2', '4.1.2' ],
		],
		'tokens'      => [ '--apui-radius-full', '--apui-color-primary', '--apui-color-primary-foreground', '--apui-surface-sunken', '--apui-border-default', '--apui-border-strong', '--apui-border-muted', '--apui-color-error-border', '--apui-color-error-text', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'label' => 'Dark mode',
			],
			'parts'  => [
				'description' => 'Follows your system setting when off.',
				'error'       => 'Ask your admin to turn this on.',
			],
			'states' => [ 'hover', 'focus-visible', 'checked', 'disabled', 'invalid' ],
		],
	],
	'ValidationSummary' => [
		'name'        => 'ValidationSummary',
		'description' => 'Lists every error in a form after a failed submit, each linked to its field. Livewire reads Laravel\'s error bag; React and Vue take an errors prop. It is not ErrorState.',
		'status'      => 'draft',
		'issue'       => 53,
		'rootClass'   => 'apui-validation-summary',
		'stacks'      => [
			'livewire' => [
				'name' => 'validation-summary',
			],
			'react'    => [
				'name' => 'ValidationSummary',
			],
			'vue'      => [
				'name' => 'ValidationSummary',
			],
		],
		'props'       => [
			[
				'name'        => 'errors',
				'type'        => 'array',
				'description' => 'The errors: [{ field, message }], or a map of field to message(s). field is the control\'s id or name. Livewire defaults to the first message of every key in $errors. Renders nothing when empty.',
			],
			[
				'name'        => 'only',
				'type'        => 'array',
				'description' => 'The fields ($errors keys) to list, in order. Defaults to every one.',
				'stacks'      => [ 'livewire' ],
			],
			[
				'name'        => 'color',
				'type'        => 'enum',
				'values'      => [ 'error', 'warning' ],
				'default'     => 'error',
				'description' => 'Error blocks the submit and is an alert; warning lists non-blocking recommendations and is a status. Emitted as data-color.',
			],
			[
				'name'        => 'title',
				'type'        => 'node',
				'description' => 'The heading. Defaults to Fix 1 field / Fix N fields (error) or 1 recommendation / N recommendations (warning); Livewire translates the defaults.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { title: \'…\', list: \'…\' }.',
			],
		],
		'colors'      => [ 'error', 'warning' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The panel: icon, title and list. Focusable (tabindex=-1), and focused when it appears.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'circle-alert for errors, triangle-alert for warnings (aria-hidden).',
			],
			[
				'name'        => 'title',
				'element'     => 'p',
				'description' => 'The heading, with the count.',
			],
			[
				'name'        => 'list',
				'element'     => 'ul',
				'description' => 'The errors.',
			],
			[
				'name'        => 'item',
				'element'     => 'li',
				'description' => 'One error.',
			],
			[
				'name'        => 'link',
				'element'     => 'a',
				'description' => 'The message, linking to #field; activating it moves focus to the field.',
			],
		],
		'slots'       => [
			[
				'name'        => 'title',
				'description' => 'Rich heading content.',
			],
		],
		'a11y'        => [
			'role'         => 'alert',
			'roles'        => [ 'status' ],
			'requirements' => [ 'Rendered at the top of the form after a failed submit, focused (tabindex=-1) and role=alert; warnings use role=status and aren\'t focused.', 'Each link moves focus to its field: the element with that id, else the control with that name or wire:model.', 'Fields keep their own inline errors, with the same wording.', 'Don\'t show it before the first submit.', 'The color is never the only signal: the title says how many fields to fix.' ],
			'wcag'         => [ '1.3.1', '1.4.1', '1.4.3', '2.4.3', '3.3.1', '3.3.3', '4.1.3' ],
		],
		'tokens'      => [ '--apui-alert-radius', '--apui-color-error-soft', '--apui-color-error-soft-foreground', '--apui-color-error-border', '--apui-color-warning-soft', '--apui-color-warning-soft-foreground', '--apui-color-warning-border', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'errors' => [
					[
						'field'   => 'postal-code',
						'message' => 'Spanish postal codes have 5 digits.',
					],
					[
						'field'   => 'photos',
						'message' => 'Add at least 2 more photos.',
					],
					[
						'field'   => 'terms',
						'message' => 'Accept the listing terms.',
					],
				],
			],
			'parts'  => [],
			'states' => [],
		],
	],
];
