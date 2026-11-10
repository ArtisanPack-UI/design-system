<?php

/**
 * Generated from packages/manifest/components/*.json. Do not edit; run `npm run manifest`.
 *
 * @package ArtisanPack_UI
 */

return [
	'Button' => [
		'name'        => 'Button',
		'description' => 'Triggers an action. The one solid primary Button marks the main action of a view.',
		'status'      => 'planned',
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
				'description' => 'Shows the spinner and keeps the button\'s width.',
				'a11y'        => 'Sets aria-busy and keeps the label for screen readers.',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables the button.',
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
				'description' => 'The button text.',
			],
			[
				'name'        => 'spinner',
				'element'     => 'span',
				'description' => 'Loading indicator, shown while loading.',
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
		'tokens'      => [ '--apui-button-radius', '--apui-button-weight', '--apui-control-height-xs', '--apui-control-height-sm', '--apui-control-height-md', '--apui-control-height-lg', '--apui-control-height-xl', '--apui-state-hover', '--apui-state-pressed', '--apui-focus-ring-color', '--apui-target-size-min' ],
		'fixture'     => [
			'content' => 'Button',
			'parts'   => [
				'loading'      => true,
				'leadingIcon'  => 'plus',
				'trailingIcon' => 'arrow-right',
			],
		],
	],
];
