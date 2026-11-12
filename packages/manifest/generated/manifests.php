<?php

/**
 * Generated from packages/manifest/components/*.json. Do not edit; run `npm run manifest`.
 *
 * @package ArtisanPack_UI
 */

return [
	'Accordion'         => [
		'name'        => 'Accordion',
		'description' => 'Stacked sections that expand and collapse: each item is a heading holding a button that shows or hides its panel. One item open at a time, or several with multiple.',
		'status'      => 'draft',
		'issue'       => 58,
		'rootClass'   => 'apui-accordion',
		'stacks'      => [
			'livewire' => [
				'name'         => 'accordion',
				'capabilities' => [ 'Children: accordion-item, each rendering its heading, trigger and panel; items renders the same children from data', 'wire:model binds the open items\' values' ],
			],
			'react'    => [
				'name'         => 'Accordion',
				'capabilities' => [ 'Children: AccordionItem, each rendering its heading, trigger and panel; items renders the same children from data' ],
			],
			'vue'      => [
				'name'         => 'Accordion',
				'capabilities' => [ 'Children: AccordionItem, each rendering its heading, trigger and panel; items renders the same children from data' ],
			],
		],
		'props'       => [
			[
				'name'        => 'value',
				'type'        => 'array',
				'description' => 'The open items\' values. Livewire binds it with wire:model, Vue with v-model. Setting it doesn\'t fire value-change.',
			],
			[
				'name'        => 'defaultValue',
				'type'        => 'array',
				'description' => 'The items open at first in an uncontrolled accordion. The spec\'s defaultOpen.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'items',
				'type'        => 'array',
				'description' => 'The items as data, rendering the same children as composition: { value, title, content, disabled }.',
			],
			[
				'name'        => 'multiple',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Lets several items be open at once. Off, opening an item closes the others. The spec\'s type: single · multiple. Emitted as data-multiple.',
			],
			[
				'name'        => 'collapsible',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Lets the open item of a single accordion close, leaving none open. Emitted as data-collapsible.',
			],
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'default', 'separated', 'flush' ],
				'default'     => 'default',
				'description' => 'Default is one container with edges between items, separated gives each item its own container, and flush drops the container for use inside a card or page. Emitted as data-variant.',
			],
			[
				'name'        => 'headingLevel',
				'type'        => 'number',
				'default'     => 3,
				'description' => 'The level of each item\'s heading, h2 to h6, so the accordion fits the page\'s outline.',
				'a11y'        => 'Pick the level below the heading the accordion sits under.',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables every item: the triggers can\'t be focused or toggled. An item can also be disabled on its own.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { item: \'…\', trigger: \'…\' }.',
			],
		],
		'variants'    => [ 'default', 'separated', 'flush' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'Holds the items.',
			],
			[
				'name'        => 'item',
				'element'     => 'div',
				'description' => 'One section: its title and its panel. data-state is open or closed.',
			],
			[
				'name'        => 'title',
				'element'     => 'h2 | h3 | h4 | h5 | h6',
				'description' => 'The heading around the trigger, at headingLevel. The spec calls it heading; title is the vocabulary\'s name.',
			],
			[
				'name'        => 'trigger',
				'element'     => 'button',
				'description' => 'The button that toggles the item: aria-expanded, and aria-controls its panel. Zag\'s itemTrigger, named as the spec does.',
			],
			[
				'name'        => 'chevron',
				'element'     => 'span',
				'description' => 'The chevron at the trigger\'s end. It points down and turns up while the item is open. Zag\'s itemIndicator.',
			],
			[
				'name'        => 'content',
				'element'     => 'div',
				'description' => 'The item\'s panel: role region, labelled by its trigger and hidden while closed. The spec calls it panel; Zag\'s itemContent, named content as in Tabs (D-019).',
			],
		],
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'An item opened or closed, by click or the keyboard. Setting value doesn\'t fire it.',
				'payload'     => 'string[]',
			],
		],
		'a11y'        => [
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Enter, Space',
					'action' => 'Opens or closes the focused item.',
				],
				[
					'keys'   => 'Tab, Shift+Tab',
					'action' => 'Moves through the triggers and into an open panel\'s content.',
				],
				[
					'keys'   => 'ArrowDown, ArrowUp',
					'action' => 'Moves to the next or previous trigger, skipping disabled items.',
				],
				[
					'keys'   => 'Home, End',
					'action' => 'Moves to the first or last trigger.',
				],
			],
			'requirements' => [ 'Each trigger is a button inside a heading (headingLevel), with aria-expanded and aria-controls pointing at its panel.', 'Each panel is role=region, labelled by its trigger, and hidden while its item is closed.', 'Disabled items set disabled on the trigger and are skipped by the arrow keys.', 'The chevron is aria-hidden; the open state is in aria-expanded, not in the icon alone.', 'Don\'t hide required form fields in collapsed items.', 'The focus ring shows on the focused trigger, inset so the container doesn\'t clip it.', 'Every part keeps a stable, server-rendered id in Livewire (D-015).' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.3', '2.4.6', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-radius-lg', '--apui-border-width', '--apui-border-muted', '--apui-surface-default', '--apui-panel-padding', '--apui-state-hover', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-motion-duration-fast', '--apui-motion-ease-standard', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'value' => [ 'live' ],
				'items' => [
					[
						'value'   => 'live',
						'title'   => 'How long does a listing stay live?',
						'content' => 'Listings stay live until you archive them or mark them as sold. Drafts are kept for 90 days.',
					],
					[
						'value'   => 'owners',
						'title'   => 'Can co-owners edit a listing?',
						'content' => 'Yes. Invite them from the listing\'s Sharing tab.',
					],
					[
						'value'    => 'files',
						'title'    => 'Which file types can I upload?',
						'content'  => 'Images, PDFs and floor plans up to 20 MB each.',
						'disabled' => true,
					],
				],
			],
			'states' => [],
		],
	],
	'Alert'             => [
		'name'        => 'Alert',
		'description' => 'An inline message about the state of a page or section: what happened and what to do next. The tint and the status icon carry the meaning, so it never relies on color alone. A dismissible alert hides itself when its close button is pressed.',
		'status'      => 'draft',
		'issue'       => 60,
		'rootClass'   => 'apui-alert',
		'stacks'      => [
			'livewire' => [
				'name' => 'alert',
			],
			'react'    => [
				'name' => 'Alert',
			],
			'vue'      => [
				'name' => 'Alert',
			],
		],
		'props'       => [
			[
				'name'        => 'title',
				'type'        => 'node',
				'description' => 'The headline: what happened.',
			],
			[
				'name'        => 'description',
				'type'        => 'node',
				'description' => 'Supporting text: what to do next. The default slot (children) fills it too.',
			],
			[
				'name'        => 'color',
				'type'        => 'enum',
				'values'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
				'default'     => 'neutral',
				'description' => 'The status. Emitted as data-color. error makes the alert role=alert.',
				'a11y'        => 'error sets role=alert, announced at once; every other color is role=status.',
			],
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'soft', 'outline', 'solid' ],
				'default'     => 'soft',
				'description' => 'soft tints the background; outline suits dense forms; solid is for page-level failures that block work. Emitted as data-variant.',
			],
			[
				'name'        => 'surface',
				'type'        => 'enum',
				'values'      => [ 'default', 'glass' ],
				'default'     => 'default',
				'description' => 'The alert\'s surface. Emitted as data-surface. Glass keeps default text and tints only the icon; it falls back to the raised surface under reduced transparency and in high contrast.',
			],
			[
				'name'        => 'icon',
				'type'        => 'string',
				'description' => 'An icon name from the registry. Defaults to the color\'s status icon: circle-check, triangle-alert, circle-alert or info. A slot or node overrides it.',
			],
			[
				'name'        => 'actions',
				'type'        => 'node',
				'description' => 'Buttons under the text, such as Upgrade or Update card.',
			],
			[
				'name'        => 'dismissible',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Adds a close button. Pressing it hides the alert (the hidden attribute) and reports open-change.',
			],
			[
				'name'        => 'closeLabel',
				'type'        => 'string',
				'default'     => 'Dismiss',
				'description' => 'The close button\'s accessible name. Translate it: Livewire defaults it through __( \'Dismiss\' ).',
				'a11y'        => 'The close button is icon-only, so this is its only name.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { title: \'…\', actions: \'…\' }.',
			],
		],
		'variants'    => [ 'soft', 'outline', 'solid' ],
		'colors'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The alert: role=status, or role=alert for errors.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'The status icon, hidden from assistive technology.',
			],
			[
				'name'        => 'title',
				'element'     => 'p',
				'description' => 'The headline.',
			],
			[
				'name'        => 'description',
				'element'     => 'div',
				'description' => 'Supporting text. A div, so it can hold a list or links.',
			],
			[
				'name'        => 'actions',
				'element'     => 'div',
				'description' => 'The action buttons.',
			],
			[
				'name'        => 'closeTrigger',
				'element'     => 'button',
				'description' => 'The close button: a ghost, neutral, extra-small icon-only Button in the alert\'s text color.',
			],
		],
		'slots'       => [
			[
				'name'        => 'icon',
				'description' => 'Overrides the icon.',
			],
			[
				'name'        => 'title',
				'description' => 'Rich headline content.',
			],
			[
				'name'        => 'description',
				'description' => 'Rich supporting text. The default slot fills it too.',
			],
			[
				'name'        => 'actions',
				'description' => 'The action buttons.',
			],
		],
		'events'      => [
			[
				'name'        => 'open-change',
				'description' => 'The close button was pressed. The alert hides itself; the payload is false.',
				'payload'     => 'boolean',
			],
		],
		'a11y'        => [
			'role'         => 'status',
			'roles'        => [ 'alert' ],
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves through the actions and the close button.',
				],
				[
					'keys'   => 'Enter / Space',
					'action' => 'On the close button, dismisses the alert.',
				],
			],
			'requirements' => [ 'role=alert for errors, role=status otherwise, so a blocking failure is announced at once and the rest politely.', 'Meaning is carried by the icon and the title, not by color alone; the icon is decorative (aria-hidden).', 'The close button has an accessible name (translatable, "Dismiss").', 'Text keeps 4.5:1 on the soft, outline, solid and glass treatments in every theme; in high contrast the soft alert carries an edge.', 'No colored side border; status comes from the tint and the icon.', 'The icon, the actions and the close button sit at the start and end in the reading direction, and mirror in RTL.' ],
			'wcag'         => [ '1.3.1', '1.4.1', '1.4.3', '1.4.11', '2.1.1', '2.4.7', '4.1.2', '4.1.3' ],
		],
		'tokens'      => [ '--apui-alert-radius', '--apui-color-primary-soft', '--apui-color-primary-soft-foreground', '--apui-color-primary-border', '--apui-color-primary-text', '--apui-color-primary', '--apui-color-primary-foreground', '--apui-surface-default', '--apui-surface-glass', '--apui-surface-glass-border', '--apui-border-muted', '--apui-text-default', '--apui-text-muted', '--apui-text-muted-glass', '--apui-elevation-glass' ],
		'fixture'     => [
			'props'  => [
				'title'       => 'Listing published',
				'description' => 'Lakeview Lofts is live and visible in search.',
				'dismissible' => true,
			],
			'parts'  => [
				'actions' => 'Update card',
			],
			'states' => [],
		],
	],
	'AppShell'          => [
		'name'        => 'AppShell',
		'description' => 'The application frame: a sidebar and a main column (an optional top bar, then the content) as islands separated by a gutter. The sidebar holds a brand, the navigation (a Menu) and a footer, and can collapse to icons. Replaces Livewire\'s main and the React and Vue Sidebar.',
		'status'      => 'draft',
		'issue'       => 58,
		'rootClass'   => 'apui-app-shell',
		'stacks'      => [
			'livewire' => [
				'name'         => 'app-shell',
				'capabilities' => [ 'Slots: brand, sidebar, header and footer; the default slot is the content', 'wire:model binds collapsed; without it, the collapsed state is kept in the session (the 2.x toggle route)' ],
			],
			'react'    => [
				'name' => 'AppShell',
			],
			'vue'      => [
				'name'         => 'AppShell',
				'capabilities' => [ 'Slots: brand, sidebar, header and footer; the default slot is the content' ],
			],
		],
		'props'       => [
			[
				'name'        => 'collapsed',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Shrinks the sidebar to its icons: a Menu inside shows icon-only items, their labels kept for screen readers. Emitted as data-collapsed. Livewire binds it with wire:model.',
			],
			[
				'name'        => 'collapsible',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Adds the button at the foot of the sidebar that collapses and expands it. Emitted as data-collapsible.',
			],
			[
				'name'        => 'sidebarWidth',
				'type'        => 'string',
				'description' => 'The expanded sidebar\'s width, any CSS length. Sets --apui-sidebar-width on the root (default 248px).',
			],
			[
				'name'        => 'gutter',
				'type'        => 'string',
				'description' => 'The space around and between the islands, any CSS length. Sets --apui-shell-gutter on the root (default 12px).',
			],
			[
				'name'        => 'brand',
				'type'        => 'node',
				'description' => 'The brand at the top of the sidebar: a logo or mark and the product name, usually a link home.',
			],
			[
				'name'        => 'sidebar',
				'type'        => 'node',
				'description' => 'The sidebar\'s navigation, usually a Menu: 5 to 8 top-level items, the rest under section titles.',
			],
			[
				'name'        => 'header',
				'type'        => 'node',
				'description' => 'The bar at the top of the main column, usually a Navbar with layout island.',
			],
			[
				'name'        => 'footer',
				'type'        => 'node',
				'description' => 'The foot of the sidebar: the signed-in account and its actions.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'default'     => 'Sidebar',
				'description' => 'Names the sidebar\'s complementary landmark. Livewire translates the default with __().',
			],
			[
				'name'        => 'skipLabel',
				'type'        => 'string',
				'default'     => 'Skip to main content',
				'description' => 'The skip link\'s text. Livewire translates the default with __().',
			],
			[
				'name'        => 'collapseLabel',
				'type'        => 'string',
				'default'     => 'Collapse sidebar',
				'description' => 'Names the collapse button, which is aria-pressed while the sidebar is collapsed. Livewire translates the default with __().',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { sidebar: \'…\', content: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The frame: a grid of the sidebar and the main column on the page surface.',
			],
			[
				'name'        => 'skipLink',
				'element'     => 'a',
				'description' => 'The first focusable element: a link to the main column, hidden until focused.',
			],
			[
				'name'        => 'sidebar',
				'element'     => 'aside',
				'description' => 'The sidebar island, a complementary landmark named with label. It moves to the inline end in RTL.',
			],
			[
				'name'        => 'brand',
				'element'     => 'div',
				'description' => 'The brand at the top of the sidebar.',
			],
			[
				'name'        => 'footer',
				'element'     => 'div',
				'description' => 'The foot of the sidebar, separated by an edge: the account, and the collapse button.',
			],
			[
				'name'        => 'collapseTrigger',
				'element'     => 'button',
				'description' => 'Collapses and expands the sidebar: aria-pressed while collapsed, named with collapseLabel. Its icon mirrors in RTL.',
			],
			[
				'name'        => 'main',
				'element'     => 'main',
				'description' => 'The main landmark, the skip link\'s target: the header, then the content.',
			],
			[
				'name'        => 'content',
				'element'     => 'div',
				'description' => 'The page\'s content under the header: a column of panels with the panel gap.',
			],
		],
		'slots'       => [
			[
				'name'        => 'brand',
				'description' => 'The brand at the top of the sidebar.',
			],
			[
				'name'        => 'sidebar',
				'description' => 'The navigation, usually a Menu.',
			],
			[
				'name'        => 'header',
				'description' => 'The top bar of the main column.',
			],
			[
				'name'        => 'footer',
				'description' => 'The foot of the sidebar.',
			],
		],
		'events'      => [
			[
				'name'        => 'collapsed-change',
				'description' => 'The collapse button collapsed or expanded the sidebar. Setting collapsed doesn\'t fire it.',
				'payload'     => 'boolean',
			],
		],
		'a11y'        => [
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'The skip link comes first and shows while focused; Enter on it moves focus to the main landmark.',
				],
				[
					'keys'   => 'Enter, Space',
					'action' => 'On the collapse button: collapses or expands the sidebar.',
				],
			],
			'requirements' => [ 'The sidebar is an aside (complementary landmark) named with label; the content is a main landmark.', 'A skip link to the main landmark is the first focusable element.', 'The current navigation item uses aria-current=page (Menu).', 'Collapsed, the sidebar\'s Menu items show only their icons; their labels stay in the accessibility tree.', 'The collapse button is aria-pressed while collapsed, and named with collapseLabel.', 'Layout uses logical properties, so the sidebar sits at the inline end in RTL; on a narrow viewport the islands stack.', 'Keep 5 to 8 top-level items; group the rest under section titles.' ],
			'wcag'         => [ '1.3.1', '1.3.2', '1.4.10', '1.4.11', '2.1.1', '2.4.1', '2.4.3', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-sidebar-width', '--apui-sidebar-width-collapsed', '--apui-shell-gutter', '--apui-panel-gap', '--apui-radius-lg', '--apui-border-width', '--apui-border-muted', '--apui-surface-page', '--apui-surface-default', '--apui-selected-bg', '--apui-state-hover', '--apui-control-height-sm', '--apui-text-default', '--apui-text-muted', '--apui-focus-ring-color' ],
		'fixture'     => [
			'content' => 'Page content',
			'props'   => [
				'brand'       => 'Apexify',
				'sidebar'     => 'Navigation',
				'header'      => 'Top bar',
				'footer'      => 'Olivia Rhye',
				'collapsible' => true,
			],
			'states'  => [],
		],
	],
	'Avatar'            => [
		'name'        => 'Avatar',
		'description' => 'A person or organization as an image, initials or an icon. Without an image it shows the initials of name in a color picked from a stable hash of the name; without a name, an icon. An image sits over the initials, so a broken image falls back to them.',
		'status'      => 'draft',
		'issue'       => 61,
		'rootClass'   => 'apui-avatar',
		'stacks'      => [
			'livewire' => [
				'name'         => 'avatar',
				'capabilities' => [ 'Group: avatar-group overlaps a row of avatars, from avatar children or avatars data with max', 'The 2.x image and placeholder attributes still map to src and name, deprecated' ],
			],
			'react'    => [
				'name'         => 'Avatar',
				'capabilities' => [ 'Group: AvatarGroup overlaps a row of avatars, from Avatar children or avatars data with max' ],
			],
			'vue'      => [
				'name'         => 'Avatar',
				'capabilities' => [ 'Group: AvatarGroup overlaps a row of avatars, from Avatar children or avatars data with max' ],
			],
		],
		'props'       => [
			[
				'name'        => 'name',
				'type'        => 'string',
				'description' => 'The person\'s or organization\'s full name. It gives the initials (first and last word), the accessible name and the hashed color.',
				'a11y'        => 'Names the role=img root. Without name or alt the avatar is decorative and aria-hidden.',
			],
			[
				'name'        => 'src',
				'type'        => 'string',
				'description' => 'The image URL. Only relative, http, https and data:image URLs are used. It covers the initials, which show through when it fails to load.',
			],
			[
				'name'        => 'alt',
				'type'        => 'string',
				'description' => 'The accessible name when it should differ from name, such as "Apexify logo".',
			],
			[
				'name'        => 'initials',
				'type'        => 'string',
				'description' => 'Overrides the initials taken from name, such as "+4" for an overflow avatar.',
			],
			[
				'name'        => 'icon',
				'type'        => 'string',
				'description' => 'Icon name shown instead of initials, resolved through the icon registry. Without a name or initials the avatar shows user.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'xs', 'sm', 'md', 'lg', 'xl' ],
				'default'     => 'md',
				'description' => 'Matches the control heights: 24, 28, 36, 44 or 52px. Emitted as data-size.',
			],
			[
				'name'        => 'shape',
				'type'        => 'enum',
				'values'      => [ 'circle', 'square' ],
				'default'     => 'circle',
				'description' => 'circle for people, square for organizations and workspaces. Emitted as data-shape.',
			],
			[
				'name'        => 'color',
				'type'        => 'enum',
				'values'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
				'description' => 'The initials\' tone. Defaults to a color picked from a stable hash of name (sum of its code points over primary, secondary, accent, success, warning, error and info), and neutral without a name. Emitted as data-color.',
			],
			[
				'name'        => 'status',
				'type'        => 'enum',
				'values'      => [ 'online', 'away', 'offline' ],
				'description' => 'A presence dot at the end corner. Emitted on the status part as data-status.',
				'a11y'        => 'Also announced in the accessible name through statusLabel, so color is not the only signal.',
			],
			[
				'name'        => 'statusLabel',
				'type'        => 'string',
				'description' => 'The words for the status, added to the accessible name: "Olivia Rhye (Online)". Defaults to Online, Away or Offline; translate it. Livewire defaults it through __().',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { image: \'…\' }.',
			],
		],
		'sizes'       => [ 'xs', 'sm', 'md', 'lg', 'xl' ],
		'colors'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'span',
				'description' => 'The avatar, role=img with the person\'s name.',
			],
			[
				'name'        => 'image',
				'element'     => 'img',
				'description' => 'The image, over the initials. Decorative (alt=""): the root carries the name.',
			],
			[
				'name'        => 'initials',
				'element'     => 'span',
				'description' => 'Up to two letters from name, or initials. Decorative.',
			],
			[
				'name'        => 'status',
				'element'     => 'span',
				'description' => 'The presence dot. Decorative; the status is in the accessible name.',
			],
		],
		'slots'       => [],
		'events'      => [],
		'a11y'        => [
			'role'         => 'img',
			'element'      => 'span',
			'requirements' => [ 'The root is role=img named by alt or name, plus the status in words; the image, initials, icon and dot inside it are decorative.', 'Without a name or alt the avatar is decorative: aria-hidden, no role.', 'Initials keep 4.5:1 on their soft fill in every theme.', 'Status is announced in text (statusLabel), never by color alone; the dot has a 2px ring in the surface color.', 'In a group each avatar is ringed in the surface color (--apui-focus-ring-offset-color).', 'In forced colors the avatar keeps an edge and the dot is CanvasText.' ],
			'wcag'         => [ '1.1.1', '1.4.1', '1.4.3', '1.4.11', '4.1.2' ],
		],
		'tokens'      => [ '--apui-avatar-radius', '--apui-control-height-xs', '--apui-control-height-sm', '--apui-control-height-md', '--apui-control-height-lg', '--apui-control-height-xl', '--apui-color-neutral-soft', '--apui-color-neutral-soft-foreground', '--apui-color-success', '--apui-color-warning', '--apui-text-subtle', '--apui-focus-ring-offset-color', '--apui-radius-sm', '--apui-font-weight-medium' ],
		'fixture'     => [
			'props' => [
				'name'   => 'Olivia Rhye',
				'status' => 'online',
			],
			'parts' => [
				'src' => 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 8 8\'%3E%3Crect width=\'8\' height=\'8\' fill=\'%2394a3b8\'/%3E%3Ccircle cx=\'4\' cy=\'3\' r=\'1.6\' fill=\'%23e2e8f0\'/%3E%3C/svg%3E',
			],
		],
	],
	'Badge'             => [
		'name'        => 'Badge',
		'description' => 'A small, non-interactive label for a status, category or count. The text is always there; a dot or an icon can lead it.',
		'status'      => 'draft',
		'issue'       => 61,
		'rootClass'   => 'apui-badge',
		'stacks'      => [
			'livewire' => [
				'name'         => 'badge',
				'capabilities' => [ 'The 2.x value attribute still renders as the label, deprecated: use the slot' ],
			],
			'react'    => [
				'name' => 'Badge',
			],
			'vue'      => [
				'name' => 'Badge',
			],
		],
		'props'       => [
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'solid', 'soft', 'outline', 'ghost' ],
				'default'     => 'soft',
				'description' => 'Visual treatment. ghost drops the fill and padding, for a dot and a word in running text. Emitted as data-variant.',
			],
			[
				'name'        => 'color',
				'type'        => 'enum',
				'values'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
				'default'     => 'neutral',
				'description' => 'Semantic color. Use the same color for the same status everywhere. Emitted as data-color.',
				'a11y'        => 'Color is never the only signal: the label says the status.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md', 'lg' ],
				'default'     => 'md',
				'description' => 'Height: 18, 20 or 24px. Emitted as data-size.',
			],
			[
				'name'        => 'dot',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'A small decorative dot before the label, in the badge\'s color.',
				'a11y'        => 'Decorative: aria-hidden.',
			],
			[
				'name'        => 'leadingIcon',
				'type'        => 'string',
				'description' => 'Icon name before the label, resolved through the icon registry. Arrows mirror in RTL. A slot or node overrides it.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { label: \'…\' }.',
			],
		],
		'variants'    => [ 'solid', 'soft', 'outline', 'ghost' ],
		'sizes'       => [ 'sm', 'md', 'lg' ],
		'colors'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'span',
				'description' => 'The badge.',
			],
			[
				'name'        => 'dot',
				'element'     => 'span',
				'description' => 'The status dot. Decorative.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'The leading icon. Decorative.',
			],
			[
				'name'        => 'label',
				'element'     => 'span',
				'description' => 'The text.',
			],
		],
		'slots'       => [
			[
				'name'        => 'icon',
				'description' => 'Overrides the leading icon.',
			],
		],
		'events'      => [],
		'a11y'        => [
			'element'      => 'span',
			'requirements' => [ 'Not interactive: a badge is never a button or a link. Use a Button or a filter chip for that.', 'The label is always present; the dot and the icon are aria-hidden.', 'Soft and solid badges keep 4.5:1 text on their fill in every theme; outline and ghost on the surface.', 'In high contrast, soft badges gain an edge in the tone\'s border color.', 'In forced colors the badge keeps an edge and the dot uses CanvasText.' ],
			'wcag'         => [ '1.3.1', '1.4.1', '1.4.3', '1.4.11' ],
		],
		'tokens'      => [ '--apui-badge-radius', '--apui-color-neutral-soft', '--apui-color-neutral-soft-foreground', '--apui-color-neutral', '--apui-color-neutral-foreground', '--apui-color-neutral-border', '--apui-color-neutral-text', '--apui-type-caption-font-size', '--apui-type-body-sm-font-size', '--apui-font-weight-medium', '--apui-text-default', '--apui-radius-full' ],
		'fixture'     => [
			'content' => 'Active',
			'parts'   => [
				'dot'         => true,
				'leadingIcon' => 'check',
			],
		],
	],
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
	'Calendar'          => [
		'name'        => 'Calendar',
		'description' => 'Events on a month grid, a week, a day or an agenda list, with Today, previous and next, view tabs and an optional New event button. Days, titles and event order come from one set of date rules in every stack (behavior\'s calendarModel, ported to PHP for Livewire), so the three render the same calendar. Events are buttons, or links with href, named by their title, category and full time; their soft tint is by category and never the only cue.',
		'status'      => 'draft',
		'issue'       => 64,
		'rootClass'   => 'apui-calendar',
		'stacks'      => [
			'livewire' => [
				'name'         => 'calendar',
				'capabilities' => [ '<livewire:artisanpack-calendar> is a full Livewire component: it keeps view and date, re-renders on Today, previous, next, "+N more" and the view tabs, and opens a clicked event in a Dialog whose content is its internal event-modal-content child (event-view names another Livewire component, which receives the event through a load-event-modal event)', '<x-artisanpack-calendar> renders the same markup with no state of its own: its controls dispatch view-change, date-change, event-click and create as browser events for the page or a parent component to answer', 'Rendered on the server: the grid, labels and event order come from Support\\CalendarModel, a port of behavior\'s calendarModel; Alpine only adds the arrow keys', '2.x props still work: sunday-start (weekStartsOn 0, or 1 when false), and events with date, range, time, label and colorScheme; the year view and months fall back to month, and color-scheme, custom-color, weekend-highlight and config are ignored' ],
				'differences'  => [ 'The Livewire component\'s event details are a Livewire child (event-modal-content), so they can load more data from the server; React and Vue show the event\'s time, category and description in the Dialog.' ],
			],
			'react'    => [
				'name'         => 'Calendar',
				'capabilities' => [ 'view and date are controlled with onViewChange and onDateChange, uncontrolled when unset; onEventClick and onCreate report the other events', 'renderEventDetails(event) replaces the details Dialog\'s body' ],
			],
			'vue'      => [
				'name'         => 'Calendar',
				'capabilities' => [ 'v-model:view and v-model:date bind the view and date; @event-click and @create report the other events', 'The #details="{ event }" slot replaces the details Dialog\'s body' ],
			],
		],
		'props'       => [
			[
				'name'        => 'view',
				'type'        => 'enum',
				'values'      => [ 'month', 'week', 'day', 'agenda' ],
				'default'     => 'month',
				'description' => 'The month grid, the week as seven columns, one day, or the agenda: the month\'s events as a list of days, the accessible list alternative to the grid. Emitted as data-view.',
			],
			[
				'name'        => 'date',
				'type'        => 'string',
				'description' => 'The date the view shows, as YYYY-MM-DD: its month, week or day. Previous and next move it by a month (agenda too), a week or a day, keeping the day of the month where it exists. Defaults to today.',
			],
			[
				'name'        => 'today',
				'type'        => 'string',
				'description' => 'The date marked as today (YYYY-MM-DD). Defaults to the current date in timeZone; set it when the server and the browser could disagree.',
			],
			[
				'name'        => 'events',
				'type'        => 'array',
				'description' => 'The events: { id, start, end, title, color, allDay, category, description, href }. start and end are ISO strings: a date (2026-11-24) for an all-day event, a date and time (2026-11-02T09:00) for a timed one; with Z or an offset the time is converted to timeZone. end is inclusive for dates; a timed event ending at 00:00 ends the day before. color is a soft tint (primary, secondary, accent, success, warning, error, info, neutral; primary when unset). category shows in the legend and the event\'s name. href makes the event a link. Events on a day sort all-day first, then by start time, then as given.',
			],
			[
				'name'        => 'weekStartsOn',
				'type'        => 'number',
				'description' => 'The first day of the week, 0 (Sunday) to 6. Follows the locale unless set.',
			],
			[
				'name'        => 'locale',
				'type'        => 'string',
				'description' => 'BCP 47 locale for the title, weekday and date names and the first day of the week. Livewire defaults to the app locale, React and Vue to en-US. Times show as 24-hour HH:mm in every locale.',
			],
			[
				'name'        => 'timeZone',
				'type'        => 'string',
				'description' => 'The IANA time zone for today\'s date and for event times given with Z or an offset. Defaults to UTC.',
			],
			[
				'name'        => 'maxEvents',
				'type'        => 'number',
				'default'     => 2,
				'description' => 'How many events a month cell shows; the rest fold into a "+N more" button that opens that day.',
			],
			[
				'name'        => 'creatable',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Shows a New event Button at the end of the toolbar. It fires create with the shown date.',
			],
			[
				'name'        => 'details',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Clicking an event (one without href) opens a Dialog with its details, and the events carry aria-haspopup="dialog". Turn it off to handle event-click yourself. The Livewire x-tag only dispatches event-click: the Livewire component opens the Dialog.',
			],
			[
				'name'        => 'labels',
				'type'        => 'object',
				'default'     => [
					'today'    => 'Today',
					'previous' => 'Previous',
					'next'     => 'Next',
					'views'    => 'Calendar view',
					'month'    => 'Month',
					'week'     => 'Week',
					'day'      => 'Day',
					'agenda'   => 'Agenda',
					'allDay'   => 'All day',
					'more'     => '+{count} more',
					'showMore' => 'Show {count} more events on {date}',
					'newEvent' => 'New event',
					'empty'    => 'No events',
					'legend'   => 'Categories',
				],
				'description' => 'Built-in text: the toolbar buttons, the view tabs and their tablist\'s name (views), the all-day time, the more part\'s text and name ({count}, {date}), the agenda\'s empty state and the legend\'s name. Keys you leave out keep their defaults; Livewire translates them through __().',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { cell: \'…\', event: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The frame around the toolbar, the body and the legend. Carries data-view.',
			],
			[
				'name'        => 'toolbar',
				'element'     => 'div',
				'description' => 'Today, previous and next, the title, the view tabs and the New event button. Wraps on narrow screens.',
			],
			[
				'name'        => 'todayTrigger',
				'element'     => 'button',
				'description' => 'An outline neutral sm Button that shows today (date-change with today).',
			],
			[
				'name'        => 'previousTrigger',
				'element'     => 'button',
				'description' => 'An icon-only ghost Button named by labels.previous; its chevron mirrors in RTL.',
			],
			[
				'name'        => 'nextTrigger',
				'element'     => 'button',
				'description' => 'An icon-only ghost Button named by labels.next; its chevron mirrors in RTL.',
			],
			[
				'name'        => 'title',
				'element'     => 'h2',
				'description' => 'The month and year, the week\'s range or the day. It names the grid, and is a live region so moving through dates is announced.',
			],
			[
				'name'        => 'viewTabs',
				'element'     => 'div',
				'description' => 'A segmented sm Tabs (`.apui-tabs`) whose tablist is named by labels.views. The tabs control the body: arrow keys move between them (following the text direction) and Enter or Space chooses one.',
			],
			[
				'name'        => 'createTrigger',
				'element'     => 'button',
				'description' => 'The solid New event Button, with creatable.',
			],
			[
				'name'        => 'body',
				'element'     => 'div',
				'description' => 'The tabpanel the view tabs control, holding the grid (or the agenda\'s empty state).',
			],
			[
				'name'        => 'grid',
				'element'     => 'div | ul',
				'description' => 'role=grid named by the title, with one tab stop: arrow keys move between days (ArrowLeft and ArrowRight follow the text direction), Home and End to the row\'s ends. In agenda view, a list of the days with events.',
			],
			[
				'name'        => 'row',
				'element'     => 'div | li',
				'description' => 'role=row: the weekday headers, a week (month), the week or the day. In agenda view, one day.',
			],
			[
				'name'        => 'weekday',
				'element'     => 'div | h3',
				'description' => 'A column header (role=columnheader): the short weekday name, with the date in week and day views. In agenda view, the day\'s full date as a heading.',
			],
			[
				'name'        => 'cell',
				'element'     => 'div | ul',
				'description' => 'A day (role=gridcell) that starts with its full date (visually hidden), with data-date; data-outside outside the month, data-today and aria-current="date" today. In agenda view, the list of the day\'s events.',
			],
			[
				'name'        => 'date',
				'element'     => 'span',
				'description' => 'The day of the month, filled with primary today.',
			],
			[
				'name'        => 'event',
				'element'     => 'button | a',
				'description' => 'An event: a button (aria-haspopup="dialog" with details), or a link with href, named by its time and title, then a visually hidden category and full date and time. data-color gives its soft tint.',
			],
			[
				'name'        => 'eventTime',
				'element'     => 'span',
				'description' => 'The start time in month view; the time range or the all-day label in the other views. Empty on a multi-day event\'s later days.',
			],
			[
				'name'        => 'eventTitle',
				'element'     => 'span',
				'description' => 'The title, cut with an ellipsis in month view.',
			],
			[
				'name'        => 'more',
				'element'     => 'button',
				'description' => '"+N more" when a month cell has more than maxEvents; opens that day (view-change and date-change). Named by labels.showMore.',
			],
			[
				'name'        => 'legend',
				'element'     => 'ul',
				'description' => 'The category key under the body, named by labels.legend, when any event has a category.',
			],
			[
				'name'        => 'legendItem',
				'element'     => 'li',
				'description' => 'A category with a swatch of its tint (data-color).',
			],
		],
		'slots'       => [],
		'events'      => [
			[
				'name'        => 'view-change',
				'description' => 'A view tab or "+N more" (which opens day) chose a view. The payload is the view.',
				'payload'     => '\'month\' | \'week\' | \'day\' | \'agenda\'',
			],
			[
				'name'        => 'date-change',
				'description' => 'Today, previous, next or "+N more" moved the date. The payload is the new date, YYYY-MM-DD.',
				'payload'     => 'string',
			],
			[
				'name'        => 'event-click',
				'description' => 'An event without href was chosen. The payload is the event as passed in.',
				'payload'     => 'CalendarEvent',
			],
			[
				'name'        => 'create',
				'description' => 'The New event button was chosen. The payload is the shown date, YYYY-MM-DD.',
				'payload'     => 'string',
			],
		],
		'a11y'        => [
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves through Today, previous, next, the selected view tab, New event, the grid\'s day (one tab stop) and the events and "+N more" buttons inside the days.',
				],
				[
					'keys'   => 'ArrowLeft, ArrowRight',
					'action' => 'In the grid, the previous and next day; in the view tabs, the previous and next tab. They follow the text direction, so they swap under RTL.',
				],
				[
					'keys'   => 'ArrowUp, ArrowDown',
					'action' => 'In the grid, the same day of the previous and next week.',
				],
				[
					'keys'   => 'Home, End',
					'action' => 'In the grid, the start and end of the row; in the view tabs, the first and last tab.',
				],
				[
					'keys'   => 'Enter, Space',
					'action' => 'On a tab, chooses the view; on an event, opens it (its details or its link).',
				],
			],
			'requirements' => [ 'The month, week and day are role=grid, named by the title, with rows, column headers and gridcells; each day starts with its full localized date (visually hidden beside the number), and today carries aria-current="date".', 'Arrow keys follow the text direction (D-004), and the previous and next chevrons mirror in RTL.', 'Each event is a button or link named by its visible time and title, then (visually hidden) its category and full date and time, never by its tint alone; the legend keeps the category key visible.', 'The agenda view is the accessible list alternative: the month\'s days with events as a list, each with its date as a heading.', 'The view tabs are a tablist named by labels.views controlling the body (role=tabpanel); the title is a polite live region.', 'Event details open in the design-system Dialog, which traps focus and returns it to the event.', 'Names come from Intl in the locale; every built-in string is translatable through labels.' ],
			'wcag'         => [ '1.3.1', '1.4.1', '1.4.3', '1.4.11', '2.1.1', '2.4.3', '2.4.6', '2.4.7', '4.1.2', '4.1.3' ],
		],
		'tokens'      => [ '--apui-border-muted', '--apui-border-soft-edge-width', '--apui-border-width', '--apui-color-primary', '--apui-color-primary-border', '--apui-color-primary-foreground', '--apui-color-primary-soft', '--apui-color-primary-soft-foreground', '--apui-color-primary-text', '--apui-focus-ring-color', '--apui-focus-ring-offset', '--apui-focus-ring-offset-color', '--apui-focus-ring-width', '--apui-font-family-sans', '--apui-font-weight-medium', '--apui-font-weight-regular', '--apui-font-weight-semibold', '--apui-radius-full', '--apui-radius-lg', '--apui-radius-xs', '--apui-state-hover', '--apui-surface-default', '--apui-surface-page', '--apui-surface-sunken', '--apui-text-default', '--apui-text-muted', '--apui-type-body-lg-font-size', '--apui-type-body-lg-line-height', '--apui-type-body-md-font-size', '--apui-type-body-md-line-height', '--apui-type-body-sm-font-size', '--apui-type-body-sm-line-height', '--apui-type-caption-font-size', '--apui-type-caption-line-height' ],
		'fixture'     => [
			'props'  => [
				'date'         => '2026-11-07',
				'today'        => '2026-11-07',
				'weekStartsOn' => 1,
				'locale'       => 'en-US',
				'timeZone'     => 'UTC',
				'events'       => [
					[
						'id'       => 1,
						'start'    => '2026-11-02T09:00',
						'end'      => '2026-11-02T10:00',
						'title'    => 'Team meeting',
						'color'    => 'error',
						'category' => 'Marketing',
					],
					[
						'id'       => 2,
						'start'    => '2026-11-03T10:00',
						'end'      => '2026-11-03T12:00',
						'title'    => 'Marketing course',
						'color'    => 'info',
						'category' => 'Learning',
					],
					[
						'id'       => 3,
						'start'    => '2026-11-03T13:00',
						'title'    => 'Lunch · Edgehill Grill',
						'color'    => 'success',
						'category' => 'Personal',
					],
					[
						'id'       => 4,
						'start'    => '2026-11-05',
						'title'    => 'Anna’s birthday',
						'color'    => 'accent',
						'category' => 'People',
					],
					[
						'id'       => 5,
						'start'    => '2026-11-09T11:00',
						'title'    => 'Upgrade Slack plan',
						'color'    => 'secondary',
						'category' => 'Admin',
					],
					[
						'id'       => 6,
						'start'    => '2026-11-12T11:00',
						'title'    => 'Viewing · Lakeview',
						'color'    => 'primary',
						'category' => 'Viewings',
					],
					[
						'id'       => 7,
						'start'    => '2026-11-12T16:00',
						'title'    => 'Hubstaff broadcast',
						'color'    => 'info',
						'category' => 'Learning',
					],
					[
						'id'       => 8,
						'start'    => '2026-11-12T18:00',
						'title'    => 'Board dinner',
						'color'    => 'success',
						'category' => 'Personal',
					],
					[
						'id'       => 9,
						'start'    => '2026-11-13T09:30',
						'title'    => 'Meet a new intern',
						'color'    => 'accent',
						'category' => 'People',
					],
					[
						'id'       => 10,
						'start'    => '2026-11-17',
						'title'    => 'Facebook campaign',
						'color'    => 'error',
						'category' => 'Marketing',
					],
					[
						'id'       => 11,
						'start'    => '2026-11-19T10:00',
						'end'      => '2026-11-19T11:30',
						'title'    => 'Design review',
						'color'    => 'primary',
						'category' => 'Viewings',
					],
					[
						'id'       => 12,
						'start'    => '2026-11-24',
						'title'    => 'Open house · Grove',
						'color'    => 'success',
						'category' => 'Personal',
					],
					[
						'id'       => 13,
						'start'    => '2026-11-26',
						'title'    => 'Thanksgiving',
						'color'    => 'neutral',
						'category' => 'Holidays',
					],
				],
			],
			'parts'  => [
				'creatable' => true,
				'labels'    => [
					'legend' => 'Event categories',
				],
			],
			'states' => [],
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
	'Carousel'          => [
		'name'        => 'Carousel',
		'description' => 'Scroll-snapped slides with previous and next buttons and position dots, on the carousel machine ImageSlider uses (D-041). perView shows several at once with the next one peeking. A title puts the buttons in a header; without one they overlay the slides.',
		'status'      => 'draft',
		'issue'       => 65,
		'rootClass'   => 'apui-carousel',
		'stacks'      => [
			'livewire' => [
				'name'         => 'carousel',
				'capabilities' => [ 'wire:model binds the slide shown (index) through $wire.entangle()', '@scope(\'slide\', $slide) renders each slide\'s content, with $loop->index as its index; 2.x slides keep their image, alt, title and description keys' ],
			],
			'react'    => [
				'name'         => 'Carousel',
				'capabilities' => [ 'renderSlide(slide, index) renders each slide\'s content' ],
			],
			'vue'      => [
				'name'         => 'Carousel',
				'capabilities' => [ 'The #slide="{ slide, index }" slot renders each slide\'s content' ],
			],
		],
		'props'       => [
			[
				'name'        => 'slides',
				'type'        => 'array',
				'required'    => true,
				'description' => 'The slides, in order. By default each is a Card from { image, alt, title, description }; the slide render content draws anything else.',
				'a11y'        => 'Every image needs alt text.',
			],
			[
				'name'        => 'perView',
				'type'        => 'number',
				'default'     => 1,
				'description' => 'Slides in view at once, a whole number. Above 1 the next slide peeks at the inline end, and each move shows one more slide. Emitted as --slides-per-page.',
			],
			[
				'name'        => 'index',
				'type'        => 'number',
				'default'     => 0,
				'description' => 'The position shown, 0-based: the slide at the start of the view. Livewire binds it with wire:model. Pair it with index-change to control it.',
			],
			[
				'name'        => 'defaultIndex',
				'type'        => 'number',
				'default'     => 0,
				'description' => 'The initial position of an uncontrolled carousel.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'loop',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Wraps from the last position to the first and back.',
			],
			[
				'name'        => 'autoplay',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Advances every interval ms, with a visible pause button. It pauses while the pointer or focus is on the carousel, and starts paused under reduced motion.',
				'a11y'        => 'Autoplay always has a visible pause button (2.2.2) and never starts on its own under prefers-reduced-motion.',
			],
			[
				'name'        => 'interval',
				'type'        => 'number',
				'default'     => 5000,
				'description' => 'Milliseconds between slides while autoplay runs.',
			],
			[
				'name'        => 'title',
				'type'        => 'string',
				'description' => 'A heading in the header, with the previous and next buttons beside it. It names the region unless label is set. Without it the buttons overlay the slides.',
			],
			[
				'name'        => 'headingLevel',
				'type'        => 'number',
				'default'     => 3,
				'description' => 'The title\'s heading level, 2 to 6.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'description' => 'Names the region. Defaults to the title, else "Carousel". Translate it: Livewire defaults it through __( \'Carousel\' ).',
				'a11y'        => 'A page with several carousels names each one.',
			],
			[
				'name'        => 'previousLabel',
				'type'        => 'string',
				'default'     => 'Previous slide',
				'description' => 'The previous button\'s accessible name.',
				'a11y'        => 'The button is icon-only, so this is its only name.',
			],
			[
				'name'        => 'nextLabel',
				'type'        => 'string',
				'default'     => 'Next slide',
				'description' => 'The next button\'s accessible name.',
				'a11y'        => 'The button is icon-only, so this is its only name.',
			],
			[
				'name'        => 'indicatorLabel',
				'type'        => 'string',
				'default'     => 'Go to slide {index}',
				'description' => 'A dot\'s accessible name. {index} is replaced; Livewire\'s __() string uses :index.',
			],
			[
				'name'        => 'slideLabel',
				'type'        => 'string',
				'default'     => '{index} of {count}',
				'description' => 'A slide\'s accessible name. Livewire\'s __() string uses :index and :count.',
			],
			[
				'name'        => 'playLabel',
				'type'        => 'string',
				'default'     => 'Start slide rotation',
				'description' => 'The autoplay button\'s name while paused.',
			],
			[
				'name'        => 'pauseLabel',
				'type'        => 'string',
				'default'     => 'Stop slide rotation',
				'description' => 'The autoplay button\'s name while playing.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { viewport: \'…\', item: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The carousel\'s region: role region with aria-roledescription carousel, named by label or the title.',
			],
			[
				'name'        => 'header',
				'element'     => 'div',
				'description' => 'With a title: the heading, then the previous and next buttons at the inline end.',
			],
			[
				'name'        => 'title',
				'element'     => 'h2 | h3 | h4 | h5 | h6',
				'description' => 'The header\'s heading, at headingLevel.',
			],
			[
				'name'        => 'viewport',
				'element'     => 'div',
				'description' => 'Clips the track; the overlay buttons sit on it when there\'s no header.',
			],
			[
				'name'        => 'itemGroup',
				'element'     => 'div',
				'description' => 'The scroll-snapping track. The spec calls it track; it keeps Zag\'s name (D-019).',
			],
			[
				'name'        => 'item',
				'element'     => 'div',
				'description' => 'A slide: role group with aria-roledescription slide, named "2 of 6"; slides out of view are aria-hidden. The spec calls it slide.',
			],
			[
				'name'        => 'prevTrigger',
				'element'     => 'button',
				'description' => 'Shows the previous position: an outline icon-only Button in the header, or a soft one over the viewport\'s start edge. The spec\'s nav (prev).',
			],
			[
				'name'        => 'nextTrigger',
				'element'     => 'button',
				'description' => 'Shows the next position. The spec\'s nav (next).',
			],
			[
				'name'        => 'indicatorGroup',
				'element'     => 'div',
				'description' => 'The row of dots under the viewport, one per position. The spec calls it dots.',
			],
			[
				'name'        => 'indicator',
				'element'     => 'button',
				'description' => 'A dot that shows its position; aria-current and a wider primary pill mark the one shown.',
			],
			[
				'name'        => 'autoplayTrigger',
				'element'     => 'button',
				'description' => 'Pauses and resumes autoplay, with autoplay. Always visible while autoplay is on.',
			],
		],
		'slots'       => [
			[
				'name'        => 'slide',
				'description' => 'Scoped render content for one slide\'s content, given the slide and its index: @scope(\'slide\', $slide) in Blade ($loop->index is the index), #slide="{ slide, index }" in Vue, renderSlide in React.',
			],
		],
		'events'      => [
			[
				'name'        => 'index-change',
				'description' => 'The carousel moved to another position: a button, a dot, a swipe or autoplay. Setting index doesn\'t fire it.',
				'payload'     => 'number',
			],
		],
		'a11y'        => [
			'role'         => 'region',
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Tab, Shift+Tab',
					'action' => 'Move between the previous and next buttons, the track, the dots and the autoplay button.',
				],
				[
					'keys'   => 'Enter, Space',
					'action' => 'On a button or dot: shows its position, or pauses and resumes autoplay.',
				],
				[
					'keys'   => 'ArrowRight, ArrowLeft',
					'action' => 'On the dots: show the next or previous position. They follow the text direction, so in RTL ArrowLeft shows the next one.',
				],
				[
					'keys'   => 'Home, End',
					'action' => 'On the dots: show the first or last position.',
				],
			],
			'requirements' => [ 'The root is a region with aria-roledescription carousel and a translatable name (label, else the title).', 'Each slide is a group with aria-roledescription slide, named "n of N"; slides out of view are hidden from assistive technology.', 'The track is a polite live region, off while autoplay runs, so moves are announced.', 'The previous and next buttons and the dots have accessible names (translatable); the dot shown carries aria-current.', 'Autoplay never runs without a visible pause button, pauses while the pointer or focus is on the carousel, and starts paused under prefers-reduced-motion (2.2.2).', 'Arrow keys follow the text direction; the previous and next icons mirror and the next slide peeks at the inline end in RTL.', 'Every part keeps a stable, server-rendered id in Livewire (D-015).' ],
			'wcag'         => [ '1.3.1', '1.4.11', '2.1.1', '2.2.2', '2.4.3', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-radius-lg', '--apui-radius-full', '--apui-border-default', '--apui-color-primary', '--apui-elevation-glass', '--apui-focus-ring-color', '--apui-focus-ring-width', '--apui-motion-duration-fast', '--apui-motion-ease-standard' ],
		'fixture'     => [
			'props'  => [
				'slides'  => [
					[
						'image'       => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23e4eef6\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23c4d8e8\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%239db8cf\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%236f8fab\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%2347637e\'/%3E%3C/svg%3E',
						'alt'         => 'Lakeview Lofts from the lake',
						'title'       => 'Lakeview Lofts',
						'description' => 'United States, Chicago · $250,000',
					],
					[
						'image'       => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23cfe3e0\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23a9cbc4\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%235f8f7c\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%233f6b57\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%2324463a\'/%3E%3C/svg%3E',
						'alt'         => 'Courtyard at Cedarwood Estates',
						'title'       => 'Cedarwood Estates',
						'description' => 'United States, New York · $200,000',
					],
					[
						'image'       => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23f4e2c4\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23e7c08d\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%23c98f5e\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%239c6a43\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%236b4630\'/%3E%3C/svg%3E',
						'alt'         => 'Rooftop terrace at Tranquil Oaks',
						'title'       => 'Tranquil Oaks',
						'description' => 'Canada, Toronto · $350,000',
					],
					[
						'image'       => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23f6d9a8\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23e9b77a\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%238aa7c4\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%235d7f9f\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%2333506d\'/%3E%3C/svg%3E',
						'alt'         => 'Sunrise over Golden Hour',
						'title'       => 'Golden Hour',
						'description' => 'United States, Denver · $320,000',
					],
				],
				'perView' => 3,
				'title'   => 'Featured properties',
			],
			'parts'  => [
				'autoplay' => true,
				'title'    => 'Featured properties',
			],
			'states' => [],
		],
	],
	'Chart'             => [
		'name'        => 'Chart',
		'description' => 'A bar, line, area or donut chart in a Card, drawn as inline SVG from tokens: series colors --apui-chart-1…6 in fixed order, a recessive grid, and a tooltip on hover and keyboard focus of each mark. Every stack computes the same geometry, so there is no chart library. Every chart has a title, a legend for two or more series, and a data table view.',
		'status'      => 'draft',
		'issue'       => 63,
		'rootClass'   => 'apui-chart',
		'stacks'      => [
			'livewire' => [
				'name'         => 'chart',
				'capabilities' => [ 'Rendered on the server: wire:poll and Livewire updates redraw it, and the tooltip (apuiChart) keeps working through the morph', 'The actions slot holds header controls, such as a range switch bound with wire:model.live', '2.x series in ApexCharts\' shape still work: [{ name, data }] or a plain array of values, with labels' ],
			],
			'react'    => [
				'name'         => 'Chart',
				'capabilities' => [ 'actions takes a node' ],
			],
			'vue'      => [
				'name'         => 'Chart',
				'capabilities' => [ 'The actions slot holds header controls' ],
			],
		],
		'props'       => [
			[
				'name'        => 'type',
				'type'        => 'enum',
				'values'      => [ 'bar', 'line', 'area', 'donut' ],
				'default'     => 'bar',
				'description' => 'Bars from zero (one series: the first), lines, lines with a soft fill below, or a donut of the first series\' values. Emitted as data-type.',
			],
			[
				'name'        => 'series',
				'type'        => 'array',
				'required'    => true,
				'description' => 'The data: [{ name, data: number[] }], or a plain array of values for one series named by title. data lines up with labels. Anything that isn\'t a finite number is a gap. Series take --apui-chart-1…6 in order; keep the order stable when filters change.',
			],
			[
				'name'        => 'labels',
				'type'        => 'array',
				'description' => 'The categories: the x-axis labels, or the donut\'s slices.',
			],
			[
				'name'        => 'title',
				'type'        => 'string',
				'required'    => true,
				'description' => 'The chart\'s heading, and the accessible name of its plot and table.',
				'a11y'        => 'Every chart has a title; it names the plot (role=group) and the table.',
			],
			[
				'name'        => 'description',
				'type'        => 'string',
				'description' => 'Supporting text under the title, such as the period or what\'s labeled.',
			],
			[
				'name'        => 'actions',
				'type'        => 'node',
				'description' => 'Controls at the end of the header, such as Tabs that switch the range.',
			],
			[
				'name'        => 'tabular',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Shows the data as a table under the plot: a row per category and a column per series (the donut\'s value and share). The spec calls it showTable; Livewire also takes show-table.',
				'a11y'        => 'The table view is the accessible alternative to the plot.',
			],
			[
				'name'        => 'prefix',
				'type'        => 'string',
				'description' => 'Printed before every value on the axis, the marks and the table, such as $.',
			],
			[
				'name'        => 'suffix',
				'type'        => 'string',
				'description' => 'Printed after every value, such as %.',
			],
			[
				'name'        => 'notation',
				'type'        => 'enum',
				'values'      => [ 'standard', 'compact' ],
				'default'     => 'standard',
				'description' => 'standard prints values with thousands separators and up to two decimals (12,500); compact shortens them to k, M and B ($4.1k), the axis sharing the unit of its largest value ($0k … $10k).',
			],
			[
				'name'        => 'width',
				'type'        => 'number',
				'default'     => 520,
				'description' => 'The plot\'s viewBox width. The plot scales to its container; this sets the aspect ratio and how large the axis text reads. The donut is always 160.',
			],
			[
				'name'        => 'height',
				'type'        => 'number',
				'default'     => 220,
				'description' => 'The plot\'s viewBox height.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { plot: \'…\', tooltip: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The card: .apui-card.apui-chart, with data-type.',
			],
			[
				'name'        => 'header',
				'element'     => 'div',
				'description' => 'The heading, the legend (for two or more series) and the actions.',
			],
			[
				'name'        => 'title',
				'element'     => 'h3',
				'description' => 'The chart\'s heading.',
			],
			[
				'name'        => 'description',
				'element'     => 'p',
				'description' => 'The supporting text.',
			],
			[
				'name'        => 'actions',
				'element'     => 'div',
				'description' => 'The header controls.',
			],
			[
				'name'        => 'legend',
				'element'     => 'ul',
				'description' => 'A list of the series, or the donut\'s slices with their shares. Mirrors in RTL.',
			],
			[
				'name'        => 'swatch',
				'element'     => 'span',
				'description' => 'A legend entry\'s color, with data-series 1–6. Hidden from assistive technology.',
			],
			[
				'name'        => 'body',
				'element'     => 'div',
				'description' => 'Holds the plot and the tooltip, and the donut\'s legend beside it.',
			],
			[
				'name'        => 'plot',
				'element'     => 'svg',
				'description' => 'The chart: role=group, named by the title. Stays LTR in every direction (D-004).',
			],
			[
				'name'        => 'grid',
				'element'     => 'line',
				'description' => 'A horizontal grid line at each y-axis value. Hidden from assistive technology.',
			],
			[
				'name'        => 'axis',
				'element'     => 'text',
				'description' => 'A y-axis value or x-axis category label. Hidden from assistive technology.',
			],
			[
				'name'        => 'mark',
				'element'     => 'path | rect',
				'description' => 'A bar, a donut slice, or a line or area chart\'s category column: focusable (tabindex=0), role=img with the category and its values as its name, data-series and data-index. Hover or focus opens the tooltip and sets data-state="active".',
			],
			[
				'name'        => 'line',
				'element'     => 'path',
				'description' => 'A series\' line, for line and area charts, with data-series.',
			],
			[
				'name'        => 'area',
				'element'     => 'path',
				'description' => 'The soft fill under a series\' line, for area charts.',
			],
			[
				'name'        => 'point',
				'element'     => 'g',
				'description' => 'A category\'s crosshair and dots, shown (visibility) while its mark is active.',
			],
			[
				'name'        => 'crosshair',
				'element'     => 'line',
				'description' => 'The dashed vertical line through the active category.',
			],
			[
				'name'        => 'dot',
				'element'     => 'circle',
				'description' => 'A series\' value at the active category.',
			],
			[
				'name'        => 'value',
				'element'     => 'text | span',
				'description' => 'The one labeled value (the first series\' maximum) in the plot, and each slice\'s share in the donut\'s legend.',
			],
			[
				'name'        => 'tooltip',
				'element'     => 'div',
				'description' => 'The active mark\'s category and values, on the overlay surface. aria-hidden: the mark\'s name says the same.',
			],
			[
				'name'        => 'table',
				'element'     => 'table',
				'description' => 'The data table view (tabular), named by the title.',
			],
		],
		'slots'       => [
			[
				'name'        => 'actions',
				'description' => 'Controls at the end of the header, such as Tabs.',
			],
		],
		'events'      => [],
		'a11y'        => [
			'element'      => 'div',
			'requirements' => [ 'Every chart has a title that names the plot (role=group) and the table, a legend for two or more series, and a table view (tabular).', 'Every mark is focusable, with its category and values as its accessible name; the tooltip opens on hover and on keyboard focus, and Escape closes it.', 'The grid, axis labels, lines, areas and the labeled value are hidden from assistive technology: the marks and the table carry the data.', 'Series colors follow --apui-chart-1…6 in fixed order. Light-mode --apui-chart-2, -4 and -6 sit under 3:1, so values are always reachable as labels, in the tooltip or in the table, never by color alone.', 'The plot stays LTR in every direction; the header and legend mirror.' ],
			'wcag'         => [ '1.1.1', '1.3.1', '1.4.1', '1.4.11', '1.4.13', '2.1.1', '2.4.7' ],
		],
		'tokens'      => [ '--apui-chart-1', '--apui-chart-2', '--apui-chart-3', '--apui-chart-4', '--apui-chart-5', '--apui-chart-6', '--apui-chart-grid', '--apui-chart-axis', '--apui-surface-overlay', '--apui-elevation-overlay', '--apui-border-strong', '--apui-card-padding', '--apui-text-muted' ],
		'fixture'     => [
			'props' => [
				'type'        => 'bar',
				'title'       => 'Weekly revenue',
				'description' => 'The Grove at Greenfield · best week labeled',
				'labels'      => [ 'W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10' ],
				'series'      => [
					[
						'name' => 'Revenue',
						'data' => [ 4100, 6000, 8200, 10000, 4000, 8000, 4000, 8000, 6000, 4000 ],
					],
				],
				'prefix'      => '$',
				'notation'    => 'compact',
			],
			'parts' => [
				'type'        => 'area',
				'title'       => 'Analytic',
				'description' => 'Sales estimation vs target',
				'labels'      => [ 'Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3', 'Q4' ],
				'series'      => [
					[
						'name' => 'Sales',
						'data' => [ 600000, 1800000, 2600000, 3200000, 3600000, 4400000, 6100000, 7400000 ],
					],
					[
						'name' => 'Target',
						'data' => [ 3200000, 4400000, 3800000, 5200000, 6100000, 6600000, 7000000, 6400000 ],
					],
				],
				'prefix'      => '$',
				'notation'    => 'compact',
				'width'       => 1000,
				'height'      => 260,
				'tabular'     => true,
				'actions'     => 'Export',
			],
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
	'Clipboard'         => [
		'name'        => 'Clipboard',
		'description' => 'Copies a value with clear confirmation: a copy button, an icon button with a confirmation tooltip, or a copy field showing the value beside its button. The label changes to Copied for the timeout and the result is announced in a live region; a failure is announced too. Every stack uses the behavior package\'s copy helper, with a fallback where the async Clipboard API is missing.',
		'status'      => 'draft',
		'issue'       => 65,
		'rootClass'   => 'apui-clipboard',
		'stacks'      => [
			'livewire' => [
				'name'         => 'clipboard',
				'capabilities' => [ 'New in Livewire. Runs on the shared apuiClipboard Alpine component; a changed value from Livewire copies the new one', 'copy and error are DOM events on the root (x-on:copy, x-on:error)' ],
			],
			'react'    => [
				'name'         => 'Clipboard',
				'capabilities' => [ 'onCopy gets the value; onError the failure' ],
			],
			'vue'      => [
				'name'         => 'Clipboard',
				'capabilities' => [ 'copy gets the value; error the failure' ],
			],
		],
		'props'       => [
			[
				'name'        => 'value',
				'type'        => 'string',
				'required'    => true,
				'description' => 'What to copy. The field variant shows it.',
			],
			[
				'name'        => 'timeout',
				'type'        => 'number',
				'default'     => 2000,
				'description' => 'How long Copied (or the failure) shows, in ms.',
			],
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'button', 'icon', 'field' ],
				'default'     => 'button',
				'description' => 'An outline button with the icon and label; a ghost icon button whose confirmation shows as a tooltip below it; or the value in a read-only box joined to an outline button (the spec\'s copy field), for links, keys and IDs. Emitted as data-variant.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'xs', 'sm', 'md' ],
				'default'     => 'sm',
				'description' => 'The button\'s size, and the field\'s height. Use md for a field in a form. Emitted as data-size.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'default'     => 'Copy',
				'description' => 'The button\'s label; the icon button\'s accessible name. Translate it: Livewire defaults it through __( \'Copy\' ).',
				'a11y'        => 'Name the button after what it copies when a page has several, such as "Copy share link".',
			],
			[
				'name'        => 'copiedLabel',
				'type'        => 'string',
				'default'     => 'Copied',
				'description' => 'The label after a copy. Translate it: Livewire defaults it through __( \'Copied\' ).',
			],
			[
				'name'        => 'copiedMessage',
				'type'        => 'string',
				'default'     => 'Copied to clipboard',
				'description' => 'Announced after a copy, and shown in the icon button\'s tooltip. Translate it: Livewire defaults it through __( \'Copied to clipboard\' ).',
			],
			[
				'name'        => 'errorMessage',
				'type'        => 'string',
				'default'     => 'Couldn\'t copy. Select the text and copy it yourself.',
				'description' => 'Announced (and shown in the icon button\'s tooltip) when the copy fails. Translate it: Livewire defaults it through __().',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { button: \'…\', field: \'…\' }.',
			],
		],
		'variants'    => [ 'button', 'icon', 'field' ],
		'sizes'       => [ 'xs', 'sm', 'md' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'span | div',
				'description' => 'The wrapper, with data-variant, data-size and data-state (idle, copied, failed): a span, or a div for the field.',
			],
			[
				'name'        => 'button',
				'element'     => 'button',
				'description' => 'A neutral Button (outline, or ghost and icon-only for the icon variant) with the copy icon and label; a check and copiedLabel, in the success color, while copied.',
			],
			[
				'name'        => 'field',
				'element'     => 'span',
				'description' => 'The field variant\'s read-only box, in the mono font on the sunken surface.',
			],
			[
				'name'        => 'value',
				'element'     => 'span',
				'description' => 'The value in the field, LTR in every direction, cut with an ellipsis when long.',
			],
			[
				'name'        => 'tooltip',
				'element'     => 'span',
				'description' => 'The role=status live region with copiedMessage or errorMessage. Hidden but announced; shown as a tooltip below the icon button.',
			],
		],
		'slots'       => [],
		'events'      => [
			[
				'name'        => 'copy',
				'description' => 'The value reached the clipboard.',
				'payload'     => 'string',
			],
			[
				'name'        => 'error',
				'description' => 'The copy failed, in both the Clipboard API and the fallback.',
				'payload'     => 'unknown',
			],
		],
		'a11y'        => [
			'element'      => 'span',
			'requirements' => [ 'The result is announced in a role=status live region, success or failure; never a silent copy.', 'The label changes to Copied while copied; the icon button\'s accessible name does too.', 'The value in a copy field reads LTR in every direction and stays selectable, so it can be copied by hand when copying fails.' ],
			'wcag'         => [ '2.1.1', '4.1.2', '4.1.3' ],
		],
		'tokens'      => [ '--apui-control-height-xs', '--apui-control-height-sm', '--apui-control-height-md', '--apui-input-radius', '--apui-border-muted', '--apui-border-width', '--apui-surface-sunken', '--apui-surface-inverse', '--apui-text-default', '--apui-text-inverse', '--apui-font-family-mono', '--apui-tooltip-radius', '--apui-color-success-text', '--apui-z-tooltip' ],
		'fixture'     => [
			'props' => [
				'value' => 'https://horizonhomes.com/l/grove-greenfield',
			],
			'parts' => [
				'variant' => 'field',
			],
		],
	],
	'Code'              => [
		'name'        => 'Code',
		'description' => 'Read-only code: a block with a header (file name, language and a copy button), optional line numbers and highlighted lines, or inline code in running text. No syntax highlighting. The block is a labeled scroll region that doesn\'t wrap; the header mirrors in RTL, the code stays LTR. For editable code, use CodeEditor.',
		'status'      => 'draft',
		'issue'       => 65,
		'rootClass'   => 'apui-code',
		'stacks'      => [
			'livewire' => [
				'name'         => 'code',
				'capabilities' => [ 'Rendered on the server; the copy button runs on the shared apuiClipboard Alpine component, reading the rendered lines back', 'The default slot holds the code when code is empty', '2.x was an Ace editor bound with wire:model: use CodeEditor for that. Its label, hint, height, theme and print-margin props are gone' ],
			],
			'react'    => [
				'name'         => 'Code',
				'capabilities' => [ 'The copy button uses the behavior package\'s useClipboard, as Clipboard does' ],
			],
			'vue'      => [
				'name'         => 'Code',
				'capabilities' => [ 'The copy button uses the behavior package\'s useClipboard, as Clipboard does' ],
			],
		],
		'props'       => [
			[
				'name'        => 'code',
				'type'        => 'string',
				'description' => 'The code. Split into lines on any line ending; one final line ending doesn\'t add an empty line. Shown as text, never as HTML.',
			],
			[
				'name'        => 'language',
				'type'        => 'string',
				'description' => 'The language, shown as a badge in the header, such as "TypeScript" or "Shell". Only a label: nothing is highlighted.',
			],
			[
				'name'        => 'fileName',
				'type'        => 'string',
				'description' => 'The file name or a title such as "Terminal", at the start of the header in the mono font.',
			],
			[
				'name'        => 'numbered',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Shows line numbers. They aren\'t part of the text, so selecting or copying the code leaves them out. Emitted as data-numbered.',
			],
			[
				'name'        => 'highlight',
				'type'        => 'array',
				'description' => 'Line numbers to emphasize (1-based), such as [3]. Each gets data-highlight: the selected fill and a primary bar. Highlight a few lines to make a point.',
			],
			[
				'name'        => 'inline',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Inline code in running text: a code element with no header, numbers or copy button. Emitted as data-inline.',
			],
			[
				'name'        => 'copyable',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Shows the copy button in the header. It copies the code and reads "Copied" for two seconds.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'description' => 'Names the scroll region. Defaults to the file name, then the language, then "Code" (Livewire through __( \'Code\' )).',
				'a11y'        => 'The region is focusable so keyboard users can scroll it, and needs a name. Name each block when a page has several with the same file name.',
			],
			[
				'name'        => 'copyLabel',
				'type'        => 'string',
				'default'     => 'Copy',
				'description' => 'The copy button\'s label. Translate it: Livewire defaults it through __( \'Copy\' ).',
			],
			[
				'name'        => 'copiedLabel',
				'type'        => 'string',
				'default'     => 'Copied',
				'description' => 'The copy button\'s label after a copy. Translate it: Livewire defaults it through __( \'Copied\' ).',
			],
			[
				'name'        => 'copiedMessage',
				'type'        => 'string',
				'default'     => 'Copied to clipboard',
				'description' => 'Announced after a copy. Translate it: Livewire defaults it through __( \'Copied to clipboard\' ).',
			],
			[
				'name'        => 'errorMessage',
				'type'        => 'string',
				'default'     => 'Couldn\'t copy. Select the text and copy it yourself.',
				'description' => 'Announced when the copy fails. Translate it: Livewire defaults it through __().',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { header: \'…\', pre: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div | code',
				'description' => 'The frame, with data-numbered; or, inline, the code element with data-inline.',
			],
			[
				'name'        => 'header',
				'element'     => 'div',
				'description' => 'The file name, language and copy button. Mirrors in RTL. Left out when there is nothing to show.',
			],
			[
				'name'        => 'file',
				'element'     => 'span',
				'description' => 'The file name, in the mono font, cut with an ellipsis when long.',
			],
			[
				'name'        => 'language',
				'element'     => 'span',
				'description' => 'The language: a neutral outline Badge (sm).',
			],
			[
				'name'        => 'copy',
				'element'     => 'button',
				'description' => 'A ghost, neutral, xs Button with the copy icon and copyLabel, with data-state (idle, copied, failed). Reads copiedLabel with a check, in the success color, while copied.',
			],
			[
				'name'        => 'status',
				'element'     => 'span',
				'description' => 'A hidden role=status live region announcing copiedMessage or errorMessage.',
			],
			[
				'name'        => 'pre',
				'element'     => 'pre',
				'description' => 'The code, always LTR (D-004): a focusable role=region named by label, scrolling instead of wrapping.',
			],
			[
				'name'        => 'line',
				'element'     => 'span',
				'description' => 'One line, with data-n (its number, drawn as a ::before when numbered) and data-highlight when emphasized.',
			],
		],
		'slots'       => [
			[
				'name'        => 'default',
				'description' => 'The code as text, when code is empty (Livewire only: React and Vue take the code prop).',
			],
		],
		'events'      => [],
		'a11y'        => [
			'element'      => 'div',
			'requirements' => [ 'The block is a focusable role=region named by label, so keyboard users can scroll long lines.', 'Copying is announced in a live region (copiedMessage), and so is a failure (errorMessage); the button\'s label changes to Copied.', 'Line numbers aren\'t text: selecting and copying the code leaves them out.', 'The code stays LTR in every direction; the header mirrors.', 'Highlighted lines keep 4.5:1 for their text and numbers.' ],
			'wcag'         => [ '1.3.1', '2.1.1', '4.1.2', '4.1.3' ],
		],
		'tokens'      => [ '--apui-surface-default', '--apui-surface-sunken', '--apui-border-muted', '--apui-border-width', '--apui-radius-md', '--apui-radius-xs', '--apui-text-default', '--apui-text-muted', '--apui-font-family-mono', '--apui-type-code-md-font-size', '--apui-type-code-md-line-height', '--apui-selected-bg', '--apui-selected-indicator-width', '--apui-color-primary', '--apui-color-success-text', '--apui-focus-ring-color', '--apui-focus-ring-width' ],
		'fixture'     => [
			'props' => [
				'code'      => 'export function formatPrice(amount: number, currency = \'USD\') {
  // Tabular figures line up in tables
  return new Intl.NumberFormat(\'en-US\', {
    style: \'currency\',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
',
				'fileName'  => 'format-price.ts',
				'language'  => 'TypeScript',
				'numbered'  => true,
				'highlight' => [ 3 ],
			],
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
	'Collapse'          => [
		'name'        => 'Collapse',
		'description' => 'A single disclosure: a button that shows and hides one region, such as advanced settings, or a read-more that clamps long text behind a fade.',
		'status'      => 'draft',
		'issue'       => 58,
		'rootClass'   => 'apui-collapse',
		'stacks'      => [
			'livewire' => [
				'name'         => 'collapse',
				'capabilities' => [ 'Slots: trigger replaces label; the deprecated heading and content slots still render', 'wire:model binds open' ],
			],
			'react'    => [
				'name' => 'Collapse',
			],
			'vue'      => [
				'name'         => 'Collapse',
				'capabilities' => [ 'Slots: trigger replaces label' ],
			],
		],
		'props'       => [
			[
				'name'        => 'open',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Whether the region shows. Livewire binds it with wire:model, Vue with v-model:open. Setting it doesn\'t fire open-change.',
			],
			[
				'name'        => 'defaultOpen',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Whether an uncontrolled collapse starts open.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'section', 'read-more' ],
				'default'     => 'section',
				'description' => 'Section hides the region while closed. Read-more shows its first lines behind a fade and puts the trigger after them. Emitted as data-variant.',
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'The trigger\'s text: say what will appear (Advanced settings). Read-more defaults it to Read more; Livewire translates the default with __().',
			],
			[
				'name'        => 'openLabel',
				'type'        => 'string',
				'description' => 'The trigger\'s text while open, when it should change. Read-more defaults it to Show less; Livewire translates the default with __().',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'The trigger can\'t be focused or toggled.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { trigger: \'…\', content: \'…\' }.',
			],
		],
		'variants'    => [ 'section', 'read-more' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'Holds the trigger and the region. data-state is open or closed.',
			],
			[
				'name'        => 'trigger',
				'element'     => 'button',
				'description' => 'The button: aria-expanded, and aria-controls the region. Before the region in a section, after it in a read-more.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'The chevron at the trigger\'s end; it turns up while open. Zag\'s indicator.',
			],
			[
				'name'        => 'content',
				'element'     => 'div',
				'description' => 'The region. A section\'s is hidden while closed; a read-more\'s is clamped to --apui-collapse-clamp-height. The spec calls it panel; it keeps Zag\'s name (D-019).',
			],
			[
				'name'        => 'fade',
				'element'     => 'span',
				'description' => 'Read-more only: the gradient over the clamped text\'s last line, hidden while open. aria-hidden.',
			],
		],
		'events'      => [
			[
				'name'        => 'open-change',
				'description' => 'The region opened or closed from the trigger. Setting open doesn\'t fire it.',
				'payload'     => 'boolean',
			],
		],
		'a11y'        => [
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Enter, Space',
					'action' => 'Opens or closes the region.',
				],
				[
					'keys'   => 'Tab',
					'action' => 'Moves from the trigger into the open region.',
				],
			],
			'requirements' => [ 'The trigger is a button with aria-expanded and aria-controls; a section\'s region follows it in the DOM.', 'A closed section\'s region is hidden; a closed read-more\'s text stays in the accessibility tree, only clamped visually.', 'The fade is decorative and aria-hidden.', 'The trigger\'s text says what will appear, and the chevron is aria-hidden.', 'Don\'t clamp text that holds the main point.', 'The focus ring shows on the trigger.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '2.1.1', '2.4.6', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-collapse-clamp-height', '--apui-color-primary-text', '--apui-text-disabled', '--apui-surface-default', '--apui-radius-xs', '--apui-motion-duration-fast', '--apui-motion-ease-standard', '--apui-focus-ring-color' ],
		'fixture'     => [
			'content' => 'Twenty-four bright apartments around a shared garden courtyard, five minutes from the tram. Most units face south with private balconies. The building was renovated in 2024 with new windows, heat pumps and a rooftop terrace.',
			'props'   => [
				'label' => 'Advanced settings',
			],
			'parts'   => [
				'variant' => 'read-more',
			],
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
	'Diff'              => [
		'name'        => 'Diff',
		'description' => 'Shows the changes between two versions of a text, unified or side by side, with hunks of context around each change and the changed words marked. Every stack computes the same diff, so there is no diff library and no script. The header mirrors in RTL; the code stays LTR.',
		'status'      => 'draft',
		'issue'       => 61,
		'rootClass'   => 'apui-diff',
		'stacks'      => [
			'livewire' => [
				'name'         => 'diff',
				'capabilities' => [ 'Rendered on the server, with no script', 'The actions slot holds header controls, such as a Clipboard or a view switch bound with wire:model.live', '2.x old and new still work, as oldContent and newContent' ],
			],
			'react'    => [
				'name'         => 'Diff',
				'capabilities' => [ 'actions takes a node' ],
			],
			'vue'      => [
				'name'         => 'Diff',
				'capabilities' => [ 'The actions slot holds header controls' ],
			],
		],
		'props'       => [
			[
				'name'        => 'oldContent',
				'type'        => 'string',
				'description' => 'The earlier version.',
			],
			[
				'name'        => 'newContent',
				'type'        => 'string',
				'description' => 'The later version.',
			],
			[
				'name'        => 'fileName',
				'type'        => 'string',
				'description' => 'What changed, at the start of the header: a file path or "Version 3 → Version 4".',
			],
			[
				'name'        => 'view',
				'type'        => 'enum',
				'values'      => [ 'unified', 'split' ],
				'default'     => 'unified',
				'description' => 'One column with both line numbers, or the old version beside the new one, deletions paired with additions. Emitted as data-view.',
			],
			[
				'name'        => 'wordLevel',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Marks the changed words inside a changed line, in ins and del, when the old and new line share some words. Best for short edits.',
			],
			[
				'name'        => 'context',
				'type'        => 'number',
				'default'     => 3,
				'description' => 'Unchanged lines kept around each change. Changes further apart than twice this start a new hunk.',
			],
			[
				'name'        => 'countsLabel',
				'type'        => 'string',
				'default'     => '{additions} additions, {deletions} deletions',
				'description' => 'The counts\' text for assistive technology; {additions} and {deletions} are filled in. Translate it: Livewire defaults it through __( \'{additions} additions, {deletions} deletions\' ).',
			],
			[
				'name'        => 'emptyLabel',
				'type'        => 'string',
				'default'     => 'No changes',
				'description' => 'Shown in the table when the versions are the same. Translate it: Livewire defaults it through __( \'No changes\' ).',
			],
			[
				'name'        => 'actions',
				'type'        => 'node',
				'description' => 'Controls at the end of the header, such as a copy button or a Tabs view switch.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { header: \'…\', code: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The frame, with data-view.',
			],
			[
				'name'        => 'header',
				'element'     => 'div',
				'description' => 'The icon, file name, counts and actions. Mirrors in RTL.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'A compare icon. Hidden from assistive technology.',
			],
			[
				'name'        => 'file',
				'element'     => 'span',
				'description' => 'The file name, in the mono font.',
			],
			[
				'name'        => 'counts',
				'element'     => 'span',
				'description' => '+additions and −deletions in success and error text, with countsLabel as hidden text.',
			],
			[
				'name'        => 'actions',
				'element'     => 'div',
				'description' => 'The header controls.',
			],
			[
				'name'        => 'table',
				'element'     => 'table',
				'description' => 'The lines. Always LTR (D-004).',
			],
			[
				'name'        => 'hunk',
				'element'     => 'tr',
				'description' => 'A hunk header (@@ -a,b +c,d @@), or emptyLabel when nothing changed.',
			],
			[
				'name'        => 'line',
				'element'     => 'tr',
				'description' => 'A line, with data-type ctx, add or del (unified), or a row pairing the old and new sides (split).',
			],
			[
				'name'        => 'lineNumber',
				'element'     => 'td',
				'description' => 'A line number: old and new in unified, one per side in split. Not selectable.',
			],
			[
				'name'        => 'sign',
				'element'     => 'td',
				'description' => '+, − or a space, so additions and deletions read without color. Not selectable.',
			],
			[
				'name'        => 'code',
				'element'     => 'td',
				'description' => 'The line\'s text, wrapping long lines. Every cell carries its side\'s data-type.',
			],
			[
				'name'        => 'ins',
				'element'     => 'ins',
				'description' => 'An added word: semibold with a success underline.',
			],
			[
				'name'        => 'del',
				'element'     => 'del',
				'description' => 'A deleted word: semibold and struck through.',
			],
		],
		'slots'       => [
			[
				'name'        => 'actions',
				'description' => 'Controls at the end of the header.',
			],
		],
		'events'      => [],
		'a11y'        => [
			'element'      => 'div',
			'requirements' => [ 'Every changed line has a + or − sign in text, and changed words are ins and del elements: color is never the only signal.', 'The counts are read as words (countsLabel); the visible +3 −2 is hidden from assistive technology.', 'The code stays LTR in every direction; the header around it mirrors.', 'Soft add and delete fills keep 4.5:1 for their text; line numbers keep 4.5:1 (--apui-text-muted).' ],
			'wcag'         => [ '1.3.1', '1.4.1', '1.4.3' ],
		],
		'tokens'      => [ '--apui-surface-default', '--apui-surface-sunken', '--apui-border-muted', '--apui-border-width', '--apui-radius-md', '--apui-text-default', '--apui-text-muted', '--apui-font-family-mono', '--apui-color-success-soft', '--apui-color-success-soft-foreground', '--apui-color-success-text', '--apui-color-success-border', '--apui-color-error-soft', '--apui-color-error-soft-foreground', '--apui-color-error-text', '--apui-color-error-border', '--apui-color-info-soft', '--apui-color-info-soft-foreground' ],
		'fixture'     => [
			'props' => [
				'fileName'   => 'listings/grove-greenfield.json',
				'oldContent' => '{
  id: 4127,
  name: "Grove Greenfield",
  beds: 3,
  price: 220000,
  rent: 1600,
  currency: "USD",
  available: "2027-01-01",
}
',
				'newContent' => '{
  id: 4127,
  name: "Grove Greenfield",
  beds: 3,
  price: 220000,
  rent: 1650,
  deposit: 3300,
  currency: "USD",
  available: "2027-01-15",
}
',
			],
			'parts' => [
				'actions' => 'Copy',
			],
		],
	],
	'Divider'           => [
		'name'        => 'Divider',
		'description' => 'Separates content with a muted rule: horizontal, vertical or with a label in the middle. Prefer spacing; add a divider only when groups blur together. Replaces Livewire\'s separator.',
		'status'      => 'draft',
		'issue'       => 58,
		'rootClass'   => 'apui-divider',
		'stacks'      => [
			'livewire' => [
				'name'         => 'divider',
				'capabilities' => [ 'The default slot is the label' ],
			],
			'react'    => [
				'name'         => 'Divider',
				'capabilities' => [ 'Children are the label' ],
			],
			'vue'      => [
				'name'         => 'Divider',
				'capabilities' => [ 'The default slot is the label' ],
			],
		],
		'props'       => [
			[
				'name'        => 'orientation',
				'type'        => 'enum',
				'values'      => [ 'horizontal', 'vertical' ],
				'default'     => 'horizontal',
				'description' => 'A rule across the inline axis, or a vertical one between items in a row, such as a toolbar. Emitted as data-orientation.',
			],
			[
				'name'        => 'label',
				'type'        => 'node',
				'description' => 'Text in the middle of the rule, such as or continue with.',
			],
			[
				'name'        => 'align',
				'type'        => 'enum',
				'values'      => [ 'start', 'center', 'end' ],
				'default'     => 'center',
				'description' => 'Where a label sits along the rule. Emitted as data-align.',
			],
			[
				'name'        => 'strength',
				'type'        => 'enum',
				'values'      => [ 'subtle', 'strong' ],
				'default'     => 'subtle',
				'description' => 'Subtle uses the muted border, strong the default border. Emitted as data-strength.',
			],
			[
				'name'        => 'decorative',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Hides the divider from assistive technology, for rules that only decorate. Emitted as data-decorative.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { label: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'hr | div',
				'description' => 'An hr for a plain horizontal rule; a div with role separator and aria-orientation for a vertical or labelled one, labelled by its label.',
			],
			[
				'name'        => 'label',
				'element'     => 'span',
				'description' => 'The label, with a rule on each side.',
			],
		],
		'a11y'        => [
			'element'      => 'hr',
			'role'         => 'separator',
			'requirements' => [ 'role=separator (an hr\'s own role), with aria-orientation on a vertical one.', 'A labelled divider is named by its label (aria-labelledby), since a separator\'s children are presentational.', 'A decorative divider is aria-hidden (role none on an hr).', 'The rule meets 3:1 against its surface only with strength strong; subtle rules are decorative contrast, like edges.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '4.1.2' ],
		],
		'tokens'      => [ '--apui-border-width', '--apui-border-muted', '--apui-border-default', '--apui-text-muted', '--apui-type-caption-font-size', '--apui-type-caption-line-height' ],
		'fixture'     => [
			'props'  => [
				'label' => 'or continue with',
			],
			'parts'  => [
				'label' => 'or continue with',
			],
			'states' => [],
		],
	],
	'Drawer'            => [
		'name'        => 'Drawer',
		'description' => 'A panel that slides in from an edge for filters, details or secondary tasks. Built on the dialog machine: a modal drawer traps focus, locks scroll and hides the page behind it from assistive technology; Escape, the close button and the backdrop close it, and focus returns to the trigger. The side follows the reading direction. The bottom side is the spec\'s sheet.',
		'status'      => 'draft',
		'issue'       => 58,
		'rootClass'   => 'apui-drawer',
		'stacks'      => [
			'livewire' => [
				'name'         => 'drawer',
				'capabilities' => [ 'wire:model binds open both ways through $wire.entangle()' ],
			],
			'react'    => [
				'name' => 'Drawer',
			],
			'vue'      => [
				'name' => 'Drawer',
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
				'description' => 'The initial state of an uncontrolled drawer.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'side',
				'type'        => 'enum',
				'values'      => [ 'end', 'start', 'bottom' ],
				'default'     => 'end',
				'description' => 'The edge it slides in from. end is on the right in LTR and on the left in RTL; bottom is a full-width sheet with a handle. Emitted as data-side on the panel and the positioner.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md', 'lg' ],
				'default'     => 'md',
				'description' => 'The panel\'s width at the start or end side: 320px, --apui-drawer-width (400px) or 560px, never wider than the viewport. A bottom sheet is full width. Emitted as data-size.',
			],
			[
				'name'        => 'surface',
				'type'        => 'enum',
				'values'      => [ 'overlay', 'glass' ],
				'default'     => 'overlay',
				'description' => 'The panel\'s surface. Emitted as data-surface. Glass falls back to the overlay surface under reduced transparency and in high contrast.',
			],
			[
				'name'        => 'title',
				'type'        => 'node',
				'description' => 'The heading, linked to the panel with aria-labelledby.',
				'a11y'        => 'Every drawer needs a title; it is the panel\'s accessible name.',
			],
			[
				'name'        => 'description',
				'type'        => 'node',
				'description' => 'Supporting text under the title, linked with aria-describedby.',
			],
			[
				'name'        => 'footer',
				'type'        => 'node',
				'description' => 'The actions row. Put the primary action here.',
			],
			[
				'name'        => 'trigger',
				'type'        => 'node',
				'description' => 'Content for a trigger button that opens the drawer. Without it, open the drawer through open.',
			],
			[
				'name'        => 'modal',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Traps focus, locks scroll and hides the rest of the page from assistive technology. Turn it off for a drawer that leaves the page usable.',
				'a11y'        => 'Sets aria-modal.',
			],
			[
				'name'        => 'portal',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Renders the drawer at the end of the body, above everything (x-teleport, a React portal, Vue Teleport). Off renders it in place.',
			],
			[
				'name'        => 'hideClose',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Hides the close button in the header. Escape still closes the drawer.',
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
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'aside',
				'description' => 'The panel, carrying the root class. It is the dialog machine\'s content part, so it also carries data-part="content" (D-019).',
			],
			[
				'name'        => 'content',
				'element'     => 'aside',
				'description' => 'The panel: the same element as root.',
			],
			[
				'name'        => 'trigger',
				'element'     => 'button',
				'description' => 'The button that opens the drawer, when trigger is set.',
			],
			[
				'name'        => 'backdrop',
				'element'     => 'div',
				'description' => 'The scrim behind the panel.',
			],
			[
				'name'        => 'positioner',
				'element'     => 'div',
				'description' => 'Fills the viewport and holds the panel against its side.',
			],
			[
				'name'        => 'handle',
				'element'     => 'div',
				'description' => 'The bottom sheet\'s grab handle. Decorative.',
			],
			[
				'name'        => 'header',
				'element'     => 'div',
				'description' => 'Title, description and close button.',
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
				'description' => 'The default slot. Scrolls when it\'s taller than the panel.',
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
				'description' => 'The drawer opened or closed itself: the trigger, Escape, the backdrop or the close button. Setting open doesn\'t fire it.',
				'payload'     => 'boolean',
			],
		],
		'a11y'        => [
			'role'         => 'dialog',
			'element'      => 'aside',
			'keyboard'     => [
				[
					'keys'   => 'Tab, Shift+Tab',
					'action' => 'Move between the controls inside; focus stays in a modal drawer.',
				],
				[
					'keys'   => 'Escape',
					'action' => 'Closes the drawer and returns focus to the trigger.',
				],
				[
					'keys'   => 'Enter, Space',
					'action' => 'On the trigger, opens the drawer.',
				],
			],
			'requirements' => [ 'Focus moves into the drawer on open and is trapped there while it\'s modal; it returns to the trigger on close.', 'The title is linked with aria-labelledby and the description with aria-describedby.', 'A modal drawer sets aria-modal, hides everything else from assistive technology and locks page scroll.', 'The side follows the reading direction: end is on the right in LTR and on the left in RTL, and the slide-in comes from that edge.', 'The close button has an accessible name (translatable, "Close").', 'Text keeps 4.5:1 and the panel\'s edge 3:1 on the overlay surface in every theme, glass included.', 'The slide-in animation is off under prefers-reduced-motion.', 'Every part keeps a stable, server-rendered id in Livewire, so morphs never replace the panel (D-015).', 'Don\'t open a drawer from a drawer.' ],
			'wcag'         => [ '1.3.1', '1.3.2', '1.4.3', '1.4.11', '2.1.1', '2.1.2', '2.4.3', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-drawer-width', '--apui-drawer-radius', '--apui-surface-overlay', '--apui-surface-glass', '--apui-surface-glass-border', '--apui-surface-glass-blur', '--apui-surface-glass-saturation', '--apui-elevation-overlay', '--apui-elevation-glass', '--apui-backdrop', '--apui-z-modal', '--apui-border-muted', '--apui-border-default', '--apui-text-default', '--apui-text-muted', '--apui-text-muted-glass', '--apui-field-gap' ],
		'fixture'     => [
			'content' => '218 properties match these filters.',
			'props'   => [
				'open'        => true,
				'modal'       => false,
				'portal'      => false,
				'title'       => 'Filters',
				'description' => 'Narrow the listings.',
				'footer'      => 'Show results',
			],
			'parts'   => [
				'trigger' => 'Filters',
				'side'    => 'bottom',
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
	'EmptyState'        => [
		'name'        => 'EmptyState',
		'description' => 'Explains why there\'s nothing here and what to do next: an icon tile, a title, a description and usually one primary action.',
		'status'      => 'draft',
		'issue'       => 60,
		'rootClass'   => 'apui-empty-state',
		'stacks'      => [
			'livewire' => [
				'name' => 'empty-state',
			],
			'react'    => [
				'name' => 'EmptyState',
			],
			'vue'      => [
				'name' => 'EmptyState',
			],
		],
		'props'       => [
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'first-use', 'no-results', 'cleared' ],
				'default'     => 'first-use',
				'description' => 'Why it\'s empty: nothing created yet, a search or filter matched nothing, or everything is done. Picks the tile\'s tint and default icon. Emitted as data-variant.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md' ],
				'default'     => 'md',
				'description' => 'md for a page or card; sm for a panel. Emitted as data-size.',
			],
			[
				'name'        => 'align',
				'type'        => 'enum',
				'values'      => [ 'center', 'start' ],
				'default'     => 'center',
				'description' => 'Centered, or aligned to the start in the reading direction. Emitted as data-align.',
			],
			[
				'name'        => 'icon',
				'type'        => 'string',
				'description' => 'An icon name from the registry. Defaults to the variant\'s: inbox, search-x or circle-check. A slot or node overrides it.',
			],
			[
				'name'        => 'title',
				'type'        => 'node',
				'description' => 'Why it\'s empty, as a heading.',
			],
			[
				'name'        => 'description',
				'type'        => 'node',
				'description' => 'What to do next. The default slot (children) fills it too.',
			],
			[
				'name'        => 'actions',
				'type'        => 'node',
				'description' => 'The buttons: one primary action, maybe a secondary one.',
			],
			[
				'name'        => 'headingLevel',
				'type'        => 'number',
				'default'     => 3,
				'description' => 'The title\'s heading level, 2 to 6, to fit the container\'s outline.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { title: \'…\', actions: \'…\' }.',
			],
		],
		'variants'    => [ 'first-use', 'no-results', 'cleared' ],
		'sizes'       => [ 'sm', 'md' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The empty state.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'The icon tile, tinted by the variant, hidden from assistive technology.',
			],
			[
				'name'        => 'title',
				'element'     => 'h2|h3|h4|h5|h6',
				'description' => 'The heading, at headingLevel.',
			],
			[
				'name'        => 'description',
				'element'     => 'div',
				'description' => 'What to do next.',
			],
			[
				'name'        => 'actions',
				'element'     => 'div',
				'description' => 'The action buttons.',
			],
		],
		'slots'       => [
			[
				'name'        => 'icon',
				'description' => 'Overrides the icon.',
			],
			[
				'name'        => 'title',
				'description' => 'Rich title content.',
			],
			[
				'name'        => 'description',
				'description' => 'Rich description. The default slot fills it too.',
			],
			[
				'name'        => 'actions',
				'description' => 'The action buttons.',
			],
		],
		'events'      => [],
		'a11y'        => [
			'element'      => 'div',
			'requirements' => [ 'The title is a heading at the right level for its container (headingLevel).', 'The icon is decorative (aria-hidden); the title and description carry the meaning.', 'Text keeps 4.5:1 and the tile is decorative, in every theme.' ],
			'wcag'         => [ '1.1.1', '1.3.1', '1.4.3', '2.4.6' ],
		],
		'tokens'      => [ '--apui-color-primary-soft', '--apui-color-primary-soft-foreground', '--apui-color-neutral-soft', '--apui-color-success-soft', '--apui-text-default', '--apui-text-muted', '--apui-radius-lg' ],
		'fixture'     => [
			'props' => [
				'title'       => 'No properties yet',
				'description' => 'Add your first property to start tracking visits, offers and revenue.',
			],
			'parts' => [
				'actions' => 'Add property',
			],
		],
	],
	'ErrorState'        => [
		'name'        => 'ErrorState',
		'description' => 'Explains what failed, what\'s safe and how to recover, in place of content that couldn\'t load: an icon tile or a large status number, a title, a description, a reference code people can quote and recovery actions. Pairs with EmptyState; it isn\'t ValidationSummary, which lists form errors.',
		'status'      => 'draft',
		'issue'       => 60,
		'rootClass'   => 'apui-error-state',
		'stacks'      => [
			'livewire' => [
				'name' => 'error-state',
			],
			'react'    => [
				'name'        => 'ErrorState',
				'differences' => [ 'ErrorDisplay stays as a deprecated alias (title, message, icon, onRetry, retryLabel).' ],
			],
			'vue'      => [
				'name'        => 'ErrorState',
				'differences' => [ 'ErrorDisplay stays as a deprecated alias (title, message, icon, retry event, retryLabel).' ],
			],
		],
		'props'       => [
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'request', 'offline', 'not-found', 'forbidden' ],
				'default'     => 'request',
				'description' => 'What failed: a request, the connection, a missing page or missing access. Picks the tile\'s tint and default icon (server-crash, wifi-off, lock); not-found shows the numeral 404 instead. Emitted as data-variant.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md' ],
				'default'     => 'md',
				'description' => 'md for a page or card; sm for a panel. Emitted as data-size.',
			],
			[
				'name'        => 'align',
				'type'        => 'enum',
				'values'      => [ 'center', 'start' ],
				'default'     => 'center',
				'description' => 'Centered, or aligned to the start in the reading direction. Emitted as data-align.',
			],
			[
				'name'        => 'icon',
				'type'        => 'string',
				'description' => 'An icon name from the registry. Defaults to the variant\'s. A slot or node overrides it; set explicitly, it shows beside a numeral too.',
			],
			[
				'name'        => 'numeral',
				'type'        => 'string',
				'description' => 'A large status number, such as 404 or 503, in place of the default icon. not-found defaults to 404.',
			],
			[
				'name'        => 'title',
				'type'        => 'node',
				'description' => 'What failed, as a heading. Don\'t blame the person.',
			],
			[
				'name'        => 'description',
				'type'        => 'node',
				'description' => 'What\'s safe and what to do. The default slot (children) fills it too.',
			],
			[
				'name'        => 'code',
				'type'        => 'string',
				'description' => 'A reference people can quote to support, such as Error 503 · req_8f2c91.',
			],
			[
				'name'        => 'actions',
				'type'        => 'node',
				'description' => 'Recovery buttons, such as Try again.',
			],
			[
				'name'        => 'headingLevel',
				'type'        => 'number',
				'default'     => 3,
				'description' => 'The title\'s heading level, 2 to 6. Use 1 for a full-page error.',
			],
			[
				'name'        => 'focusTitle',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Moves focus to the title when it renders (tabindex=-1), for a full-page error that replaces the page.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { title: \'…\', code: \'…\' }.',
			],
		],
		'variants'    => [ 'request', 'offline', 'not-found', 'forbidden' ],
		'sizes'       => [ 'sm', 'md' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The error state (role=alert), so an error that replaces content is announced.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'The icon tile, tinted by the variant, hidden from assistive technology.',
			],
			[
				'name'        => 'numeral',
				'element'     => 'span',
				'description' => 'The large status number.',
			],
			[
				'name'        => 'title',
				'element'     => 'h1|h2|h3|h4|h5|h6',
				'description' => 'The heading, at headingLevel.',
			],
			[
				'name'        => 'description',
				'element'     => 'div',
				'description' => 'What\'s safe and what to do.',
			],
			[
				'name'        => 'code',
				'element'     => 'span',
				'description' => 'The reference for support, in the mono font.',
			],
			[
				'name'        => 'actions',
				'element'     => 'div',
				'description' => 'The recovery buttons.',
			],
		],
		'slots'       => [
			[
				'name'        => 'icon',
				'description' => 'Overrides the icon.',
			],
			[
				'name'        => 'title',
				'description' => 'Rich title content.',
			],
			[
				'name'        => 'description',
				'description' => 'Rich description. The default slot fills it too.',
			],
			[
				'name'        => 'actions',
				'description' => 'The recovery buttons.',
			],
		],
		'events'      => [],
		'a11y'        => [
			'role'         => 'alert',
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves through the recovery actions; with focusTitle, focus starts on the title.',
				],
			],
			'requirements' => [ 'role=alert, so an error that replaces content is announced.', 'On a full-page error, focus moves to the title (focusTitle), which shows the focus ring.', 'The title is a heading at the right level; the icon is decorative (aria-hidden).', 'Say what failed and what\'s safe, include a reference code people can quote, and don\'t blame the person.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '2.4.3', '2.4.6', '2.4.7', '4.1.3' ],
		],
		'tokens'      => [ '--apui-color-error-soft', '--apui-color-error-soft-foreground', '--apui-color-warning-soft', '--apui-surface-sunken', '--apui-text-default', '--apui-text-muted', '--apui-font-family-mono', '--apui-radius-lg' ],
		'fixture'     => [
			'props' => [
				'title'       => 'Couldn\'t load transactions',
				'description' => 'The payments service didn\'t respond. Your data is safe; try again in a moment.',
				'code'        => 'Error 503 · req_8f2c91',
			],
			'parts' => [
				'icon'    => 'circle-alert',
				'numeral' => '503',
				'actions' => 'Try again',
			],
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
	'Grid'              => [
		'name'        => 'Grid',
		'description' => 'A layout primitive: its children in equal columns, with the gap from the space scale. With minItemWidth the columns drop as the grid narrows, so a dashboard reflows to one column on a phone. No Tailwind needed. Replaces Livewire\'s widget-grid.',
		'status'      => 'draft',
		'issue'       => 58,
		'rootClass'   => 'apui-grid',
		'stacks'      => [
			'livewire' => [
				'name' => 'grid',
			],
			'react'    => [
				'name' => 'Grid',
			],
			'vue'      => [
				'name' => 'Grid',
			],
		],
		'props'       => [
			[
				'name'        => 'columns',
				'type'        => 'number',
				'default'     => 1,
				'description' => 'The number of columns, 1 to 12; the most there are when minItemWidth is set. Emitted as data-columns.',
			],
			[
				'name'        => 'minItemWidth',
				'type'        => 'string',
				'description' => 'The narrowest a column may get, any CSS length (16rem). The grid shows fewer columns rather than narrower ones, down to one. Sets --apui-grid-min-item-width on the root.',
				'a11y'        => 'Set it for content that must reflow at 320px.',
			],
			[
				'name'        => 'gap',
				'type'        => 'enum',
				'values'      => [ '0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16' ],
				'default'     => '4',
				'description' => 'The space between rows and columns, a step of the space scale (4 is --apui-space-4, 16px). Emitted as data-gap.',
			],
			[
				'name'        => 'align',
				'type'        => 'enum',
				'values'      => [ 'start', 'center', 'end', 'stretch' ],
				'default'     => 'stretch',
				'description' => 'How items sit in their row along the block axis (align-items). Emitted as data-align.',
			],
			[
				'name'        => 'justify',
				'type'        => 'enum',
				'values'      => [ 'start', 'center', 'end', 'stretch' ],
				'default'     => 'stretch',
				'description' => 'How items sit in their column along the inline axis (justify-items), which follows the text direction. Emitted as data-justify.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The grid; every child is an item.',
			],
		],
		'a11y'        => [
			'element'      => 'div',
			'requirements' => [ 'Layout only: no role, and the reading order is the source order, which the columns keep.', 'Columns run in the text direction, so they start at the inline end in RTL.', 'With minItemWidth the grid reflows to one column at narrow widths (1.4.10).' ],
			'wcag'         => [ '1.3.2', '1.4.10' ],
		],
		'tokens'      => [ '--apui-space-0', '--apui-space-1', '--apui-space-2', '--apui-space-3', '--apui-space-4', '--apui-space-5', '--apui-space-6', '--apui-space-8', '--apui-space-10', '--apui-space-12', '--apui-space-16', '--apui-grid-min-item-width' ],
		'fixture'     => [
			'content' => 'Grid item',
			'props'   => [
				'columns' => 3,
			],
			'states'  => [],
		],
	],
	'Heading'           => [
		'name'        => 'Heading',
		'description' => 'A title from the type scale. level sets the semantic h1–h6 and size the visual size, so the outline stays right whatever the design calls for. An optional eyebrow labels the section above it.',
		'status'      => 'draft',
		'issue'       => 58,
		'rootClass'   => 'apui-heading',
		'stacks'      => [
			'livewire' => [
				'name'         => 'heading',
				'capabilities' => [ 'subheading stays as a deprecated alias of text with size lead: it was a paragraph, not a heading' ],
			],
			'react'    => [
				'name' => 'Heading',
			],
			'vue'      => [
				'name' => 'Heading',
			],
		],
		'props'       => [
			[
				'name'        => 'level',
				'type'        => 'enum',
				'values'      => [ '1', '2', '3', '4', '5', '6' ],
				'default'     => '2',
				'description' => 'The semantic level: renders h1–h6. Emitted as data-level.',
				'a11y'        => 'Keep one h1 per page and don\'t skip levels.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ '1', '2', '3', '4', '5', '6' ],
				'description' => 'The visual size, 1 (34/40) to 6 (14/20). Defaults to level. Emitted as data-size.',
			],
			[
				'name'        => 'eyebrow',
				'type'        => 'string',
				'description' => 'A short uppercase label for section context, rendered just before the heading. Not a second heading.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { eyebrow: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'h1 | h2 | h3 | h4 | h5 | h6',
				'description' => 'The heading.',
			],
			[
				'name'        => 'eyebrow',
				'element'     => 'p',
				'description' => 'The section label, a sibling just before the heading.',
			],
		],
		'slots'       => [
			[
				'name'        => 'eyebrow',
				'description' => 'Rich eyebrow content.',
			],
		],
		'events'      => [],
		'a11y'        => [
			'element'      => 'h2',
			'requirements' => [ 'A native heading element at level; size only changes how it looks.', 'Keep one h1 per page and don\'t skip levels.', 'The eyebrow is a paragraph before the heading, so it never adds a level to the outline.', 'Weight is 600 at most; text keeps 4.5:1 (--apui-text-default, eyebrow --apui-text-muted).' ],
			'wcag'         => [ '1.3.1', '1.4.3', '2.4.6' ],
		],
		'tokens'      => [ '--apui-text-default', '--apui-text-muted', '--apui-font-weight-semibold', '--apui-type-display-lg-font-size', '--apui-type-heading-xl-font-size', '--apui-type-heading-lg-font-size', '--apui-type-heading-md-font-size', '--apui-type-heading-sm-font-size', '--apui-type-body-md-font-size', '--apui-type-eyebrow-font-size' ],
		'fixture'     => [
			'content' => 'Every property, one calm place',
			'parts'   => [
				'eyebrow' => 'Portfolio',
			],
		],
	],
	'Icon'              => [
		'name'        => 'Icon',
		'description' => 'One Lucide icon from the registry (D-017) at four sizes, or in a soft-colored tile. Decorative unless it has a label. Directional icons mirror in RTL.',
		'status'      => 'draft',
		'issue'       => 65,
		'rootClass'   => 'apui-icon',
		'stacks'      => [
			'livewire' => [
				'name'         => 'icon',
				'capabilities' => [ 'Names outside the registry fall back to blade-icons, so the 2.x heroicon (o-plus) and Font Awesome (fas.user) names keep rendering, through the ap.livewireUiComponents.iconAlias filter' ],
			],
			'react'    => [
				'name' => 'Icon',
			],
			'vue'      => [
				'name' => 'Icon',
			],
		],
		'variants'    => [ 'plain', 'tile' ],
		'sizes'       => [ 'sm', 'md', 'lg', 'xl' ],
		'colors'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
		'props'       => [
			[
				'name'        => 'name',
				'type'        => 'string',
				'description' => 'A registered icon name, Lucide\'s kebab-case (house, arrow-right). The default slot (children) overrides it with your own <svg>.',
			],
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'plain', 'tile' ],
				'default'     => 'plain',
				'description' => 'plain is the bare glyph; tile puts it on a soft-colored rounded square (the root also gets the apui-icon-tile class). Emitted as data-variant.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md', 'lg', 'xl' ],
				'default'     => 'md',
				'description' => 'The glyph: 14, 16, 20 or 24px. A tile is 32, 40, 48 or 56px around a 16, 16, 20 or 24px glyph. Emitted as data-size.',
			],
			[
				'name'        => 'color',
				'type'        => 'enum',
				'values'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
				'description' => 'A plain icon takes the color\'s text tone; a tile takes its soft fill and soft foreground. Unset, a plain icon draws in currentColor and a tile is neutral. Emitted as data-color.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'description' => 'The accessible name. With it the icon is role=img with aria-label; without it the icon is decorative and aria-hidden.',
				'a11y'        => 'Label an icon that carries meaning on its own. Next to text that says the same thing, leave it decorative.',
			],
			[
				'name'        => 'mirror',
				'type'        => 'boolean',
				'description' => 'Flips the glyph in RTL. Unset, it follows the registry: arrow-left, arrow-right, chevron-left and chevron-right (and names an app marks directional) mirror. Emitted as data-mirror.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part: { root, svg }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'span',
				'description' => 'Sizes and colors the glyph; in the tile variant it is the tile. role=img with aria-label when labeled, else aria-hidden.',
			],
			[
				'name'        => 'svg',
				'element'     => 'svg',
				'description' => 'The registry\'s 24×24 Lucide glyph, stroke 1.5 in currentColor. Not rendered when the default slot gives your own <svg>.',
			],
		],
		'slots'       => [
			[
				'name'        => 'default',
				'description' => 'Your own <svg>, drawn in place of the named icon at the same size. Keep it on a 24px grid in currentColor.',
			],
		],
		'a11y'        => [
			'role'         => 'img',
			'element'      => 'span',
			'requirements' => [ 'Decorative icons (no label) are aria-hidden, so screen readers skip them.', 'A labeled icon is role=img with aria-label; the svg inside stays aria-hidden.', 'Directional icons mirror under RTL; others (trends, clocks, external links) never do.', 'A plain icon draws in currentColor, so it meets the contrast of the text around it; colored icons use the color\'s text tone (4.5:1).', 'A tile\'s soft foreground meets 3:1 against its fill in every theme, and the tile gets an edge in high contrast (D-035).' ],
			'wcag'         => [ '1.1.1', '1.4.11', '4.1.2' ],
		],
		'tokens'      => [ '--apui-icon-size-sm', '--apui-icon-size-md', '--apui-icon-size-lg', '--apui-radius-sm', '--apui-radius-md', '--apui-radius-lg', '--apui-color-neutral-soft', '--apui-color-neutral-soft-foreground', '--apui-color-primary-text', '--apui-color-primary-soft', '--apui-color-primary-soft-foreground', '--apui-color-primary-border', '--apui-border-soft-edge-width' ],
		'fixture'     => [
			'props'  => [
				'name'  => 'house',
				'label' => 'Home',
			],
			'states' => [],
		],
	],
	'ImageGallery'      => [
		'name'        => 'ImageGallery',
		'description' => 'A grid of images that opens a lightbox: a dark dialog with the image, a counter and caption, previous and next buttons, thumbnails and arrow keys that follow the text direction. Replaces the 2.x PhotoSwipe integration.',
		'status'      => 'draft',
		'issue'       => 61,
		'rootClass'   => 'apui-image-gallery',
		'stacks'      => [
			'livewire' => [
				'name'         => 'image-gallery',
				'capabilities' => [ 'wire:model binds the lightbox\'s open state both ways through $wire.entangle()', 'Images also accept the 2.x url key for src, and plain URL strings' ],
			],
			'react'    => [
				'name' => 'ImageGallery',
			],
			'vue'      => [
				'name' => 'ImageGallery',
			],
		],
		'props'       => [
			[
				'name'        => 'images',
				'type'        => 'array',
				'required'    => true,
				'description' => 'The images, in order: { src, alt, caption }. alt describes the image; caption is visible text under it.',
				'a11y'        => 'Every image needs alt text that describes it. A caption doesn\'t replace it.',
			],
			[
				'name'        => 'columns',
				'type'        => 'number',
				'default'     => 4,
				'description' => 'How many columns the grid has. Emitted as --apui-_image-gallery-columns.',
			],
			[
				'name'        => 'featured',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'The first image spans two columns and two rows. Emitted as data-featured.',
			],
			[
				'name'        => 'lightbox',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Each image is a button that opens the lightbox. Off renders a plain grid of figures.',
			],
			[
				'name'        => 'open',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Whether the lightbox is open. Livewire binds it with wire:model, Vue with v-model:open. Emitted as data-state on the lightbox\'s parts.',
			],
			[
				'name'        => 'defaultOpen',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'The initial state of an uncontrolled lightbox.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'index',
				'type'        => 'number',
				'default'     => 0,
				'description' => 'The image the lightbox shows, 0-based. Pair it with index-change to control it.',
			],
			[
				'name'        => 'defaultIndex',
				'type'        => 'number',
				'default'     => 0,
				'description' => 'The initial image of an uncontrolled lightbox.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'downloadable',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Adds a download link for the image shown to the lightbox\'s bar.',
			],
			[
				'name'        => 'modal',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Traps focus in the lightbox, locks scroll and hides the rest of the page from assistive technology.',
				'a11y'        => 'Sets aria-modal.',
			],
			[
				'name'        => 'portal',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Renders the lightbox at the end of the body (x-teleport, a React portal, Vue Teleport). Off renders it in place.',
			],
			[
				'name'        => 'closeLabel',
				'type'        => 'string',
				'default'     => 'Close',
				'description' => 'The lightbox\'s close button. Translate it: Livewire defaults it through __( \'Close\' ).',
				'a11y'        => 'The close button is icon-only, so this is its only name.',
			],
			[
				'name'        => 'previousLabel',
				'type'        => 'string',
				'default'     => 'Previous photo',
				'description' => 'The previous button\'s accessible name.',
				'a11y'        => 'The button is icon-only, so this is its only name.',
			],
			[
				'name'        => 'nextLabel',
				'type'        => 'string',
				'default'     => 'Next photo',
				'description' => 'The next button\'s accessible name.',
				'a11y'        => 'The button is icon-only, so this is its only name.',
			],
			[
				'name'        => 'downloadLabel',
				'type'        => 'string',
				'default'     => 'Download',
				'description' => 'The download link\'s accessible name.',
			],
			[
				'name'        => 'counterLabel',
				'type'        => 'string',
				'default'     => '{index} / {count}',
				'description' => 'The counter before the caption in the lightbox\'s title. {index} and {count} are replaced; Livewire\'s __() string uses :index and :count.',
			],
			[
				'name'        => 'thumbsLabel',
				'type'        => 'string',
				'default'     => 'Photos',
				'description' => 'Names the lightbox\'s thumbnail strip.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { grid: \'…\', content: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'Holds the grid and the lightbox.',
			],
			[
				'name'        => 'grid',
				'element'     => 'div',
				'description' => 'The grid of figures, in columns columns.',
			],
			[
				'name'        => 'item',
				'element'     => 'figure',
				'description' => 'One image and its caption. The featured item spans two columns and rows.',
			],
			[
				'name'        => 'trigger',
				'element'     => 'button',
				'description' => 'The button over an image that opens the lightbox on it, named by the image\'s alt text. Not rendered without lightbox.',
			],
			[
				'name'        => 'image',
				'element'     => 'img',
				'description' => 'An image: lazy-loaded in the grid, contained in the lightbox\'s stage.',
			],
			[
				'name'        => 'caption',
				'element'     => 'figcaption',
				'description' => 'The caption, over the image\'s foot. It shows on hover and focus, and always where there\'s no hover.',
			],
			[
				'name'        => 'backdrop',
				'element'     => 'div',
				'description' => 'The scrim behind the lightbox.',
			],
			[
				'name'        => 'positioner',
				'element'     => 'div',
				'description' => 'Fills the viewport and centers the lightbox.',
			],
			[
				'name'        => 'content',
				'element'     => 'div',
				'description' => 'The lightbox: a dialog panel with the .apui-lightbox class. The spec calls it lightbox; it keeps Zag\'s name (D-019).',
			],
			[
				'name'        => 'bar',
				'element'     => 'div',
				'description' => 'The lightbox\'s top row: title, download and close.',
			],
			[
				'name'        => 'title',
				'element'     => 'h2',
				'description' => 'The counter and caption ("3 / 6 · Evening, west façade"): the dialog\'s name, announced as it changes.',
			],
			[
				'name'        => 'download',
				'element'     => 'a',
				'description' => 'A download link for the image shown, with downloadable.',
			],
			[
				'name'        => 'closeTrigger',
				'element'     => 'button',
				'description' => 'The close button: a ghost, neutral, small icon-only Button.',
			],
			[
				'name'        => 'stage',
				'element'     => 'div',
				'description' => 'The image shown, with the previous and next buttons over it.',
			],
			[
				'name'        => 'prevTrigger',
				'element'     => 'button',
				'description' => 'Shows the previous image, wrapping: a soft, neutral icon-only Button. The spec\'s nav (prev).',
			],
			[
				'name'        => 'nextTrigger',
				'element'     => 'button',
				'description' => 'Shows the next image, wrapping. The spec\'s nav (next).',
			],
			[
				'name'        => 'thumbs',
				'element'     => 'div',
				'description' => 'The strip of thumbnails under the stage.',
			],
			[
				'name'        => 'thumb',
				'element'     => 'button',
				'description' => 'A thumbnail that shows its image; aria-current marks the one shown.',
			],
		],
		'slots'       => [
			[
				'name'        => 'caption',
				'description' => 'Rich caption content for an image, by index (Livewire: a caption key in images).',
			],
		],
		'events'      => [
			[
				'name'        => 'open-change',
				'description' => 'The lightbox opened or closed itself: an image, Escape, the backdrop or the close button. Setting open doesn\'t fire it.',
				'payload'     => 'boolean',
			],
			[
				'name'        => 'index-change',
				'description' => 'The lightbox showed another image: an image, the arrow keys, the previous and next buttons or a thumbnail. Setting index doesn\'t fire it.',
				'payload'     => 'number',
			],
		],
		'a11y'        => [
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Enter, Space',
					'action' => 'On an image, opens the lightbox on it.',
				],
				[
					'keys'   => 'ArrowRight, ArrowLeft',
					'action' => 'In the lightbox: show the next or previous image, wrapping. They follow the text direction, so in RTL ArrowLeft shows the next image.',
				],
				[
					'keys'   => 'Home, End',
					'action' => 'In the lightbox: show the first or last image.',
				],
				[
					'keys'   => 'Escape',
					'action' => 'Closes the lightbox and returns focus to the image that opened it.',
				],
				[
					'keys'   => 'Tab, Shift+Tab',
					'action' => 'Move between the lightbox\'s buttons; focus stays in it while it\'s modal.',
				],
			],
			'requirements' => [ 'Every image has alt text; a grid image\'s button is named by it, and the lightbox shows the same alt.', 'The lightbox is a dialog named by its title, the counter and caption, which is announced as it changes.', 'Focus moves into the lightbox on open, is trapped there while it\'s modal, and returns to the image that opened it.', 'The previous, next, close and download buttons have accessible names (translatable).', 'The thumbnail shown carries aria-current and a ring, not opacity alone.', 'Captions are text, never baked into images, and stay readable over the image\'s foot.', 'Arrow keys follow the text direction; the previous and next icons mirror in RTL.', 'Every part keeps a stable, server-rendered id in Livewire (D-015).' ],
			'wcag'         => [ '1.1.1', '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.1.2', '2.4.3', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-radius-md', '--apui-radius-lg', '--apui-radius-sm', '--apui-surface-sunken', '--apui-backdrop', '--apui-z-modal', '--apui-focus-ring-color', '--apui-focus-ring-offset-color', '--apui-text-default', '--apui-motion-duration-fast', '--apui-motion-duration-moderate' ],
		'fixture'     => [
			'props'  => [
				'images'   => [
					[
						'src'     => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23f6d9a8\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23e9b77a\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%238aa7c4\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%235d7f9f\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%2333506d\'/%3E%3C/svg%3E',
						'alt'     => 'Sunrise over the ridge, seen from the east terrace',
						'caption' => 'Sunrise over the ridge',
					],
					[
						'src'     => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23cfe3e0\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23a9cbc4\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%235f8f7c\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%233f6b57\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%2324463a\'/%3E%3C/svg%3E',
						'alt'     => 'Courtyard garden with benches under the trees',
						'caption' => 'Courtyard garden',
					],
					[
						'src'     => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23e8b49a\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23c9786a\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%236e6c8f\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%234a4a6a\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%232b2b45\'/%3E%3C/svg%3E',
						'alt'     => 'The west facade at dusk',
						'caption' => 'Evening, west façade',
					],
					[
						'src'     => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23e4eef6\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23c4d8e8\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%239db8cf\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%236f8fab\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%2347637e\'/%3E%3C/svg%3E',
						'alt'     => 'Lake view from the window of unit 4A',
						'caption' => 'Lake view from 4A',
					],
					[
						'src'     => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23f4e2c4\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23e7c08d\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%23c98f5e\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%239c6a43\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%236b4630\'/%3E%3C/svg%3E',
						'alt'     => 'Rooftop terrace with lounge chairs',
						'caption' => 'Rooftop terrace',
					],
					[
						'src'     => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%231d2b44\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%232c3d5c\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%233c4f72\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%2325334d\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%23141c2c\'/%3E%3C/svg%3E',
						'alt'     => 'The street outside the entrance at night',
						'caption' => 'Street at night',
					],
				],
				'featured' => true,
				'columns'  => 4,
				'open'     => true,
				'index'    => 2,
				'modal'    => false,
				'portal'   => false,
			],
			'parts'  => [
				'downloadable' => true,
			],
			'states' => [],
		],
	],
	'ImageLibrary'      => [
		'name'        => 'ImageLibrary',
		'description' => 'A media manager: search, switch between grid and list, select one or many assets, upload, and inspect an asset in a details panel with editable alt text. Livewire only (D-003): it uploads through Livewire and syncs with the WithMediaSync trait; React and Vue use media-library\'s MediaModal and MediaGrid.',
		'status'      => 'draft',
		'issue'       => 61,
		'rootClass'   => 'apui-image-library',
		'stacks'      => [
			'livewire' => [
				'name'         => 'image-library',
				'capabilities' => [ 'wire:model names the uploads property and wire:library the library collection, as the WithMediaSync trait expects: uploads, replace, crop (with Cropper.js loaded), remove and drag-to-reorder (with SortableJS loaded) call its methods', 'Alt text edits set <library>.<key>.alt on the component', 'The 2.x preview collection still works as assets, and the 2.x *Text props as the labels' ],
			],
			'react'    => false,
			'vue'      => false,
		],
		'props'       => [
			[
				'name'        => 'assets',
				'type'        => 'array',
				'description' => 'The assets: { id, src, name, alt, size, width, height, type }. Livewire also takes a WithMediaSync library collection ({ uuid, url, … }) through preview.',
			],
			[
				'name'        => 'view',
				'type'        => 'enum',
				'values'      => [ 'grid', 'list' ],
				'default'     => 'grid',
				'description' => 'Thumbnails in a grid, or rows with the name and metadata. The toolbar switches it. Emitted as data-view.',
			],
			[
				'name'        => 'selectable',
				'type'        => 'enum',
				'values'      => [ 'single', 'multiple' ],
				'default'     => 'multiple',
				'description' => 'Whether one or many assets can be selected.',
				'a11y'        => 'Sets aria-multiselectable on the listbox.',
			],
			[
				'name'        => 'accept',
				'type'        => 'string',
				'default'     => 'image/png, image/jpeg',
				'description' => 'The file types uploads accept, as the file input\'s accept.',
			],
			[
				'name'        => 'droppable',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Files dropped on the library upload, with an overlay while they\'re dragged over it.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'default'     => 'Media library',
				'description' => 'Names the library\'s listbox. Translate it: Livewire defaults it through __().',
			],
			[
				'name'        => 'hint',
				'type'        => 'string',
				'description' => 'Help text under the grid.',
			],
			[
				'name'        => 'hideErrors',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Hides the library\'s validation errors.',
			],
			[
				'name'        => 'hideProgress',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Hides the upload progress bar.',
			],
			[
				'name'        => 'cropConfig',
				'type'        => 'object',
				'description' => 'Cropper.js options for the crop dialog, merged over the defaults.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { toolbar: \'…\', details: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The library: the main column and the details panel.',
			],
			[
				'name'        => 'main',
				'element'     => 'div',
				'description' => 'The toolbar, selection bar, progress, grid and hint.',
			],
			[
				'name'        => 'toolbar',
				'element'     => 'div',
				'description' => 'Search, the view switch and the upload button.',
			],
			[
				'name'        => 'search',
				'element'     => 'div',
				'description' => 'Holds the search Input, which filters assets by name as you type.',
			],
			[
				'name'        => 'spacer',
				'element'     => 'span',
				'description' => 'Pushes the view switch and upload to the end.',
			],
			[
				'name'        => 'view',
				'element'     => 'div',
				'description' => 'The grid and list buttons (aria-pressed).',
			],
			[
				'name'        => 'bulk',
				'element'     => 'div',
				'description' => 'The selection bar while assets are selected: select all, the count (announced) and actions.',
			],
			[
				'name'        => 'count',
				'element'     => 'span',
				'description' => '"2 selected": a polite live region.',
			],
			[
				'name'        => 'progress',
				'element'     => 'progress',
				'description' => 'Upload progress.',
			],
			[
				'name'        => 'grid',
				'element'     => 'div',
				'description' => 'The assets: role listbox, aria-multiselectable with multiple, one option in the Tab order.',
			],
			[
				'name'        => 'asset',
				'element'     => 'div',
				'description' => 'An asset: role option with aria-selected, named by its file name.',
			],
			[
				'name'        => 'thumb',
				'element'     => 'div',
				'description' => 'The asset\'s image, or a file icon.',
			],
			[
				'name'        => 'check',
				'element'     => 'span',
				'description' => 'The selection box over the thumbnail (decorative: the option carries the state).',
			],
			[
				'name'        => 'type',
				'element'     => 'span',
				'description' => 'The file type badge on files that aren\'t images.',
			],
			[
				'name'        => 'name',
				'element'     => 'span',
				'description' => 'The file name, truncated.',
			],
			[
				'name'        => 'meta',
				'element'     => 'span',
				'description' => 'Size and dimensions.',
			],
			[
				'name'        => 'empty',
				'element'     => 'div',
				'description' => 'Shown when there are no assets, or none match the search.',
			],
			[
				'name'        => 'hint',
				'element'     => 'p',
				'description' => 'The hint.',
			],
			[
				'name'        => 'error',
				'element'     => 'p',
				'description' => 'A validation error for the library.',
			],
			[
				'name'        => 'details',
				'element'     => 'aside',
				'description' => 'The details panel for the active asset: preview, title, alt text, metadata and actions. The spec calls it the details panel.',
			],
			[
				'name'        => 'preview',
				'element'     => 'div',
				'description' => 'The active asset, contained.',
			],
			[
				'name'        => 'title',
				'element'     => 'h3',
				'description' => 'The active asset\'s name.',
			],
			[
				'name'        => 'metadata',
				'element'     => 'dl',
				'description' => 'Dimensions, size and type.',
			],
			[
				'name'        => 'actions',
				'element'     => 'div',
				'description' => 'Insert, replace, crop and remove.',
			],
			[
				'name'        => 'dropzone',
				'element'     => 'div',
				'description' => 'The overlay while files are dragged over a droppable library.',
			],
		],
		'events'      => [
			[
				'name'        => 'selection-change',
				'description' => 'The selected assets changed. Livewire listens with x-on:selection-change or wire:model on a property through $wire.set in the listener.',
				'payload'     => 'string[]',
			],
			[
				'name'        => 'insert',
				'description' => 'Insert was pressed with assets selected (the active one when none are).',
				'payload'     => 'string[]',
			],
		],
		'a11y'        => [
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves into the listbox, to the active asset, then on to the details panel.',
				],
				[
					'keys'   => 'ArrowRight, ArrowLeft',
					'action' => 'Move to the next or previous asset. They follow the text direction, so in RTL ArrowLeft moves to the next asset.',
				],
				[
					'keys'   => 'ArrowDown, ArrowUp',
					'action' => 'Move a row down or up in the grid, one asset in the list.',
				],
				[
					'keys'   => 'Home, End',
					'action' => 'Move to the first or last asset.',
				],
				[
					'keys'   => 'Space',
					'action' => 'Selects or deselects the focused asset.',
				],
				[
					'keys'   => 'Ctrl+A, Cmd+A',
					'action' => 'Selects every asset shown, with multiple.',
				],
				[
					'keys'   => 'Escape',
					'action' => 'Clears the selection.',
				],
			],
			'requirements' => [ 'The grid is a listbox with aria-multiselectable; each asset is an option with aria-selected, named by its file name.', 'Only the active asset is in the Tab order (roving tabindex); the focus ring shows on its thumbnail.', 'The selection bar\'s count is a polite live region, so changes are announced.', 'Alt text is editable in the details panel and labelled; images without it are flagged there.', 'Removing assets asks for confirmation first.', 'Every icon-only button has a translatable accessible name.', 'Selection is shown by a ring and a checked box, not by color alone.', 'Arrow keys follow the text direction: in RTL ArrowLeft moves to the next asset.' ],
			'wcag'         => [ '1.1.1', '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.4.3', '2.4.7', '3.3.2', '4.1.2', '4.1.3' ],
		],
		'tokens'      => [ '--apui-radius-lg', '--apui-radius-md', '--apui-radius-sm', '--apui-border-muted', '--apui-border-default', '--apui-surface-default', '--apui-surface-sunken', '--apui-surface-raised', '--apui-selected-bg', '--apui-color-primary', '--apui-color-primary-soft-foreground', '--apui-checkbox-radius', '--apui-text-default', '--apui-text-muted', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'assets' => [
					[
						'id'     => '1',
						'src'    => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23e4eef6\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23c4d8e8\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%239db8cf\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%236f8fab\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%2347637e\'/%3E%3C/svg%3E',
						'name'   => 'lakeview-exterior.jpg',
						'alt'    => 'The building\'s lake-facing exterior',
						'size'   => '2.4 MB',
						'width'  => 4032,
						'height' => 3024,
						'type'   => 'JPEG',
					],
					[
						'id'     => '2',
						'src'    => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23cfe3e0\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23a9cbc4\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%235f8f7c\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%233f6b57\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%2324463a\'/%3E%3C/svg%3E',
						'name'   => 'courtyard-garden.jpg',
						'alt'    => 'Shared garden courtyard with benches',
						'size'   => '1.8 MB',
						'width'  => 3024,
						'height' => 4032,
						'type'   => 'JPEG',
					],
					[
						'id'   => '3',
						'src'  => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23e8b49a\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23c9786a\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%236e6c8f\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%234a4a6a\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%232b2b45\'/%3E%3C/svg%3E',
						'name' => 'west-facade.jpg',
						'alt'  => '',
						'size' => '3.1 MB',
						'type' => 'JPEG',
					],
					[
						'id'   => '4',
						'src'  => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23f6d9a8\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23e9b77a\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%238aa7c4\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%235d7f9f\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%2333506d\'/%3E%3C/svg%3E',
						'name' => 'view-from-4a.jpg',
						'alt'  => 'Sunrise over the ridge from unit 4A',
						'size' => '2.2 MB',
						'type' => 'JPEG',
					],
					[
						'id'   => '5',
						'src'  => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%231d2b44\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%232c3d5c\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%233c4f72\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%2325334d\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%23141c2c\'/%3E%3C/svg%3E',
						'name' => 'street-night.jpg',
						'alt'  => 'The street at night',
						'size' => '2.9 MB',
						'type' => 'JPEG',
					],
					[
						'id'   => '6',
						'name' => 'floor-plan.pdf',
						'size' => '640 KB',
						'type' => 'PDF',
					],
				],
				'label'  => 'Lakeview Lofts media',
			],
			'parts'  => [
				'assets'    => [
					[
						'id'     => '1',
						'src'    => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23e4eef6\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23c4d8e8\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%239db8cf\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%236f8fab\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%2347637e\'/%3E%3C/svg%3E',
						'name'   => 'lakeview-exterior.jpg',
						'alt'    => 'The building\'s lake-facing exterior',
						'size'   => '2.4 MB',
						'width'  => 4032,
						'height' => 3024,
						'type'   => 'JPEG',
					],
					[
						'id'     => '2',
						'src'    => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23cfe3e0\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23a9cbc4\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%235f8f7c\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%233f6b57\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%2324463a\'/%3E%3C/svg%3E',
						'name'   => 'courtyard-garden.jpg',
						'alt'    => 'Shared garden courtyard with benches',
						'size'   => '1.8 MB',
						'width'  => 3024,
						'height' => 4032,
						'type'   => 'JPEG',
					],
					[
						'id'   => '3',
						'src'  => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23e8b49a\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23c9786a\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%236e6c8f\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%234a4a6a\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%232b2b45\'/%3E%3C/svg%3E',
						'name' => 'west-facade.jpg',
						'alt'  => '',
						'size' => '3.1 MB',
						'type' => 'JPEG',
					],
					[
						'id'   => '4',
						'src'  => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23f6d9a8\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23e9b77a\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%238aa7c4\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%235d7f9f\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%2333506d\'/%3E%3C/svg%3E',
						'name' => 'view-from-4a.jpg',
						'alt'  => 'Sunrise over the ridge from unit 4A',
						'size' => '2.2 MB',
						'type' => 'JPEG',
					],
					[
						'id'   => '5',
						'src'  => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%231d2b44\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%232c3d5c\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%233c4f72\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%2325334d\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%23141c2c\'/%3E%3C/svg%3E',
						'name' => 'street-night.jpg',
						'alt'  => 'The street at night',
						'size' => '2.9 MB',
						'type' => 'JPEG',
					],
					[
						'id'   => '6',
						'name' => 'floor-plan.pdf',
						'size' => '640 KB',
						'type' => 'PDF',
					],
				],
				'droppable' => true,
				'hint'      => 'PNG or JPEG, up to 10 MB.',
			],
			'states' => [],
		],
	],
	'ImageSlider'       => [
		'name'        => 'ImageSlider',
		'description' => 'One large image per view with a glass caption, a counter, previous and next buttons, dots and optional thumbnails, on the carousel machine. Arrow keys on the dots follow the text direction.',
		'status'      => 'draft',
		'issue'       => 61,
		'rootClass'   => 'apui-image-slider',
		'stacks'      => [
			'livewire' => [
				'name'         => 'image-slider',
				'capabilities' => [ 'wire:model binds the slide shown (index) through $wire.entangle()', 'Images also accept the 2.x url key for src, and plain URL strings' ],
			],
			'react'    => [
				'name' => 'ImageSlider',
			],
			'vue'      => [
				'name' => 'ImageSlider',
			],
		],
		'props'       => [
			[
				'name'        => 'images',
				'type'        => 'array',
				'required'    => true,
				'description' => 'The slides, in order: { src, alt, caption, description }. The caption is the glass card\'s title.',
				'a11y'        => 'Every image needs alt text. Captions are text, never baked into the image.',
			],
			[
				'name'        => 'aspectRatio',
				'type'        => 'string',
				'default'     => '21 / 9',
				'description' => 'The frame\'s aspect ratio, as CSS takes it ("16 / 9"). Livewire also takes the 2.x "16:9". Emitted as --apui-_image-slider-ratio.',
			],
			[
				'name'        => 'index',
				'type'        => 'number',
				'default'     => 0,
				'description' => 'The slide shown, 0-based. Livewire binds it with wire:model. Pair it with index-change to control it.',
			],
			[
				'name'        => 'defaultIndex',
				'type'        => 'number',
				'default'     => 0,
				'description' => 'The initial slide of an uncontrolled slider.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'loop',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Wraps from the last slide to the first and back.',
			],
			[
				'name'        => 'autoplay',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Advances every interval ms, with a pause button. It pauses while the pointer or focus is on the slider.',
				'a11y'        => 'Autoplay always has a visible pause button (2.2.2).',
			],
			[
				'name'        => 'interval',
				'type'        => 'number',
				'default'     => 5000,
				'description' => 'Milliseconds between slides while autoplay runs.',
			],
			[
				'name'        => 'thumbnails',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Shows a strip of thumbnails under the frame.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'default'     => 'Photos',
				'description' => 'Names the slider region. Translate it: Livewire defaults it through __( \'Photos\' ).',
				'a11y'        => 'A page with several sliders names each one.',
			],
			[
				'name'        => 'previousLabel',
				'type'        => 'string',
				'default'     => 'Previous photo',
				'description' => 'The previous button\'s accessible name.',
				'a11y'        => 'The button is icon-only, so this is its only name.',
			],
			[
				'name'        => 'nextLabel',
				'type'        => 'string',
				'default'     => 'Next photo',
				'description' => 'The next button\'s accessible name.',
				'a11y'        => 'The button is icon-only, so this is its only name.',
			],
			[
				'name'        => 'indicatorLabel',
				'type'        => 'string',
				'default'     => 'Photo {index}',
				'description' => 'A dot\'s accessible name. {index} is replaced; Livewire\'s __() string uses :index.',
			],
			[
				'name'        => 'slideLabel',
				'type'        => 'string',
				'default'     => '{index} of {count}',
				'description' => 'A slide\'s accessible name. Livewire\'s __() string uses :index and :count.',
			],
			[
				'name'        => 'counterLabel',
				'type'        => 'string',
				'default'     => '{index} / {count}',
				'description' => 'The counter text. Livewire\'s __() string uses :index and :count.',
			],
			[
				'name'        => 'playLabel',
				'type'        => 'string',
				'default'     => 'Start slide rotation',
				'description' => 'The autoplay button\'s name while paused.',
			],
			[
				'name'        => 'pauseLabel',
				'type'        => 'string',
				'default'     => 'Stop slide rotation',
				'description' => 'The autoplay button\'s name while playing.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { viewport: \'…\', caption: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The carousel\'s region: role region with aria-roledescription carousel, named by label.',
			],
			[
				'name'        => 'viewport',
				'element'     => 'div',
				'description' => 'The rounded frame at aspectRatio, holding the track and the overlays.',
			],
			[
				'name'        => 'itemGroup',
				'element'     => 'div',
				'description' => 'The scroll-snapping track.',
			],
			[
				'name'        => 'item',
				'element'     => 'div',
				'description' => 'A slide: role group with aria-roledescription slide, named "2 of 6"; slides out of view are aria-hidden.',
			],
			[
				'name'        => 'image',
				'element'     => 'img',
				'description' => 'A slide\'s image, covering the frame.',
			],
			[
				'name'        => 'caption',
				'element'     => 'div',
				'description' => 'The glass card at the frame\'s start foot, with the slide\'s title and description.',
			],
			[
				'name'        => 'title',
				'element'     => 'p',
				'description' => 'The caption\'s title.',
			],
			[
				'name'        => 'description',
				'element'     => 'p',
				'description' => 'The caption\'s supporting text.',
			],
			[
				'name'        => 'progressText',
				'element'     => 'span',
				'description' => 'The glass counter ("2 / 6") at the top end. The spec calls it counter; it keeps Zag\'s name (D-019).',
			],
			[
				'name'        => 'prevTrigger',
				'element'     => 'button',
				'description' => 'Shows the previous slide: a soft, neutral icon-only Button. The spec\'s nav (prev).',
			],
			[
				'name'        => 'nextTrigger',
				'element'     => 'button',
				'description' => 'Shows the next slide. The spec\'s nav (next).',
			],
			[
				'name'        => 'indicatorGroup',
				'element'     => 'div',
				'description' => 'The glass row of dots at the foot\'s end. The spec calls it dots.',
			],
			[
				'name'        => 'indicator',
				'element'     => 'button',
				'description' => 'A dot that shows its slide; aria-current and a wider primary pill mark the one shown.',
			],
			[
				'name'        => 'autoplayTrigger',
				'element'     => 'button',
				'description' => 'Pauses and resumes autoplay, with autoplay.',
			],
			[
				'name'        => 'thumbs',
				'element'     => 'div',
				'description' => 'The strip of thumbnails under the frame, with thumbnails.',
			],
			[
				'name'        => 'thumb',
				'element'     => 'button',
				'description' => 'A thumbnail that shows its slide; aria-current marks the one shown.',
			],
		],
		'events'      => [
			[
				'name'        => 'index-change',
				'description' => 'The slider moved to another slide: a button, a dot, a thumbnail, a swipe or autoplay. Setting index doesn\'t fire it.',
				'payload'     => 'number',
			],
		],
		'a11y'        => [
			'role'         => 'region',
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Tab, Shift+Tab',
					'action' => 'Move between the previous and next buttons, the dots and the thumbnails.',
				],
				[
					'keys'   => 'Enter, Space',
					'action' => 'On a button, dot or thumbnail: shows its slide.',
				],
				[
					'keys'   => 'ArrowRight, ArrowLeft',
					'action' => 'On the dots: show the next or previous slide. They follow the text direction, so in RTL ArrowLeft shows the next slide.',
				],
				[
					'keys'   => 'Home, End',
					'action' => 'On the dots: show the first or last slide.',
				],
			],
			'requirements' => [ 'The root is a region with aria-roledescription carousel and a translatable name.', 'Each slide is a group with aria-roledescription slide, named by its position; slides out of view are hidden from assistive technology.', 'The track is a polite live region, off while autoplay runs, so moves are announced.', 'Every image has alt text; captions are text over a glass card, never baked into the image.', 'The previous and next buttons and the dots have accessible names (translatable); the dot shown carries aria-current.', 'Autoplay has a pause button and stops while the pointer or focus is on the slider (2.2.2).', 'Arrow keys follow the text direction; the previous and next icons mirror in RTL.', 'Glass falls back to the raised surface under reduced transparency and in high contrast.', 'Every part keeps a stable, server-rendered id in Livewire (D-015).' ],
			'wcag'         => [ '1.1.1', '1.3.1', '1.4.3', '1.4.11', '2.1.1', '2.2.2', '2.4.3', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-radius-lg', '--apui-radius-sm', '--apui-radius-full', '--apui-surface-sunken', '--apui-surface-glass', '--apui-surface-glass-border', '--apui-surface-glass-blur', '--apui-surface-glass-saturation', '--apui-elevation-glass', '--apui-surface-raised', '--apui-border-default', '--apui-color-primary', '--apui-text-default', '--apui-text-muted-glass', '--apui-focus-ring-color' ],
		'fixture'     => [
			'props'  => [
				'images'      => [
					[
						'src'         => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23e4eef6\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23c4d8e8\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%239db8cf\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%236f8fab\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%2347637e\'/%3E%3C/svg%3E',
						'alt'         => 'Lake view from the window of unit 4A',
						'caption'     => 'Lake view from 4A',
						'description' => 'South-facing, 11th floor · Lakeview Lofts, Chicago',
					],
					[
						'src'     => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23f6d9a8\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23e9b77a\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%238aa7c4\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%235d7f9f\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%2333506d\'/%3E%3C/svg%3E',
						'alt'     => 'Sunrise over the ridge, seen from the east terrace',
						'caption' => 'Sunrise over the ridge',
					],
					[
						'src'     => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23cfe3e0\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23a9cbc4\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%235f8f7c\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%233f6b57\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%2324463a\'/%3E%3C/svg%3E',
						'alt'     => 'Courtyard garden with benches under the trees',
						'caption' => 'Courtyard garden',
					],
					[
						'src' => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23e8b49a\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23c9786a\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%236e6c8f\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%234a4a6a\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%232b2b45\'/%3E%3C/svg%3E',
						'alt' => 'The west facade at dusk',
					],
					[
						'src'     => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%23f4e2c4\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%23e7c08d\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%23c98f5e\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%239c6a43\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%236b4630\'/%3E%3C/svg%3E',
						'alt'     => 'Rooftop terrace with lounge chairs',
						'caption' => 'Rooftop terrace',
					],
					[
						'src'     => 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20400%20300\'%20width=\'400\'%20height=\'300\'%3E%3Crect%20width=\'400\'%20height=\'300\'%20fill=\'%231d2b44\'/%3E%3Crect%20y=\'135\'%20width=\'400\'%20height=\'165\'%20fill=\'%232c3d5c\'/%3E%3Ccircle%20cx=\'280\'%20cy=\'96\'%20r=\'27\'%20fill=\'%23fff6e0\'/%3E%3Cpath%20d=\'M0%20186L72%20114L128%20156L200%2090L280%20165L340%20126L400%20174V300H0Z\'%20fill=\'%233c4f72\'/%3E%3Cpath%20d=\'M0%20225L100%20174L180%20216L248%20180L328%20222L400%20198V300H0Z\'%20fill=\'%2325334d\'/%3E%3Cpath%20d=\'M0%20264Q120%20240%20220%20264T400%20258V300H0Z\'%20fill=\'%23141c2c\'/%3E%3C/svg%3E',
						'alt'     => 'The street outside the entrance at night',
						'caption' => 'Street at night',
					],
				],
				'thumbnails'  => true,
				'aspectRatio' => '21 / 9',
				'label'       => 'Lakeview Lofts photos',
			],
			'parts'  => [
				'autoplay'   => true,
				'thumbnails' => true,
			],
			'states' => [],
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
	'Kbd'               => [
		'name'        => 'Kbd',
		'description' => 'A keyboard key or shortcut, as kbd elements. keys renders a combination in the platform\'s spelling: mod is ⌘ on macOS and iOS and Ctrl elsewhere, and the other modifiers follow (⌥ / Alt, ⇧ / Shift). Symbol keys carry their name as hidden text. Without keys, the content is one key.',
		'status'      => 'draft',
		'issue'       => 65,
		'rootClass'   => 'apui-kbd',
		'stacks'      => [
			'livewire' => [
				'name'         => 'kbd',
				'capabilities' => [ 'The server renders the other platforms\' keys; a small Alpine component swaps in ⌘, ⌥ and ⇧ on Apple platforms when platform is auto', '2.x content still works: <x-artisanpack-kbd>K</x-artisanpack-kbd> is one key' ],
			],
			'react'    => [
				'name'         => 'Kbd',
				'capabilities' => [ 'children is one key when keys is empty', 'The first render (and the server\'s) uses the other platforms\' keys; Apple keys show after mount' ],
			],
			'vue'      => [
				'name'         => 'Kbd',
				'capabilities' => [ 'The default slot is one key when keys is empty', 'The first render (and the server\'s) uses the other platforms\' keys; Apple keys show after mount' ],
			],
		],
		'props'       => [
			[
				'name'        => 'keys',
				'type'        => 'array',
				'description' => 'The keys of a shortcut, in order, such as [\'mod\', \'shift\', \'p\']. Named keys: mod, cmd, ctrl, alt (option), shift, enter, esc, tab, space, backspace, delete and the arrows (up, down, left, right). A single character is uppercased; anything else (F5, PgUp) shows as given. Renders a combo, even for one key.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md' ],
				'default'     => 'md',
				'description' => 'md for running text, sm inside menus, tooltips and other dense rows. Emitted as data-size on every key.',
			],
			[
				'name'        => 'platform',
				'type'        => 'enum',
				'values'      => [ 'auto', 'mac', 'other' ],
				'default'     => 'auto',
				'description' => 'Whose keys to show. auto checks the browser after it loads; mac and other fix it, such as when the server knows the platform.',
			],
			[
				'name'        => 'labels',
				'type'        => 'object',
				'description' => 'The hidden names of symbol keys, by name: command, control, option, shift, enter, tab, escape, backspace, up, down, left and right. Translate them: Livewire defaults each through __( \'Command\' ) and the rest.',
				'a11y'        => 'A symbol such as ⌘ reads as its name instead.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { combo: \'…\', key: \'…\' }.',
			],
		],
		'sizes'       => [ 'sm', 'md' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'kbd',
				'description' => 'The first key cap, or the only one.',
			],
			[
				'name'        => 'combo',
				'element'     => 'kbd',
				'description' => 'The outer kbd around a shortcut\'s keys (`.apui-kbd-combo`), as HTML nests kbd for combinations. Keeps its order in RTL.',
			],
			[
				'name'        => 'key',
				'element'     => 'kbd',
				'description' => 'A key cap (`.apui-kbd`), with data-size. A symbol shows hidden from assistive technology, followed by its name as hidden text.',
			],
		],
		'slots'       => [
			[
				'name'        => 'default',
				'description' => 'One key, when keys is empty.',
			],
		],
		'events'      => [],
		'a11y'        => [
			'element'      => 'kbd',
			'requirements' => [ 'Every key is a kbd element; a shortcut is a kbd of kbd elements.', 'Symbols (⌘, ⌥, ⇧, ⌃, ↵, arrows) have a text alternative read instead of the symbol.', 'The keys match the platform: ⌘ on Apple platforms, Ctrl elsewhere.', 'Not a control: never use Kbd as a button.' ],
			'wcag'         => [ '1.1.1', '1.3.1', '1.4.3' ],
		],
		'tokens'      => [ '--apui-kbd-radius', '--apui-border-default', '--apui-border-width', '--apui-surface-raised', '--apui-text-default', '--apui-text-muted', '--apui-font-family-mono', '--apui-type-code-sm-font-size' ],
		'fixture'     => [
			'props' => [
				'keys'     => [ 'mod', 'shift', 'enter' ],
				'platform' => 'other',
			],
			'parts' => [
				'labels' => [
					'enter' => 'Return key',
				],
			],
		],
	],
	'KpiCard'           => [
		'name'        => 'KpiCard',
		'description' => 'A headline metric in a Card: a Stat\'s label, value and change, with a sparkline of its trend beside the value and, when there is one, progress toward a target. A period control (a Select) can sit in the label row.',
		'status'      => 'draft',
		'issue'       => 61,
		'rootClass'   => 'apui-kpi-card',
		'stacks'      => [
			'livewire' => [
				'name'         => 'kpi-card',
				'capabilities' => [ 'The period slot holds a control, such as a Select bound with wire:model.live', '2.x title, value, icon, change, changeLabel and sparkline-data still work, mapped onto stat and sparkline' ],
			],
			'react'    => [
				'name'         => 'KpiCard',
				'capabilities' => [ 'period takes a node, such as a Select' ],
			],
			'vue'      => [
				'name'         => 'KpiCard',
				'capabilities' => [ 'The period slot holds a control, such as a Select with v-model' ],
			],
		],
		'props'       => [
			[
				'name'        => 'stat',
				'type'        => 'object',
				'description' => 'The metric, with Stat\'s props: { label, value, unit, icon, color, delta, change, trend, description, upLabel, downLabel, flatLabel }. color tints the icon tile and the target bar, and is emitted as data-color on the root.',
			],
			[
				'name'        => 'sparkline',
				'type'        => 'array',
				'description' => 'The metric\'s recent values, drawn as an area Sparkline beside the value. Use one scale for the cards in a row. Omit it and the value takes the row.',
			],
			[
				'name'        => 'sparklineLabel',
				'type'        => 'string',
				'default'     => 'Trend from {first} to {latest}',
				'description' => 'The sparkline\'s accessible label; {first}, {latest}, {min}, {max} and {count} are filled in. Translate it: Livewire defaults it through __( \'Trend from {first} to {latest}\' ).',
			],
			[
				'name'        => 'target',
				'type'        => 'object',
				'description' => 'Progress toward a goal: { value, max, label }. max defaults to 100; label names the goal ("Goal $25,000") and the bar. Show a target only when one exists.',
			],
			[
				'name'        => 'targetLabel',
				'type'        => 'string',
				'default'     => '{percent}% of goal',
				'description' => 'The text at the end of the target row; {percent}, {value} and {max} are filled in. Translate it: Livewire defaults it through __( \'{percent}% of goal\' ).',
			],
			[
				'name'        => 'period',
				'type'        => 'node',
				'description' => 'A control for the period, such as a Select, in the label row before the icon.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { value: \'…\', sparkline: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The card: .apui-card.apui-kpi-card, with data-color from stat.',
			],
			[
				'name'        => 'top',
				'element'     => 'div',
				'description' => 'The label row: label, period and icon.',
			],
			[
				'name'        => 'label',
				'element'     => 'span',
				'description' => 'What the metric measures.',
			],
			[
				'name'        => 'period',
				'element'     => 'div',
				'description' => 'The period control.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'The tinted icon tile. Hidden from assistive technology.',
			],
			[
				'name'        => 'row',
				'element'     => 'div',
				'description' => 'The summary beside the sparkline, aligned to their bottoms.',
			],
			[
				'name'        => 'summary',
				'element'     => 'div',
				'description' => 'The value and the foot.',
			],
			[
				'name'        => 'value',
				'element'     => 'span',
				'description' => 'The number, in tabular figures.',
			],
			[
				'name'        => 'unit',
				'element'     => 'span',
				'description' => 'The unit inside the value.',
			],
			[
				'name'        => 'foot',
				'element'     => 'span',
				'description' => 'The delta and description.',
			],
			[
				'name'        => 'delta',
				'element'     => 'span',
				'description' => 'The change: hidden direction text, an arrow and the change, with data-trend.',
			],
			[
				'name'        => 'description',
				'element'     => 'span',
				'description' => 'The context after the delta.',
			],
			[
				'name'        => 'sparkline',
				'element'     => 'svg',
				'description' => 'The trend: a Sparkline (.apui-sparkline, role=img) with a label stating the first and latest values.',
			],
			[
				'name'        => 'target',
				'element'     => 'div',
				'description' => 'Progress toward the goal: a small Progress, then targetText.',
			],
			[
				'name'        => 'targetText',
				'element'     => 'div',
				'description' => 'The goal\'s label at the start and targetLabel at the end.',
			],
		],
		'slots'       => [
			[
				'name'        => 'period',
				'description' => 'The period control, such as a Select.',
			],
		],
		'events'      => [],
		'a11y'        => [
			'element'      => 'div',
			'requirements' => [ 'The sparkline is role=img with a label that states its first and latest values; the target bar is a labeled progressbar with its percentage as text beside it.', 'The change follows Stat: visible text with an arrow and a hidden direction label, never color alone.', 'The icon tile is decorative and hidden from assistive technology.', 'Muted text keeps 4.5:1 on the card; the sparkline and bar keep 3:1.' ],
			'wcag'         => [ '1.1.1', '1.3.1', '1.4.1', '1.4.3', '1.4.11' ],
		],
		'tokens'      => [ '--apui-card-padding', '--apui-card-radius', '--apui-surface-default', '--apui-border-muted', '--apui-text-muted', '--apui-type-stat-md-font-size', '--apui-type-caption-font-size', '--apui-color-success-text', '--apui-color-error-text', '--apui-chart-1' ],
		'fixture'     => [
			'props' => [
				'stat'      => [
					'label'       => 'Profit',
					'value'       => '$15,708.98',
					'icon'        => 'trending-up',
					'color'       => 'success',
					'change'      => 8.1,
					'description' => 'vs last month',
				],
				'sparkline' => [ 2, 4, 2, 6, 8, 6, 10, 12, 14 ],
				'target'    => [
					'value' => 62,
					'label' => 'Goal $25,000',
				],
			],
			'parts' => [
				'stat'   => [
					'label'       => 'Profit',
					'value'       => '15,708.98',
					'unit'        => 'USD',
					'icon'        => 'trending-up',
					'color'       => 'success',
					'change'      => 8.1,
					'description' => 'vs last month',
				],
				'period' => 'This month',
			],
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
	'ListItem'          => [
		'name'        => 'ListItem',
		'description' => 'A row with leading, title, description and trailing parts. Set href or interactive and the title becomes a link or a button that covers the row, so the whole row is one target. Rows go in a List, whose variant frames them (bordered) or rules them (divided).',
		'status'      => 'draft',
		'issue'       => 58,
		'rootClass'   => 'apui-list-item',
		'stacks'      => [
			'livewire' => [
				'name'         => 'list-item',
				'capabilities' => [ 'Container: list (variant plain, bordered or divided); list-item children render as li', 'navigate adds wire:navigate to an internal href', 'The 2.x item, value, sub-value, avatar and link attributes still fill the row, deprecated' ],
			],
			'react'    => [
				'name'         => 'ListItem',
				'capabilities' => [ 'Container: List (variant plain, bordered or divided); ListItem children render as li' ],
			],
			'vue'      => [
				'name'         => 'ListItem',
				'capabilities' => [ 'Container: List (variant plain, bordered or divided); ListItem children render as li' ],
			],
		],
		'props'       => [
			[
				'name'        => 'title',
				'type'        => 'string',
				'description' => 'The row\'s main text. The title slot overrides it.',
			],
			[
				'name'        => 'description',
				'type'        => 'string',
				'description' => 'Secondary text under the title. The description slot overrides it.',
			],
			[
				'name'        => 'href',
				'type'        => 'string',
				'description' => 'Makes the title a link that covers the row. Only relative, http, https, mailto, tel and sms URLs are used.',
			],
			[
				'name'        => 'interactive',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Without href, makes the title a button that covers the row, for a click handler on the row. Emitted as data-interactive; href sets it too.',
			],
			[
				'name'        => 'selected',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Marks the current or chosen row. Emitted as data-selected.',
				'a11y'        => 'The row\'s link or button gets aria-current="true".',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Dims the row; its link or button is disabled. Emitted as data-disabled.',
				'a11y'        => 'A disabled link loses its href and gets aria-disabled.',
			],
			[
				'name'        => 'leadingIcon',
				'type'        => 'string',
				'description' => 'Icon name in the leading part, resolved through the icon registry. The leading slot overrides it, for an avatar or a thumbnail.',
			],
			[
				'name'        => 'trailing',
				'type'        => 'string',
				'description' => 'Short text at the end, such as a time or an amount. The trailing slot overrides it, for a badge or an action.',
			],
			[
				'name'        => 'navigate',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Adds wire:navigate to an internal href, so Livewire swaps the page in without a full reload.',
				'stacks'      => [ 'livewire' ],
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { title: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'li | div',
				'description' => 'The row: an li inside a List, a div on its own.',
			],
			[
				'name'        => 'leading',
				'element'     => 'span',
				'description' => 'An icon, avatar or thumbnail at the start.',
			],
			[
				'name'        => 'title',
				'element'     => 'span | a | button',
				'description' => 'The main text; a link or a button covering the row when it\'s interactive.',
			],
			[
				'name'        => 'description',
				'element'     => 'span',
				'description' => 'Secondary text under the title.',
			],
			[
				'name'        => 'trailing',
				'element'     => 'span',
				'description' => 'Short content at the end, above the row\'s link so its controls stay clickable.',
			],
		],
		'slots'       => [
			[
				'name'        => 'leading',
				'description' => 'Leading content, such as an avatar or a thumbnail.',
			],
			[
				'name'        => 'title',
				'description' => 'Rich title content.',
			],
			[
				'name'        => 'description',
				'description' => 'Rich description content.',
			],
			[
				'name'        => 'trailing',
				'description' => 'Trailing content, such as a badge or an icon button. Keep it short, and keep to one primary action per row.',
			],
		],
		'events'      => [],
		'a11y'        => [
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves to the row\'s link or button, then to any controls in trailing.',
				],
				[
					'keys'   => 'Enter',
					'action' => 'Follows the row\'s link or activates its button.',
				],
			],
			'requirements' => [ 'Interactive rows are links (href) or buttons (interactive), never a clickable li; the control covers the row.', 'Selection sets aria-current="true" on the row\'s link or button.', 'Rows in a List are li elements of a ul.', 'The focus ring is drawn inside the row, so rows in a list don\'t overlap it.', 'Title text keeps 4.5:1; the description is --apui-text-muted.', 'Disabled rows set aria-disabled, use --apui-text-disabled, and their link or button is disabled.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '2.1.1', '2.4.4', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-row-height', '--apui-cell-padding-x', '--apui-text-default', '--apui-text-muted', '--apui-text-disabled', '--apui-state-hover', '--apui-selected-bg', '--apui-border-muted', '--apui-surface-default', '--apui-radius-lg', '--apui-focus-ring-color', '--apui-focus-ring-offset-color' ],
		'fixture'     => [
			'props' => [
				'title'       => 'Olivia Rhye',
				'description' => 'olivia@company.com',
				'interactive' => true,
			],
			'parts' => [
				'leadingIcon' => 'mail',
				'trailing'    => '2m',
			],
		],
	],
	'Loading'           => [
		'name'        => 'Loading',
		'description' => 'Shows that work is in progress: a spinner or three dots, inline with a label or as an overlay over the region that is loading. It waits a moment before showing, so fast loads don\'t flash.',
		'status'      => 'draft',
		'issue'       => 60,
		'rootClass'   => 'apui-loading',
		'stacks'      => [
			'livewire' => [
				'name' => 'loading',
			],
			'react'    => [
				'name' => 'Loading',
			],
			'vue'      => [
				'name' => 'Loading',
			],
		],
		'props'       => [
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'spinner', 'dots' ],
				'default'     => 'spinner',
				'description' => 'The indicator: a spinning ring or three pulsing dots. Emitted as data-variant.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'xs', 'sm', 'md', 'lg', 'xl' ],
				'default'     => 'md',
				'description' => 'The indicator\'s size. Emitted as data-size.',
			],
			[
				'name'        => 'color',
				'type'        => 'enum',
				'values'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
				'default'     => 'primary',
				'description' => 'Tints the indicator. Emitted as data-color.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'default'     => 'Loading',
				'description' => 'What\'s loading, for screen readers: rendered visually hidden when there\'s no visible text. The default slot (children) shows visible text instead. Translate it: Livewire defaults it through __( \'Loading\' ).',
				'a11y'        => 'The status region\'s text, so it\'s announced.',
			],
			[
				'name'        => 'overlay',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Covers the nearest positioned ancestor on the glass surface, centered. Emitted as data-overlay. Set aria-busy on the region it covers.',
			],
			[
				'name'        => 'delay',
				'type'        => 'number',
				'default'     => 300,
				'description' => 'Milliseconds to wait before showing, so fast loads don\'t flash. Written inline as --apui-_delay; the root stays in the markup (and the live region in place) meanwhile.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { indicator: \'…\', label: \'…\' }.',
			],
		],
		'variants'    => [ 'spinner', 'dots' ],
		'sizes'       => [ 'xs', 'sm', 'md', 'lg', 'xl' ],
		'colors'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'span',
				'description' => 'The status region (role=status).',
			],
			[
				'name'        => 'indicator',
				'element'     => 'span',
				'description' => 'The spinner ring, or the dots (three spans). Hidden from assistive technology.',
			],
			[
				'name'        => 'label',
				'element'     => 'span',
				'description' => 'Visible text from the default slot, or the label, visually hidden.',
			],
		],
		'slots'       => [
			[
				'name'        => 'label',
				'description' => 'Visible text beside the indicator, such as Saving changes…; the default slot.',
			],
		],
		'events'      => [],
		'a11y'        => [
			'role'         => 'status',
			'element'      => 'span',
			'requirements' => [ 'role=status with a text label (visible, or visually hidden "Loading", translatable); the indicator is aria-hidden.', 'An overlay leaves aria-busy=true to the region it covers.', 'The spinner slows and the dots stop under reduced motion.', 'The indicator keeps 3:1 against its surface in forced colors.' ],
			'wcag'         => [ '1.3.1', '2.2.2', '4.1.3' ],
		],
		'tokens'      => [ '--apui-color-primary', '--apui-surface-sunken', '--apui-surface-glass', '--apui-text-muted' ],
		'fixture'     => [
			'props'  => [
				'delay' => 0,
			],
			'states' => [],
		],
	],
	'Markdown'          => [
		'name'        => 'Markdown',
		'description' => 'Renders GitHub-flavored Markdown (tables, task lists, strikethrough, autolinks) with the shared prose styles, and optionally edits it: write and split modes add Write, Preview and Split tabs over a Textarea. Every stack writes the same HTML: Livewire with league/commonmark, React and Vue with the behavior package\'s renderMarkdown. Raw HTML is escaped and unsafe link and image URLs are dropped.',
		'status'      => 'draft',
		'issue'       => 65,
		'rootClass'   => 'apui-markdown',
		'stacks'      => [
			'livewire' => [
				'name'         => 'markdown',
				'capabilities' => [ 'Rendered on the server with league/commonmark (GFM, html_input escape, allow_unsafe_links off), with no script in preview mode', 'wire:model on the component binds the source in write and split modes: it goes to the Textarea, and source defaults to the bound property. Use wire:model.live.debounce for a preview that follows typing; with a deferred wire:model, switching to Preview or Split sends the change first', '2.x EasyMDE options (config, disk, folder, label, hint and the error props) are removed' ],
			],
			'react'    => [
				'name'         => 'Markdown',
				'capabilities' => [ 'source with onSourceChange; without a handler the editor keeps its own draft', '2.x renderMarkdown is removed' ],
			],
			'vue'      => [
				'name'         => 'Markdown',
				'capabilities' => [ 'v-model:source, or source with source-change', '2.x content still works, as source' ],
			],
		],
		'props'       => [
			[
				'name'        => 'source',
				'type'        => 'string',
				'description' => 'The Markdown. In write and split modes it\'s the Textarea\'s value.',
			],
			[
				'name'        => 'mode',
				'type'        => 'enum',
				'values'      => [ 'preview', 'write', 'split' ],
				'default'     => 'preview',
				'description' => 'preview renders the Markdown only. write and split add Write, Preview and Split tabs over the source, opening on that tab; split shows the source beside the preview. Emitted as data-mode.',
			],
			[
				'name'        => 'sanitize',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Escape raw HTML in the source. false keeps an allowlist of formatting tags (kbd, sup, details, …) with safe attributes and escapes every other tag: script-capable markup never renders. Unsafe link and image URLs are dropped either way.',
			],
			[
				'name'        => 'tabsLabel',
				'type'        => 'string',
				'default'     => 'Markdown mode',
				'description' => 'Names the mode tabs. Translate it: Livewire defaults it through __( \'Markdown mode\' ).',
			],
			[
				'name'        => 'writeLabel',
				'type'        => 'string',
				'default'     => 'Write',
				'description' => 'The Write tab. Translate it: Livewire defaults it through __( \'Write\' ).',
			],
			[
				'name'        => 'previewLabel',
				'type'        => 'string',
				'default'     => 'Preview',
				'description' => 'The Preview tab. Translate it: Livewire defaults it through __( \'Preview\' ).',
			],
			[
				'name'        => 'splitLabel',
				'type'        => 'string',
				'default'     => 'Split',
				'description' => 'The Split tab. Translate it: Livewire defaults it through __( \'Split\' ).',
			],
			[
				'name'        => 'editorLabel',
				'type'        => 'string',
				'default'     => 'Markdown source',
				'description' => 'Names the source Textarea. Translate it: Livewire defaults it through __( \'Markdown source\' ).',
			],
			[
				'name'        => 'outputLabel',
				'type'        => 'string',
				'default'     => 'Rendered preview',
				'description' => 'Names the preview region in write and split modes. Translate it: Livewire defaults it through __( \'Rendered preview\' ).',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { preview: \'…\', editor: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The .apui-markdown root, with data-mode. In preview mode it also carries .apui-prose and holds the rendered Markdown, its line length capped at --apui-measure; in write and split modes it holds the Tabs.',
			],
			[
				'name'        => 'editor',
				'element'     => 'div',
				'description' => 'Holds the source Textarea, in the mono font.',
			],
			[
				'name'        => 'preview',
				'element'     => 'div',
				'description' => 'The rendered Markdown in write and split modes: an .apui-prose region named by outputLabel, on a card surface.',
			],
			[
				'name'        => 'split',
				'element'     => 'div',
				'description' => 'The Split tab\'s two columns: the editor beside the preview, stacked on narrow screens.',
			],
			[
				'name'        => 'task',
				'element'     => 'li',
				'description' => 'A task-list item: a disabled checkbox and the item\'s first line in a label.',
			],
		],
		'slots'       => [],
		'events'      => [
			[
				'name'        => 'source-change',
				'description' => 'The source was edited in the Textarea. Setting source doesn\'t fire it.',
				'payload'     => 'string',
			],
		],
		'a11y'        => [
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'ArrowRight, ArrowLeft',
					'action' => 'On the mode tabs: move between Write, Preview and Split, following the text direction.',
				],
				[
					'keys'   => 'Tab',
					'action' => 'From the selected tab into its panel: the Textarea, or the preview\'s links.',
				],
			],
			'requirements' => [ 'Headings keep their levels and tables keep their header cells (th), so the structure reads as written.', 'Task-list checkboxes are real, disabled checkboxes, named by their item\'s text through a label.', 'Raw HTML is escaped, or with sanitize=false filtered to formatting tags; event handlers, styles and unsafe URLs never render.', 'The mode tabs are design-system Tabs named by tabsLabel; the Textarea is named by editorLabel and the preview region by outputLabel.', 'Prose text keeps 4.5:1 on every surface; links are underlined, not marked by color alone.', 'Line length is capped (--apui-measure) for readability; the text reflows at 320px.', 'Code blocks stay LTR in RTL pages; everything else mirrors.' ],
			'wcag'         => [ '1.3.1', '1.4.1', '1.4.3', '1.4.10', '2.1.1', '4.1.2' ],
		],
		'tokens'      => [ '--apui-border-default', '--apui-border-muted', '--apui-border-width', '--apui-card-padding', '--apui-card-radius', '--apui-checkbox-radius', '--apui-color-primary', '--apui-color-primary-border', '--apui-color-primary-foreground', '--apui-color-primary-text', '--apui-color-warning-soft', '--apui-color-warning-soft-foreground', '--apui-focus-ring-color', '--apui-focus-ring-offset', '--apui-focus-ring-offset-color', '--apui-focus-ring-width', '--apui-font-family-mono', '--apui-font-family-sans', '--apui-font-weight-semibold', '--apui-kbd-radius', '--apui-measure', '--apui-radius-md', '--apui-radius-xs', '--apui-surface-default', '--apui-surface-sunken', '--apui-table-head-weight', '--apui-text-default', '--apui-text-muted', '--apui-type-body-md-font-size', '--apui-type-body-sm-font-size', '--apui-type-body-sm-line-height', '--apui-type-code-md-font-size', '--apui-type-code-md-line-height', '--apui-type-heading-lg-font-size', '--apui-type-heading-lg-letter-spacing', '--apui-type-heading-lg-line-height', '--apui-type-heading-md-font-size', '--apui-type-heading-md-line-height', '--apui-type-heading-sm-font-size', '--apui-type-heading-sm-line-height', '--apui-type-heading-xl-font-size', '--apui-type-heading-xl-letter-spacing', '--apui-type-heading-xl-line-height' ],
		'fixture'     => [
			'props' => [
				'mode'   => 'split',
				'source' => '## Viewing checklist

Bring **photo ID** and proof of income.

- [x] Confirm time with agent
- [ ] Measure the living room
- [ ] Ask about `heating costs`

> Viewings run 30 minutes.

| Unit | Rent |
|---|---:|
| 2B | $1,400 |
| 4A | $1,650 |
',
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
	'PageHeader'        => [
		'name'        => 'PageHeader',
		'description' => 'The title block at the top of a page: breadcrumbs, then the title with its description and meta beside the actions, then tabs. Replaces Livewire\'s header.',
		'status'      => 'draft',
		'issue'       => 58,
		'rootClass'   => 'apui-page-header',
		'stacks'      => [
			'livewire' => [
				'name'         => 'page-header',
				'capabilities' => [ 'Slots: breadcrumbs, meta, actions and tabs; title and description also take slots' ],
			],
			'react'    => [
				'name' => 'PageHeader',
			],
			'vue'      => [
				'name'         => 'PageHeader',
				'capabilities' => [ 'Slots: title, description, breadcrumbs, meta, actions and tabs' ],
			],
		],
		'props'       => [
			[
				'name'        => 'title',
				'type'        => 'node',
				'description' => 'The page\'s title.',
			],
			[
				'name'        => 'description',
				'type'        => 'node',
				'description' => 'Supporting text under the title, kept to the reading measure.',
			],
			[
				'name'        => 'level',
				'type'        => 'number',
				'default'     => 1,
				'description' => 'The title\'s heading level. The page\'s h1 by default; lower it when the header heads a section.',
				'a11y'        => 'One h1 per page: the page header\'s title.',
			],
			[
				'name'        => 'breadcrumbs',
				'type'        => 'node',
				'description' => 'Breadcrumbs above the title, usually a Breadcrumbs.',
			],
			[
				'name'        => 'meta',
				'type'        => 'node',
				'description' => 'Status above the title, such as a badge and an edited time.',
			],
			[
				'name'        => 'actions',
				'type'        => 'node',
				'description' => 'Buttons at the inline end of the title row, the primary one last. Keep to three; overflow into a DropdownMenu.',
			],
			[
				'name'        => 'tabs',
				'type'        => 'node',
				'description' => 'Tabs under the title row, usually Tabs with variant underline.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { title: \'…\', actions: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'Stacks the breadcrumbs, the row and the tabs.',
			],
			[
				'name'        => 'breadcrumbs',
				'element'     => 'div',
				'description' => 'Holds the breadcrumbs.',
			],
			[
				'name'        => 'row',
				'element'     => 'div',
				'description' => 'The title block and the actions, side by side; the actions wrap under the title when there\'s no room.',
			],
			[
				'name'        => 'meta',
				'element'     => 'div',
				'description' => 'Status above the title.',
			],
			[
				'name'        => 'title',
				'element'     => 'h1 | h2 | h3 | h4 | h5 | h6',
				'description' => 'The title, at level (h1 by default), in the heading-xl type style.',
			],
			[
				'name'        => 'description',
				'element'     => 'p',
				'description' => 'Supporting text, muted, no wider than the reading measure.',
			],
			[
				'name'        => 'actions',
				'element'     => 'div',
				'description' => 'The buttons at the inline end of the row.',
			],
			[
				'name'        => 'tabs',
				'element'     => 'div',
				'description' => 'Holds the tabs under the row.',
			],
		],
		'slots'       => [
			[
				'name'        => 'title',
				'description' => 'The title, when it needs markup.',
			],
			[
				'name'        => 'description',
				'description' => 'The description, when it needs markup.',
			],
			[
				'name'        => 'breadcrumbs',
				'description' => 'The breadcrumbs.',
			],
			[
				'name'        => 'meta',
				'description' => 'Status above the title.',
			],
			[
				'name'        => 'actions',
				'description' => 'The buttons.',
			],
			[
				'name'        => 'tabs',
				'description' => 'The tabs.',
			],
		],
		'a11y'        => [
			'element'      => 'div',
			'requirements' => [ 'The title is the page\'s h1 unless level says otherwise; keep one h1 per page.', 'The description is plain text after the heading, so it\'s read in order.', 'Actions keep the order they\'re read in: the primary action last, at the inline end.', 'The row wraps rather than overflowing at 320px (reflow).' ],
			'wcag'         => [ '1.3.1', '1.3.2', '1.4.3', '1.4.10', '2.4.6' ],
		],
		'tokens'      => [ '--apui-type-heading-xl-font-family', '--apui-type-heading-xl-font-size', '--apui-type-heading-xl-line-height', '--apui-type-heading-xl-font-weight', '--apui-type-heading-xl-letter-spacing', '--apui-type-body-md-font-size', '--apui-type-body-md-line-height', '--apui-text-default', '--apui-text-muted', '--apui-measure', '--apui-space-2', '--apui-space-4' ],
		'fixture'     => [
			'props' => [
				'title'       => 'Dashboard',
				'description' => 'Income, profit and transactions across all stores.',
				'meta'        => 'Edited 20 min ago',
				'actions'     => 'Share',
			],
			'parts' => [
				'breadcrumbs' => 'Apexify / Dashboard',
				'tabs'        => 'Overview',
			],
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
	'Popover'           => [
		'name'        => 'Popover',
		'description' => 'An anchored, non-modal panel with interactive content, for a short task tied to one control. A role=dialog panel: focus moves in when it opens and returns to the trigger when it closes; Escape and an outside click close it. The panel flips to the other side when there\'s no room, and start and end follow the reading direction.',
		'status'      => 'draft',
		'issue'       => 58,
		'rootClass'   => 'apui-popover',
		'stacks'      => [
			'livewire' => [
				'name'         => 'popover',
				'capabilities' => [ 'wire:model binds open both ways through $wire.entangle()' ],
			],
			'react'    => [
				'name' => 'Popover',
			],
			'vue'      => [
				'name' => 'Popover',
			],
		],
		'props'       => [
			[
				'name'        => 'open',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Whether it\'s open. Livewire binds it with wire:model, Vue with v-model:open. Emitted as data-state on the trigger and the panel.',
			],
			[
				'name'        => 'defaultOpen',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'The initial state of an uncontrolled popover.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'placement',
				'type'        => 'enum',
				'values'      => [ 'top', 'bottom', 'start', 'end' ],
				'default'     => 'bottom',
				'description' => 'The trigger\'s side the panel sits on, lined up with the trigger\'s start edge. start and end follow the reading direction. Emitted as data-placement; the side the machine settled on, after flipping, is data-side.',
			],
			[
				'name'        => 'arrow',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Draws the arrow that points at the trigger.',
			],
			[
				'name'        => 'title',
				'type'        => 'node',
				'description' => 'The heading, linked to the panel with aria-labelledby.',
				'a11y'        => 'The panel\'s accessible name. Without a title, give the popover an aria-label.',
			],
			[
				'name'        => 'actions',
				'type'        => 'node',
				'description' => 'A row of actions at the end of the panel.',
			],
			[
				'name'        => 'trigger',
				'type'        => 'node',
				'description' => 'The control that opens it. Text renders an outline Button; an element (a Button, an icon button) becomes the trigger itself.',
			],
			[
				'name'        => 'portal',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Renders the panel at the end of the body, above everything (x-teleport, a React portal, Vue Teleport). Off renders it in place. Tab past the last control returns after the trigger either way.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { title: \'…\', body: \'…\' }.',
			],
		],
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
				'description' => 'The control that opens the panel.',
			],
			[
				'name'        => 'positioner',
				'element'     => 'div',
				'description' => 'Places the panel against the trigger.',
			],
			[
				'name'        => 'arrow',
				'element'     => 'span',
				'description' => 'Points at the trigger. Decorative.',
			],
			[
				'name'        => 'title',
				'element'     => 'h3',
				'description' => 'The heading.',
			],
			[
				'name'        => 'body',
				'element'     => 'div',
				'description' => 'The default slot.',
			],
			[
				'name'        => 'actions',
				'element'     => 'div',
				'description' => 'The actions row.',
			],
		],
		'slots'       => [
			[
				'name'        => 'trigger',
				'description' => 'The trigger: text for a Button, or the element to use as the trigger.',
			],
			[
				'name'        => 'title',
				'description' => 'Rich title content, rendered inside the heading.',
			],
			[
				'name'        => 'actions',
				'description' => 'The actions row.',
			],
		],
		'events'      => [
			[
				'name'        => 'open-change',
				'description' => 'The popover opened or closed itself: the trigger, Escape or an outside click. Setting open doesn\'t fire it.',
				'payload'     => 'boolean',
			],
		],
		'a11y'        => [
			'role'         => 'dialog',
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Enter, Space',
					'action' => 'On the trigger, opens or closes the popover; focus moves to its first control.',
				],
				[
					'keys'   => 'Tab, Shift+Tab',
					'action' => 'Move between the controls inside; past the last one, focus moves on after the trigger and the popover closes.',
				],
				[
					'keys'   => 'Escape',
					'action' => 'Closes the popover and returns focus to the trigger.',
				],
			],
			'requirements' => [ 'The panel is role=dialog, labelled by its title (or an aria-label), and isn\'t modal: the page stays usable.', 'The trigger has aria-haspopup=dialog, aria-expanded and aria-controls.', 'Focus moves into the panel when it opens and returns to the trigger on Escape.', 'start and end follow the reading direction, and the panel flips to stay in the viewport.', 'Text keeps 4.5:1 and the panel\'s edge 3:1 on the overlay surface in every theme.', 'Every part keeps a stable, server-rendered id in Livewire, so morphs never replace the panel (D-015).', 'Keep it to a short task: don\'t put a long form in a popover.' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.11', '1.4.13', '2.1.1', '2.4.3', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-popover-radius', '--apui-surface-overlay', '--apui-elevation-overlay', '--apui-z-overlay', '--apui-border-muted', '--apui-text-default' ],
		'fixture'     => [
			'content' => 'Anyone on the marketing team can view it.',
			'props'   => [
				'open'    => true,
				'portal'  => false,
				'trigger' => 'Share',
				'title'   => 'Share report',
			],
			'parts'   => [
				'actions' => 'Copy link',
			],
			'states'  => [],
		],
	],
	'Progress'          => [
		'name'        => 'Progress',
		'description' => 'Linear progress: determinate, indeterminate or segmented into steps, with an optional label and value above the track.',
		'status'      => 'draft',
		'issue'       => 60,
		'rootClass'   => 'apui-progress',
		'stacks'      => [
			'livewire' => [
				'name' => 'progress',
			],
			'react'    => [
				'name' => 'Progress',
			],
			'vue'      => [
				'name' => 'Progress',
			],
		],
		'props'       => [
			[
				'name'        => 'value',
				'type'        => 'number',
				'default'     => 0,
				'description' => 'The progress, from 0 to max. Clamped. Ignored while indeterminate.',
			],
			[
				'name'        => 'max',
				'type'        => 'number',
				'default'     => 100,
				'description' => 'The value at completion. With segmented, the number of segments.',
			],
			[
				'name'        => 'indeterminate',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Progress is happening but its amount isn\'t known: a short bar slides along the track. Emitted as data-indeterminate; aria-valuenow is left out.',
				'a11y'        => 'No aria-valuenow, so assistive technology reports it as indeterminate.',
			],
			[
				'name'        => 'segmented',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Splits the track into max segments, value of them done (data-done), for a few discrete steps. Emitted as data-segmented.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md', 'lg' ],
				'default'     => 'md',
				'description' => 'The track\'s height: 4, 6 or 10px. Emitted as data-size.',
			],
			[
				'name'        => 'color',
				'type'        => 'enum',
				'values'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
				'default'     => 'primary',
				'description' => 'The bar\'s color. Emitted as data-color. Use error only when something is wrong.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'description' => 'What\'s progressing, shown above the track and naming the progressbar (aria-labelledby). Without it, name the progressbar with aria-label.',
			],
			[
				'name'        => 'valueText',
				'type'        => 'string',
				'description' => 'The value in words, such as 8 of 12: shown at the end of the head and read as aria-valuetext. Without it, a labelled bar shows the percentage.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { label: \'…\', bar: \'…\' }.',
			],
		],
		'sizes'       => [ 'sm', 'md', 'lg' ],
		'colors'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The progressbar (role=progressbar) with aria-valuemin, aria-valuemax and aria-valuenow.',
			],
			[
				'name'        => 'head',
				'element'     => 'div',
				'description' => 'The label and the value, above the track.',
			],
			[
				'name'        => 'label',
				'element'     => 'span',
				'description' => 'What\'s progressing.',
			],
			[
				'name'        => 'value',
				'element'     => 'span',
				'description' => 'The value: valueText, or the percentage.',
			],
			[
				'name'        => 'track',
				'element'     => 'div',
				'description' => 'The track, with a 1px edge so it shows at 3:1. Segmented, it lays out the segments.',
			],
			[
				'name'        => 'bar',
				'element'     => 'div',
				'description' => 'The filled part, its width written inline as --apui-_v. Segmented, one bar per segment, the done ones marked data-done.',
			],
		],
		'slots'       => [],
		'events'      => [],
		'a11y'        => [
			'role'         => 'progressbar',
			'element'      => 'div',
			'requirements' => [ 'role=progressbar with aria-valuemin=0, aria-valuemax and aria-valuenow; aria-valuenow is left out while indeterminate.', 'Named by its label (aria-labelledby) or by aria-label; valueText is read as aria-valuetext.', 'The track has an edge so it\'s visible at 3:1 on every surface.', 'The bar fills, and the indeterminate bar slides, in the reading direction; the animation stops under reduced motion.' ],
			'wcag'         => [ '1.1.1', '1.3.1', '1.4.11', '2.2.2', '4.1.2' ],
		],
		'tokens'      => [ '--apui-progress-height', '--apui-color-primary', '--apui-surface-sunken', '--apui-border-muted', '--apui-text-default', '--apui-text-muted' ],
		'fixture'     => [
			'props' => [
				'value'     => 64,
				'label'     => 'Uploading 12 photos',
				'valueText' => '8 of 12',
			],
		],
	],
	'ProgressRadial'    => [
		'name'        => 'ProgressRadial',
		'description' => 'Circular progress with the value in the center, built from Progress: for a single headline percentage.',
		'status'      => 'draft',
		'issue'       => 60,
		'rootClass'   => 'apui-progress-radial',
		'stacks'      => [
			'livewire' => [
				'name' => 'progress-radial',
			],
			'react'    => [
				'name' => 'ProgressRadial',
			],
			'vue'      => [
				'name' => 'ProgressRadial',
			],
		],
		'props'       => [
			[
				'name'        => 'value',
				'type'        => 'number',
				'default'     => 0,
				'description' => 'The progress, from 0 to max. Clamped. Ignored while indeterminate.',
			],
			[
				'name'        => 'max',
				'type'        => 'number',
				'default'     => 100,
				'description' => 'The value at completion.',
			],
			[
				'name'        => 'indeterminate',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Progress is happening but its amount isn\'t known: a quarter arc spins. Emitted as data-indeterminate; aria-valuenow is left out.',
				'a11y'        => 'No aria-valuenow, so assistive technology reports it as indeterminate.',
			],
			[
				'name'        => 'size',
				'type'        => 'number',
				'default'     => 64,
				'description' => 'The ring\'s diameter in px, written inline as --apui-_s. The value text scales with it.',
			],
			[
				'name'        => 'thickness',
				'type'        => 'number',
				'default'     => 6,
				'description' => 'The ring\'s stroke width in px.',
			],
			[
				'name'        => 'color',
				'type'        => 'enum',
				'values'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
				'default'     => 'primary',
				'description' => 'The bar\'s color. Emitted as data-color.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'description' => 'A caption under the value, such as complete, which also names the progressbar (aria-labelledby). Without it, name the progressbar with aria-label.',
			],
			[
				'name'        => 'valueText',
				'type'        => 'string',
				'description' => 'The value in words, shown in the center and read as aria-valuetext. Without it, the center shows the percentage.',
			],
			[
				'name'        => 'hideValue',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Leaves the center empty, for small rings; the label still names the progressbar (aria-label).',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { value: \'…\', bar: \'…\' }.',
			],
		],
		'colors'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'span',
				'description' => 'The progressbar (role=progressbar) with aria-valuemin, aria-valuemax and aria-valuenow.',
			],
			[
				'name'        => 'svg',
				'element'     => 'svg',
				'description' => 'The ring, rotated to start at the top and mirrored in RTL.',
			],
			[
				'name'        => 'track',
				'element'     => 'circle',
				'description' => 'The unfilled ring.',
			],
			[
				'name'        => 'bar',
				'element'     => 'circle',
				'description' => 'The filled arc: its stroke-dashoffset is the value.',
			],
			[
				'name'        => 'value',
				'element'     => 'span',
				'description' => 'The value in the center: valueText, or the percentage.',
			],
			[
				'name'        => 'label',
				'element'     => 'span',
				'description' => 'The caption under the value.',
			],
		],
		'slots'       => [],
		'events'      => [],
		'a11y'        => [
			'role'         => 'progressbar',
			'element'      => 'span',
			'requirements' => [ 'Same semantics as Progress: role=progressbar with aria-valuemin=0, aria-valuemax and aria-valuenow (left out while indeterminate), named by its label or aria-label.', 'The ring fills in the reading direction: clockwise in LTR, counterclockwise in RTL.', 'The spin slows under reduced motion.' ],
			'wcag'         => [ '1.1.1', '1.3.1', '1.4.11', '2.2.2', '4.1.2' ],
		],
		'tokens'      => [ '--apui-color-primary', '--apui-surface-sunken', '--apui-text-default', '--apui-text-muted' ],
		'fixture'     => [
			'props' => [
				'value'     => 68,
				'size'      => 80,
				'thickness' => 7,
				'label'     => 'complete',
			],
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
	'Skeleton'          => [
		'name'        => 'Skeleton',
		'description' => 'A placeholder shape that matches the layout while content loads: a block, a line of text or a circle. Skeletons are hidden from assistive technology; the container that is loading sets aria-busy.',
		'status'      => 'draft',
		'issue'       => 60,
		'rootClass'   => 'apui-skeleton',
		'stacks'      => [
			'livewire' => [
				'name' => 'skeleton',
			],
			'react'    => [
				'name' => 'Skeleton',
			],
			'vue'      => [
				'name' => 'Skeleton',
			],
		],
		'props'       => [
			[
				'name'        => 'shape',
				'type'        => 'enum',
				'values'      => [ 'block', 'text', 'circle' ],
				'default'     => 'block',
				'description' => 'block (a rounded rectangle), text (a 10px line with line spacing) or circle. Emitted as data-shape.',
			],
			[
				'name'        => 'width',
				'type'        => 'string',
				'description' => 'A CSS length, such as 60% or 40px, written inline. React and Vue also take a number of px.',
			],
			[
				'name'        => 'height',
				'type'        => 'string',
				'description' => 'A CSS length, written inline. A text line keeps its own height unless this is set.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'span',
				'description' => 'The shape (aria-hidden=true), with a shimmer that stops under reduced motion.',
			],
		],
		'slots'       => [],
		'events'      => [],
		'a11y'        => [
			'element'      => 'span',
			'requirements' => [ 'Skeletons are aria-hidden; the container that is loading sets aria-busy=true and drops it when the content arrives.', 'The shimmer moves in the reading direction and stops under reduced motion.', 'Don\'t show skeletons for more than a few seconds; switch to a status.' ],
			'wcag'         => [ '1.3.1', '2.2.2', '4.1.2' ],
		],
		'tokens'      => [ '--apui-surface-sunken', '--apui-state-hover', '--apui-radius-sm' ],
		'fixture'     => [
			'props' => [
				'width'  => '240px',
				'height' => '24px',
			],
		],
	],
	'Sparkline'         => [
		'name'        => 'Sparkline',
		'description' => 'A word-sized trend with no axes: a line, an area or bars, drawn as inline SVG. Every stack computes the same coordinates, so there is no chart library and no script. It\'s an image with a label stating the first and latest values; put the values themselves in a table or tooltip nearby.',
		'status'      => 'draft',
		'issue'       => 61,
		'rootClass'   => 'apui-sparkline',
		'stacks'      => [
			'livewire' => [
				'name'         => 'sparkline',
				'capabilities' => [ 'Rendered on the server: wire:poll and Livewire updates redraw it with no script', '2.x type still works, as variant' ],
			],
			'react'    => [
				'name' => 'Sparkline',
			],
			'vue'      => [
				'name' => 'Sparkline',
			],
		],
		'props'       => [
			[
				'name'        => 'data',
				'type'        => 'array',
				'required'    => true,
				'description' => 'The values, oldest first. Anything that isn\'t a finite number is skipped. Values that cross zero draw a dashed baseline at zero.',
			],
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'line', 'area', 'bar' ],
				'default'     => 'line',
				'description' => 'A line with a dot on the latest value, the same with a soft fill below, or one bar per value (rect parts with data-part="bar"). The spec calls it kind. Emitted as data-variant.',
			],
			[
				'name'        => 'width',
				'type'        => 'number',
				'default'     => 96,
				'description' => 'The width in px. Give sparklines in one column the same size and scale.',
			],
			[
				'name'        => 'height',
				'type'        => 'number',
				'default'     => 28,
				'description' => 'The height in px.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'default'     => 'Trend from {first} to {latest}',
				'description' => 'The accessible label; {first}, {latest}, {min}, {max} and {count} are filled in from data. Translate it: Livewire defaults it through __( \'Trend from {first} to {latest}\' ).',
				'a11y'        => 'Names the image, so the trend reads as its first and latest values.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { line: \'…\', dot: \'…\' }.',
			],
		],
		'variants'    => [ 'line', 'area', 'bar' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'svg',
				'description' => 'The image: role=img, the label, and a viewBox of width × height. Its plot stays LTR in every direction (D-004).',
			],
			[
				'name'        => 'area',
				'element'     => 'path',
				'description' => 'The fill below the line, for the area variant.',
			],
			[
				'name'        => 'line',
				'element'     => 'path',
				'description' => 'The trend line, for the line and area variants.',
			],
			[
				'name'        => 'dot',
				'element'     => 'circle',
				'description' => 'The latest value, for the line and area variants.',
			],
			[
				'name'        => 'baseline',
				'element'     => 'line',
				'description' => 'A dashed line at zero, when the values cross it.',
			],
		],
		'events'      => [],
		'a11y'        => [
			'role'         => 'img',
			'element'      => 'svg',
			'requirements' => [ 'role=img with a label that states the first and latest values, so the trend isn\'t only visual.', 'The values themselves are available nearby, in a table or tooltip.', 'One color for the whole trend, never up or down: the number beside it says that.', 'The line, dot and bars keep 3:1 against the surface (--apui-chart-1).' ],
			'wcag'         => [ '1.1.1', '1.4.1', '1.4.11' ],
		],
		'tokens'      => [ '--apui-chart-1', '--apui-chart-grid', '--apui-focus-ring-offset-color' ],
		'fixture'     => [
			'props' => [
				'data' => [ 2, 4, 3, 7, 6, 9, 12, 11, 14 ],
			],
			'parts' => [
				'variant' => 'area',
				'data'    => [ -2, 4, 3, -1, 6, 9, 12, 11, 14 ],
			],
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
	'Stack'             => [
		'name'        => 'Stack',
		'description' => 'A layout primitive: its children in a column or a row, with the gap from the space scale, alignment and optional wrapping. No Tailwind needed.',
		'status'      => 'draft',
		'issue'       => 58,
		'rootClass'   => 'apui-stack',
		'stacks'      => [
			'livewire' => [
				'name' => 'stack',
			],
			'react'    => [
				'name' => 'Stack',
			],
			'vue'      => [
				'name' => 'Stack',
			],
		],
		'props'       => [
			[
				'name'        => 'orientation',
				'type'        => 'enum',
				'values'      => [ 'vertical', 'horizontal' ],
				'default'     => 'vertical',
				'description' => 'A column, or a row that runs in the text direction. Replaces the React and Vue direction prop (vocabulary: one prop for orientation). Emitted as data-orientation.',
			],
			[
				'name'        => 'gap',
				'type'        => 'enum',
				'values'      => [ '0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16' ],
				'default'     => '2',
				'description' => 'The space between items, a step of the space scale (2 is --apui-space-2, 8px). Emitted as data-gap.',
			],
			[
				'name'        => 'align',
				'type'        => 'enum',
				'values'      => [ 'start', 'center', 'end', 'stretch', 'baseline' ],
				'default'     => 'stretch',
				'description' => 'How items sit across the stack\'s axis (align-items). Emitted as data-align.',
			],
			[
				'name'        => 'justify',
				'type'        => 'enum',
				'values'      => [ 'start', 'center', 'end', 'between', 'around', 'evenly' ],
				'default'     => 'start',
				'description' => 'How items and the free space share the stack\'s axis (justify-content); start and end follow the text direction. Emitted as data-justify.',
			],
			[
				'name'        => 'wrap',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Lets a row wrap onto more lines instead of overflowing. Emitted as data-wrap.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The stack; every child is an item.',
			],
		],
		'a11y'        => [
			'element'      => 'div',
			'requirements' => [ 'Layout only: no role, and the reading order is the source order.', 'A row runs in the text direction, so it starts at the inline end in RTL.', 'A row that may not fit at 320px sets wrap (1.4.10).' ],
			'wcag'         => [ '1.3.2', '1.4.10' ],
		],
		'tokens'      => [ '--apui-space-0', '--apui-space-1', '--apui-space-2', '--apui-space-3', '--apui-space-4', '--apui-space-5', '--apui-space-6', '--apui-space-8', '--apui-space-10', '--apui-space-12', '--apui-space-16' ],
		'fixture'     => [
			'content' => 'Stack item',
			'states'  => [],
		],
	],
	'Stat'              => [
		'name'        => 'Stat',
		'description' => 'A single headline number with its label, its change and the context for it. The change is an arrow and text, never color alone. Put stats side by side with a layout component such as Grid, and emphasize at most one in a row.',
		'status'      => 'draft',
		'issue'       => 61,
		'rootClass'   => 'apui-stat',
		'stacks'      => [
			'livewire' => [
				'name'         => 'stat',
				'capabilities' => [ 'The default slot replaces value', 'The icon slot replaces the named icon', '2.x title, changeLabel and the trailing description still work, as label and description' ],
			],
			'react'    => [
				'name'         => 'Stat',
				'capabilities' => [ 'children replace value; icon takes a name or a node' ],
			],
			'vue'      => [
				'name'         => 'Stat',
				'capabilities' => [ 'The default slot replaces value; the icon slot replaces the named icon' ],
			],
		],
		'props'       => [
			[
				'name'        => 'label',
				'type'        => 'string',
				'description' => 'What the number measures, above it.',
			],
			[
				'name'        => 'value',
				'type'        => 'string',
				'description' => 'The number, already formatted ("$348,261", "10.87%"). Rendered with tabular figures.',
			],
			[
				'name'        => 'unit',
				'type'        => 'string',
				'description' => 'A unit after the value, smaller and muted ("ms", "kg").',
			],
			[
				'name'        => 'icon',
				'type'        => 'string',
				'description' => 'A registry icon name for the tile at the end of the label row, tinted by color. Decorative.',
			],
			[
				'name'        => 'delta',
				'type'        => 'string',
				'description' => 'The change as text ("10.9%", "6.2 hrs"), shown with an arrow for trend. Takes precedence over change.',
			],
			[
				'name'        => 'change',
				'type'        => 'number',
				'description' => 'The change as a percentage. Shown as delta with one decimal and no sign ("5.4%"), and sets trend from its sign when trend isn\'t set.',
			],
			[
				'name'        => 'trend',
				'type'        => 'enum',
				'values'      => [ 'up', 'down', 'flat' ],
				'description' => 'The change\'s direction: an up or down arrow in success or error text, or a dash. Emitted as data-trend on delta.',
				'a11y'        => 'The arrow is decorative; upLabel, downLabel or flatLabel is read before the delta, so the direction isn\'t only color or shape.',
			],
			[
				'name'        => 'description',
				'type'        => 'string',
				'description' => 'Context after the delta ("vs last month").',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md', 'lg' ],
				'default'     => 'md',
				'description' => 'The value\'s type style: stat-sm, stat-md or stat-lg. Size carries the hierarchy, never bold.',
			],
			[
				'name'        => 'color',
				'type'        => 'enum',
				'values'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
				'default'     => 'neutral',
				'description' => 'Tints the icon tile and the emphasis fill. It doesn\'t color the value.',
			],
			[
				'name'        => 'emphasis',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'A soft fill in color for the one stat that matters in a row. Emitted as data-emphasis.',
			],
			[
				'name'        => 'bare',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'No container: no padding, border or fill, for a stat inside a Card. Emitted as data-bare.',
			],
			[
				'name'        => 'upLabel',
				'type'        => 'string',
				'default'     => 'Increase',
				'description' => 'Hidden text before an up delta. Translate it: Livewire defaults it through __( \'Increase\' ).',
			],
			[
				'name'        => 'downLabel',
				'type'        => 'string',
				'default'     => 'Decrease',
				'description' => 'Hidden text before a down delta. Translate it: Livewire defaults it through __( \'Decrease\' ).',
			],
			[
				'name'        => 'flatLabel',
				'type'        => 'string',
				'default'     => 'No change',
				'description' => 'Hidden text before a flat delta. Translate it: Livewire defaults it through __( \'No change\' ).',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { value: \'…\', delta: \'…\' }.',
			],
		],
		'sizes'       => [ 'sm', 'md', 'lg' ],
		'colors'      => [ 'primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The container, with data-size, data-color, data-emphasis and data-bare.',
			],
			[
				'name'        => 'top',
				'element'     => 'div',
				'description' => 'The label row: label at the start, icon at the end.',
			],
			[
				'name'        => 'label',
				'element'     => 'span',
				'description' => 'What the number measures.',
			],
			[
				'name'        => 'icon',
				'element'     => 'span',
				'description' => 'The tinted icon tile. Hidden from assistive technology.',
			],
			[
				'name'        => 'value',
				'element'     => 'span',
				'description' => 'The number, in tabular figures.',
			],
			[
				'name'        => 'unit',
				'element'     => 'span',
				'description' => 'The unit inside the value, smaller and muted.',
			],
			[
				'name'        => 'foot',
				'element'     => 'span',
				'description' => 'The delta and description row.',
			],
			[
				'name'        => 'delta',
				'element'     => 'span',
				'description' => 'The change: hidden direction text, an arrow and the change, with data-trend.',
			],
			[
				'name'        => 'description',
				'element'     => 'span',
				'description' => 'The context after the delta.',
			],
		],
		'slots'       => [
			[
				'name'        => 'icon',
				'description' => 'Replaces the named icon in the tile.',
			],
		],
		'events'      => [],
		'a11y'        => [
			'element'      => 'div',
			'requirements' => [ 'The change is visible text with an arrow, and a hidden direction label (upLabel, downLabel, flatLabel): color is never the only signal.', 'The value uses tabular figures; the label and description keep 4.5:1 (--apui-text-muted) on the default and emphasis fills.', 'Up and down deltas keep 4.5:1 in success and error text.', 'The icon tile is decorative and hidden from assistive technology.' ],
			'wcag'         => [ '1.3.1', '1.4.1', '1.4.3', '1.4.11' ],
		],
		'tokens'      => [ '--apui-card-padding', '--apui-card-radius', '--apui-surface-default', '--apui-border-muted', '--apui-border-width', '--apui-text-default', '--apui-text-muted', '--apui-color-neutral-soft', '--apui-color-neutral-soft-foreground', '--apui-color-success-text', '--apui-color-error-text', '--apui-type-stat-sm-font-size', '--apui-type-stat-md-font-size', '--apui-type-stat-lg-font-size', '--apui-type-body-sm-font-size', '--apui-type-caption-font-size', '--apui-radius-md', '--apui-icon-size-sm', '--apui-icon-size-md' ],
		'fixture'     => [
			'props' => [
				'label'       => 'Total revenue',
				'value'       => '7,415,644',
				'icon'        => 'wallet',
				'change'      => -5.4,
				'description' => 'vs last month',
			],
			'parts' => [
				'unit' => 'USD',
			],
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
	'StreamableContent' => [
		'name'        => 'StreamableContent',
		'description' => 'Content that arrives over time, such as a generated summary, with waiting, streaming, done, error and stopped states. Livewire streams into it with wire:stream; Stop is always available while streaming, and partial content stays when a stream fails.',
		'status'      => 'draft',
		'issue'       => 60,
		'rootClass'   => 'apui-streamable-content',
		'stacks'      => [
			'livewire' => [
				'name'         => 'streamable-content',
				'capabilities' => [ 'wire:stream (Livewire 4; Livewire 3 renders the content statically)' ],
				'differences'  => [ 'Livewire only (D-003): built on wire:stream. React and Vue would need a different transport, and nothing downstream asks for one.', 'The 2.x props tag, prose, placeholder and showCursor are gone: the state draws the status, the caret and the waiting skeleton.' ],
			],
			'react'    => false,
			'vue'      => false,
		],
		'props'       => [
			[
				'name'        => 'target',
				'type'        => 'string',
				'required'    => true,
				'description' => 'The wire:stream target the component streams to with $this->stream( to: … ).',
			],
			[
				'name'        => 'state',
				'type'        => 'enum',
				'values'      => [ 'waiting', 'streaming', 'done', 'error', 'stopped' ],
				'default'     => 'streaming',
				'description' => 'Where the stream is. Emitted as data-state. Waiting shows skeleton lines until the first words; streaming shows the caret and Stop; error and stopped keep the partial content.',
			],
			[
				'name'        => 'status',
				'type'        => 'string',
				'description' => 'The status line\'s text. Defaults to the state\'s, translated: Waiting for a response…, Writing…, Done, The response was interrupted. or Stopped.',
			],
			[
				'name'        => 'stopLabel',
				'type'        => 'string',
				'default'     => 'Stop',
				'description' => 'The Stop button\'s text. Translate it: defaults through __( \'Stop\' ).',
			],
			[
				'name'        => 'actions',
				'type'        => 'node',
				'description' => 'Buttons under the content, such as Copy and Regenerate when done, or Continue after an error.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { status: \'…\', content: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The streamed block.',
			],
			[
				'name'        => 'status',
				'element'     => 'div',
				'description' => 'A line saying what\'s happening (role=status), with the state\'s icon or indicator.',
			],
			[
				'name'        => 'stopTrigger',
				'element'     => 'button',
				'description' => 'The Stop button at the end of the status line, while streaming. Dispatches stop.',
			],
			[
				'name'        => 'content',
				'element'     => 'div',
				'description' => 'The live region (aria-live=polite, aria-busy while waiting or streaming) that wire:stream writes to.',
			],
			[
				'name'        => 'caret',
				'element'     => 'span',
				'description' => 'The blinking caret after the text while streaming, hidden from assistive technology.',
			],
			[
				'name'        => 'actions',
				'element'     => 'div',
				'description' => 'The action buttons.',
			],
		],
		'slots'       => [
			[
				'name'        => 'status',
				'description' => 'Rich status text.',
			],
			[
				'name'        => 'actions',
				'description' => 'The action buttons.',
			],
		],
		'events'      => [
			[
				'name'        => 'stop',
				'description' => 'The Stop button was pressed: wire:stop="cancel" or x-on:stop.',
			],
		],
		'a11y'        => [
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Reaches Stop while streaming, then the actions.',
				],
			],
			'requirements' => [ 'The content is aria-live=polite and aria-busy while waiting or streaming, so it isn\'t re-announced token by token; the status line is role=status.', 'Stop is always available while streaming.', 'Partial content stays when a stream fails, with an action to continue.', 'The caret is aria-hidden and stops blinking under reduced motion; no sparkle icons or gradients.' ],
			'wcag'         => [ '1.3.1', '2.1.1', '2.2.2', '4.1.3' ],
		],
		'tokens'      => [ '--apui-text-default', '--apui-text-muted', '--apui-color-error-text', '--apui-color-success-text' ],
		'fixture'     => [
			'content' => 'Revenue grew 10.9% month over month, led by Lakeview Lofts and Golden Hour Apartments.',
			'props'   => [
				'target' => 'summary',
				'status' => 'Writing summary…',
			],
			'parts'   => [
				'actions' => 'Copy',
			],
			'states'  => [],
		],
	],
	'Swap'              => [
		'name'        => 'Swap',
		'description' => 'A two-state toggle that swaps its on and off content, such as a sun and a moon: a native checkbox with an accessible name over the content, with an optional fade or rotate. No Claude Design spec; token-driven like Grid and Stack.',
		'status'      => 'draft',
		'issue'       => 65,
		'rootClass'   => 'apui-swap',
		'stacks'      => [
			'livewire' => [
				'name'         => 'swap',
				'capabilities' => [ 'wire:model binds checked on the native checkbox (D-018)', 'The 2.x true and false slots and true-icon and false-icon props still work as on, off, on-icon and off-icon' ],
			],
			'react'    => [
				'name' => 'Swap',
			],
			'vue'      => [
				'name' => 'Swap',
			],
		],
		'sizes'       => [ 'sm', 'md', 'lg' ],
		'props'       => [
			[
				'name'        => 'checked',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Whether it is on: the on content shows. Livewire binds it with wire:model, Vue with v-model:checked; React pairs it with onCheckedChange.',
			],
			[
				'name'        => 'defaultChecked',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'The initial state of an uncontrolled swap.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'required'    => true,
				'description' => 'The accessible name of the checkbox, such as "Dark mode". It is not shown.',
				'a11y'        => 'Name the setting, not the icon: "Dark mode", checked or not, rather than "Moon".',
			],
			[
				'name'        => 'onIcon',
				'type'        => 'string',
				'default'     => 'sun',
				'description' => 'The icon shown when on. The on slot overrides it. Livewire\'s 2.x true-icon still works.',
			],
			[
				'name'        => 'offIcon',
				'type'        => 'string',
				'default'     => 'moon',
				'description' => 'The icon shown when off. The off slot overrides it. Livewire\'s 2.x false-icon still works.',
			],
			[
				'name'        => 'transition',
				'type'        => 'enum',
				'values'      => [ 'fade', 'rotate', 'none' ],
				'default'     => 'fade',
				'description' => 'How the content swaps: a cross-fade, a fade with a quarter turn, or at once. Reduced motion always swaps at once. Emitted as data-transition.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md', 'lg' ],
				'default'     => 'md',
				'description' => 'The square target (control heights sm, md, lg) and its icon (16, 16, 20px). Emitted as data-size.',
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Disables the checkbox.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part: { root, control, on, off }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'label',
				'description' => 'The square target. It holds the checkbox and both contents in one grid cell; data-state is checked or unchecked.',
			],
			[
				'name'        => 'control',
				'element'     => 'input',
				'description' => 'The native checkbox, transparent over the target, named by label. Attributes other than class land here.',
			],
			[
				'name'        => 'on',
				'element'     => 'span',
				'description' => 'Shown when checked. aria-hidden: the checkbox carries the state.',
			],
			[
				'name'        => 'off',
				'element'     => 'span',
				'description' => 'Shown when not checked. aria-hidden.',
			],
		],
		'slots'       => [
			[
				'name'        => 'on',
				'description' => 'Content shown when on, in place of onIcon. Livewire\'s 2.x true slot still works.',
			],
			[
				'name'        => 'off',
				'description' => 'Content shown when off, in place of offIcon. Livewire\'s 2.x false slot still works.',
			],
		],
		'events'      => [
			[
				'name'        => 'checked-change',
				'description' => 'The swap turned on or off.',
				'payload'     => 'boolean',
			],
		],
		'a11y'        => [
			'element'      => 'label',
			'keyboard'     => [
				[
					'keys'   => 'Space',
					'action' => 'Turns it on or off.',
				],
				[
					'keys'   => 'Tab',
					'action' => 'Moves focus to and from it.',
				],
			],
			'requirements' => [ 'A native input type=checkbox stays in the DOM over the target, so the platform handles keyboard and screen readers and the state is announced as checked or not checked.', 'The checkbox has an accessible name (label) that names the setting; the swapping content is aria-hidden.', 'The target is at least 24×24px (2.5.8) and shows a focus ring while the checkbox has :focus-visible.', 'The fade and rotate are removed under prefers-reduced-motion.', 'Disabled uses --apui-text-disabled, never opacity alone.' ],
			'wcag'         => [ '1.3.1', '1.4.11', '2.1.1', '2.4.7', '2.5.8', '4.1.2' ],
		],
		'tokens'      => [ '--apui-control-height-sm', '--apui-control-height-md', '--apui-control-height-lg', '--apui-icon-size-md', '--apui-icon-size-lg', '--apui-radius-md', '--apui-text-default', '--apui-text-disabled', '--apui-state-hover', '--apui-state-pressed', '--apui-focus-ring-color', '--apui-focus-ring-width', '--apui-focus-ring-offset', '--apui-motion-duration-moderate', '--apui-motion-ease-standard' ],
		'fixture'     => [
			'props'  => [
				'label' => 'Dark mode',
			],
			'states' => [ 'hover', 'focus-visible', 'checked', 'disabled' ],
		],
	],
	'Table'             => [
		'name'        => 'Table',
		'description' => 'Rows of structured data in real table markup: a toolbar with a title, sortable headers, row selection with a select-all box, expandable rows, loading and empty states, and a footer with Pagination.',
		'status'      => 'draft',
		'issue'       => 62,
		'rootClass'   => 'apui-table',
		'stacks'      => [
			'livewire' => [
				'name'         => 'table',
				'capabilities' => [ 'wire:model binds the selected keys (value) through $wire.entangle()', 'rows takes an array, a Collection or a Laravel paginator; paginated (2.x with-pagination) renders Pagination from the paginator, and per-page names the Livewire property a "Rows per page" Select binds', 'Clicking a sortable header sets the component\'s sortBy property ({ column, direction }) when sort-by is given, as 2.x did, and dispatches sort-change', 'Cell content through @scope(\'cell_<key>\', $row), header content through @scope(\'header_<key>\', $header), row actions through @scope(\'actions\', $row) and expanded content through @scope(\'expansion\', $row); a dotted key such as user.name becomes cell_user___name', '2.x attributes keep working: compact (density), no-headers (hideHeaders), selectable-key, expandable-key, expandable-condition, link (row links with {key} tokens), row-decoration and cell-decoration (classes from closures), the drag-and-drop sortable, sort-group and sort-handle, and infinite-scroll with has-more-pages (Livewire 4)' ],
				'differences'  => [ 'Expansion rows render for every expandable row and toggle with Alpine; React and Vue render only the expanded ones.', 'Without selectable, wire:model on an expandable table binds the expanded keys, as 2.x did.' ],
			],
			'react'    => [
				'name'         => 'Table',
				'capabilities' => [ 'Cell content through renderCell(row, column, index), or a column\'s render(value, row, index); header content through renderHeader(column); row actions through renderActions(row, index); expanded content through renderExpansion(row, index)' ],
			],
			'vue'      => [
				'name'         => 'Table',
				'capabilities' => [ 'v-model binds the selected keys, v-model:expanded the expanded keys and v-model:sort-by the sort', 'Cell content through #cell-<key>="{ row, value, column, index }" or #cell for every column; header content through #header-<key>="{ column }"; row actions through #actions="{ row, index }"; expanded content through #expansion="{ row, index }"' ],
			],
		],
		'props'       => [
			[
				'name'        => 'headers',
				'type'        => 'array',
				'required'    => true,
				'description' => 'The columns, in order: { key, label, sortable, numeric, hidden, secondary, class }. key is a dot path into each row. sortable makes the header a sort button (Livewire 2.x: every header sorts once sortBy is set, unless sortable is false). numeric end-aligns the column with tabular figures. secondary is a second dot path, shown muted under the value. Livewire also takes format (a closure or [\'currency\', \'2.,\', \'$\'] / [\'date\', \'M j, Y\']), sortBy (the column to sort by) and disableLink.',
			],
			[
				'name'        => 'rows',
				'type'        => 'array',
				'required'    => true,
				'description' => 'The rows: arrays or objects. Livewire also takes a Collection or a paginator.',
			],
			[
				'name'        => 'keyBy',
				'type'        => 'string',
				'default'     => 'id',
				'description' => 'The dot path to each row\'s unique key, used for selection, expansion and list keys.',
			],
			[
				'name'        => 'title',
				'type'        => 'node',
				'description' => 'The title at the start of the toolbar. It names the table unless label is set.',
				'a11y'        => 'The table\'s accessible name comes from title (aria-labelledby) or label (aria-label); give every table one.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'description' => 'The table\'s accessible name when it has no visible title, or a different one. Translate it.',
			],
			[
				'name'        => 'density',
				'type'        => 'enum',
				'values'      => [ 'compact', 'default', 'comfortable' ],
				'description' => 'Row height, cell padding and type size, as data-density on the root. Unset, the table follows the page\'s density. Use compact for operational screens and comfortable for browsing.',
			],
			[
				'name'        => 'surface',
				'type'        => 'enum',
				'values'      => [ 'default', 'glass' ],
				'default'     => 'default',
				'description' => 'glass puts the table on a translucent surface; the header row turns transparent.',
			],
			[
				'name'        => 'stickyHeader',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Keeps the header row in view while the rows scroll. The scroll part needs a height for it to matter: set --apui-table-max-block-size on the root.',
			],
			[
				'name'        => 'hideHeaders',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Hides the header row visually. Screen readers still announce the column names. Livewire 2.x\'s no-headers still works.',
			],
			[
				'name'        => 'selectable',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Adds a checkbox to every row and a select-all box to the header. The select-all box is mixed while some rows of the page are selected.',
				'a11y'        => 'Row boxes are named by selectRowLabel and selected rows carry aria-selected="true".',
			],
			[
				'name'        => 'value',
				'type'        => 'array',
				'description' => 'The selected rows\' keys. Select all adds or removes the keys of the rows on screen, keeping any others.',
			],
			[
				'name'        => 'expandable',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Adds a button to each row that shows the expansion content in a full-width row under it.',
			],
			[
				'name'        => 'expanded',
				'type'        => 'array',
				'description' => 'The expanded rows\' keys.',
			],
			[
				'name'        => 'sortBy',
				'type'        => 'object',
				'description' => 'The current sort: { column, direction }, direction "asc" or "desc". The sorted header carries aria-sort; the table never sorts rows itself, so sort them where they come from on sort-change.',
			],
			[
				'name'        => 'loading',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Shows skeleton rows in place of the rows and sets aria-busy on the root.',
				'a11y'        => 'The root carries aria-busy="true"; the skeleton rows are aria-hidden.',
			],
			[
				'name'        => 'emptyText',
				'type'        => 'string',
				'default'     => 'No records found.',
				'description' => 'The EmptyState title shown in a full-width row when there are no rows. Translate it: Livewire defaults it through __( \'No records found.\' ). The empty slot replaces the whole state.',
			],
			[
				'name'        => 'toolbar',
				'type'        => 'node',
				'description' => 'Content after the title in the toolbar, such as a search Input and Buttons.',
			],
			[
				'name'        => 'footer',
				'type'        => 'node',
				'description' => 'Content at the start of the footer, such as "1 selected · 4 of 128". Pagination sits at its end.',
			],
			[
				'name'        => 'pagination',
				'type'        => 'object',
				'description' => 'Pagination\'s props ({ page, total, perPage, pageCount, siblings, summary, labels }), rendered at the end of the footer. React and Vue take its page-change handler there too (onPageChange).',
			],
			[
				'name'        => 'paginated',
				'type'        => 'boolean',
				'default'     => false,
				'stacks'      => [ 'livewire' ],
				'description' => 'Renders Pagination from the paginator in rows (2.x: with-pagination). Inside a component using WithPagination, the pages call gotoPage() without a reload.',
			],
			[
				'name'        => 'perPage',
				'type'        => 'string',
				'stacks'      => [ 'livewire' ],
				'description' => 'With paginated, the Livewire property a "Rows per page" Select in the footer binds (wire:model.live).',
			],
			[
				'name'        => 'perPageValues',
				'type'        => 'array',
				'default'     => [ 10, 20, 50, 100 ],
				'stacks'      => [ 'livewire' ],
				'description' => 'The "Rows per page" options.',
			],
			[
				'name'        => 'selectAllLabel',
				'type'        => 'string',
				'default'     => 'Select all',
				'description' => 'The select-all box\'s accessible name. Translate it: Livewire defaults it through __( \'Select all\' ).',
			],
			[
				'name'        => 'selectRowLabel',
				'type'        => 'string',
				'default'     => 'Select {row}',
				'description' => 'Each row box\'s accessible name; {row} is the row\'s first column. Translate it: Livewire defaults it through __( \'Select {row}\' ).',
			],
			[
				'name'        => 'sortLabel',
				'type'        => 'string',
				'default'     => 'Sort by {column}',
				'description' => 'Each sort button\'s accessible name; {column} is the column\'s label. aria-sort on the header announces the current order. Translate it: Livewire defaults it through __( \'Sort by {column}\' ).',
			],
			[
				'name'        => 'expandLabel',
				'type'        => 'string',
				'default'     => 'Show details for {row}',
				'description' => 'Each expand button\'s accessible name; {row} is the row\'s first column. aria-expanded announces whether it is open. Translate it: Livewire defaults it through __( \'Show details for {row}\' ).',
			],
			[
				'name'        => 'actionsLabel',
				'type'        => 'string',
				'default'     => 'Actions',
				'description' => 'The row-actions column\'s header, for screen readers only. Translate it: Livewire defaults it through __( \'Actions\' ).',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { headCell: \'…\', cell: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The frame: surface, border and radius around the toolbar, the grid and the footer.',
			],
			[
				'name'        => 'toolbar',
				'element'     => 'div',
				'description' => 'The row above the grid holding the title and the toolbar content. Only renders with one of them.',
			],
			[
				'name'        => 'title',
				'element'     => 'h3',
				'description' => 'The table\'s title; it names the table.',
			],
			[
				'name'        => 'scroll',
				'element'     => 'div',
				'description' => 'Scrolls the grid sideways on narrow screens, and down past --apui-table-max-block-size.',
			],
			[
				'name'        => 'table',
				'element'     => 'table',
				'description' => 'The native table.',
			],
			[
				'name'        => 'headCell',
				'element'     => 'th',
				'description' => 'A column header (scope="col"). A sortable one carries aria-sort and holds the sort button.',
			],
			[
				'name'        => 'sort',
				'element'     => 'button',
				'description' => 'The sort button inside a sortable header: the label, then an icon for the current order.',
			],
			[
				'name'        => 'row',
				'element'     => 'tr',
				'description' => 'A body row. With selectable, it carries aria-selected.',
			],
			[
				'name'        => 'cell',
				'element'     => 'td',
				'description' => 'A body cell. Numeric columns carry data-numeric.',
			],
			[
				'name'        => 'select',
				'element'     => 'th | td',
				'description' => 'The checkbox column: the select-all box in the header, a row\'s box in each row. Holds a Checkbox.',
			],
			[
				'name'        => 'expandTrigger',
				'element'     => 'button',
				'description' => 'Shows or hides a row\'s expansion. Icon-only, named by expandLabel, with aria-expanded and aria-controls. Its chevron turns down when open and mirrors in RTL.',
			],
			[
				'name'        => 'expansion',
				'element'     => 'tr',
				'description' => 'The full-width row under an expanded row, holding the expansion content.',
			],
			[
				'name'        => 'primary',
				'element'     => 'span',
				'description' => 'A cell\'s main value when its column has secondary.',
			],
			[
				'name'        => 'secondary',
				'element'     => 'span',
				'description' => 'The muted second line under primary.',
			],
			[
				'name'        => 'footer',
				'element'     => 'div',
				'description' => 'The row under the grid: the footer content at the start, Pagination at the end.',
			],
		],
		'slots'       => [
			[
				'name'        => 'toolbar',
				'description' => 'Content after the title in the toolbar.',
			],
			[
				'name'        => 'footer',
				'description' => 'Content at the start of the footer. In Livewire, a footer slot that holds table rows (<tr>) still renders in a <tfoot>, as in 2.x.',
			],
			[
				'name'        => 'empty',
				'description' => 'Replaces the empty state, such as an EmptyState with an action.',
			],
			[
				'name'        => 'cell',
				'scoped'      => true,
				'parameters'  => [ 'row', 'column', 'index' ],
				'description' => 'A column\'s cell content, given the row. Blade @scope(\'cell_<key>\', $row), Vue #cell-<key>, React renderCell.',
			],
			[
				'name'        => 'header',
				'scoped'      => true,
				'parameters'  => [ 'column' ],
				'description' => 'A column\'s header content, given the column. Blade @scope(\'header_<key>\', $header), Vue #header-<key>, React renderHeader.',
			],
			[
				'name'        => 'actions',
				'scoped'      => true,
				'parameters'  => [ 'row', 'index' ],
				'description' => 'Row actions in a last, end-aligned column, given the row. Blade @scope(\'actions\', $row), Vue #actions, React renderActions.',
			],
			[
				'name'        => 'expansion',
				'scoped'      => true,
				'parameters'  => [ 'row', 'index' ],
				'description' => 'An expanded row\'s content, given the row. Blade @scope(\'expansion\', $row), Vue #expansion, React renderExpansion.',
			],
		],
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'The selection changed, by a row box or select all. The payload is the selected keys. Setting value doesn\'t fire it.',
				'payload'     => 'Array<string | number>',
			],
			[
				'name'        => 'sort-change',
				'description' => 'A sortable header was chosen. The payload is the next sort: ascending first, then toggling. Livewire dispatches it as a browser event with { column, direction } in $event.detail.',
				'payload'     => '{ column: string; direction: \'asc\' | \'desc\' }',
			],
			[
				'name'        => 'expanded-change',
				'description' => 'A row was expanded or collapsed. The payload is the expanded keys.',
				'payload'     => 'Array<string | number>',
			],
			[
				'name'        => 'row-click',
				'description' => 'A row was clicked outside its links, buttons and boxes. The payload is the row. In Livewire it fires only when something listens on the table (x-on:row-click, @row-click or wire:row-click).',
				'payload'     => 'row',
			],
		],
		'a11y'        => [
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves through the select-all box, the sort buttons, then each row\'s box, expand button and the links and buttons in its cells.',
				],
				[
					'keys'   => 'Enter / Space',
					'action' => 'On a sort button, sorts by that column (ascending, then toggling); on an expand button, shows or hides the row\'s expansion.',
				],
				[
					'keys'   => 'Space',
					'action' => 'On a checkbox, selects or clears the row, or every row on screen for select all.',
				],
			],
			'requirements' => [ 'Real table markup: a table with thead and tbody, header cells with scope="col".', 'The table is named by its title (aria-labelledby) or label (aria-label).', 'A sortable header carries aria-sort (ascending, descending or none) and holds a button named by sortLabel; the icon is decorative.', 'Row boxes are named by selectRowLabel and selected rows carry aria-selected="true"; the select-all box is named by selectAllLabel and is mixed (indeterminate) while some rows are selected.', 'Expand buttons are named by expandLabel and carry aria-expanded and aria-controls; the chevron mirrors in RTL.', 'While loading, the root carries aria-busy="true" and the skeleton rows are aria-hidden.', 'Focus is visible on every control; a focused cell uses an inset ring so it never overlaps its neighbors.', 'Numbers end-align with tabular figures; status uses a Badge, never a whole-row color.' ],
			'wcag'         => [ '1.3.1', '1.3.2', '1.4.3', '1.4.11', '2.1.1', '2.4.6', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-border-muted', '--apui-border-width', '--apui-cell-padding-x', '--apui-control-height-xs', '--apui-elevation-glass', '--apui-focus-ring-color', '--apui-focus-ring-offset', '--apui-focus-ring-offset-color', '--apui-focus-ring-width', '--apui-font-family-sans', '--apui-font-weight-medium', '--apui-font-weight-semibold', '--apui-icon-size-md', '--apui-icon-size-sm', '--apui-motion-duration-fast', '--apui-motion-ease-standard', '--apui-radius-xs', '--apui-row-height', '--apui-selected-bg', '--apui-state-hover', '--apui-surface-default', '--apui-surface-glass', '--apui-surface-glass-blur', '--apui-surface-glass-border', '--apui-surface-glass-saturation', '--apui-surface-raised', '--apui-surface-sunken', '--apui-table-head-weight', '--apui-table-radius', '--apui-text-default', '--apui-text-muted', '--apui-text-muted-glass', '--apui-type-body-lg-font-size', '--apui-type-body-lg-line-height', '--apui-type-body-md-font-size', '--apui-type-body-md-line-height', '--apui-type-body-sm-font-size', '--apui-type-body-sm-line-height', '--apui-type-caption-font-size', '--apui-type-caption-line-height', '--apui-table-max-block-size' ],
		'fixture'     => [
			'props'  => [
				'title'      => 'Transaction history',
				'headers'    => [
					[
						'key'       => 'symbol',
						'label'     => 'Product name',
						'secondary' => 'company',
						'sortable'  => true,
					],
					[
						'key'     => 'amount',
						'label'   => 'Order amount',
						'numeric' => true,
					],
					[
						'key'      => 'date',
						'label'    => 'Date',
						'sortable' => true,
					],
					[
						'key'   => 'status',
						'label' => 'Status',
					],
					[
						'key'   => 'owner',
						'label' => 'Executed by',
					],
				],
				'rows'       => [
					[
						'id'      => 1,
						'symbol'  => 'TSLA',
						'company' => 'Tesla, Inc.',
						'amount'  => '$30,021.23',
						'date'    => 'Dec 13, 2023',
						'status'  => 'Processing',
						'owner'   => 'Olivia Rhye',
					],
					[
						'id'      => 2,
						'symbol'  => 'MTCH',
						'company' => 'Match Group, Inc.',
						'amount'  => '$10,045.00',
						'date'    => 'Dec 13, 2023',
						'status'  => 'Success',
						'owner'   => 'Phoenix Baker',
					],
					[
						'id'      => 3,
						'symbol'  => 'DDOG',
						'company' => 'Datadog Inc.',
						'amount'  => '$40,132.16',
						'date'    => 'Dec 13, 2023',
						'status'  => 'Success',
						'owner'   => 'Lana Steiner',
					],
					[
						'id'      => 4,
						'symbol'  => 'ARKG',
						'company' => 'ARK Genomic Revolution ETF',
						'amount'  => '$22,665.12',
						'date'    => 'Dec 28, 2023',
						'status'  => 'Declined',
						'owner'   => 'Demi Wilkinson',
					],
				],
				'selectable' => true,
				'expandable' => true,
				'value'      => [ 2 ],
				'sortBy'     => [
					'column'    => 'date',
					'direction' => 'desc',
				],
				'footer'     => '1 selected · 4 of 128 transactions',
				'pagination' => [
					'page'    => 3,
					'total'   => 128,
					'perPage' => 4,
				],
			],
			'parts'  => [
				'expanded' => [ 1 ],
			],
			'states' => [ 'loading' ],
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
	'Text'              => [
		'name'        => 'Text',
		'description' => 'Body text with a size, tone and weight, cut to one line with truncate or to a number of lines with clamp. Paragraphs keep to the reading measure.',
		'status'      => 'draft',
		'issue'       => 58,
		'rootClass'   => 'apui-text',
		'stacks'      => [
			'livewire' => [
				'name' => 'text',
			],
			'react'    => [
				'name' => 'Text',
			],
			'vue'      => [
				'name' => 'Text',
			],
		],
		'props'       => [
			[
				'name'        => 'as',
				'type'        => 'enum',
				'values'      => [ 'p', 'span', 'div' ],
				'default'     => 'p',
				'description' => 'The element: p for a paragraph, span for text inside a line, div for a block that holds other blocks.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'xs', 'sm', 'md', 'lg', 'lead' ],
				'default'     => 'md',
				'description' => '12/16, 13/18, 14/20, 16/24, or lead (19/28, muted unless a tone is set) for an introduction. Emitted as data-size.',
			],
			[
				'name'        => 'tone',
				'type'        => 'enum',
				'values'      => [ 'default', 'muted', 'success', 'warning', 'error' ],
				'default'     => 'default',
				'description' => 'Text color. Emitted as data-tone.',
				'a11y'        => 'Status tones are never the only signal, and muted is not for anything people must read.',
			],
			[
				'name'        => 'weight',
				'type'        => 'enum',
				'values'      => [ 'regular', 'medium', 'semibold' ],
				'default'     => 'regular',
				'description' => 'Font weight. Emitted as data-weight.',
			],
			[
				'name'        => 'truncate',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Cuts to one line with an ellipsis. Emitted as data-truncate.',
				'a11y'        => 'Plain-text content is copied to the title attribute, so the full value stays available.',
			],
			[
				'name'        => 'clamp',
				'type'        => 'number',
				'description' => 'Cuts after this many lines. Emitted as data-clamp, with the count in --apui-text-clamp.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes for the root: { root: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'p | span | div',
				'description' => 'The text.',
			],
		],
		'slots'       => [],
		'events'      => [],
		'a11y'        => [
			'element'      => 'p',
			'requirements' => [ 'Keeps 4.5:1 in every tone and theme; muted is --apui-text-muted.', 'Status tones (success, warning, error) are never the only signal: the words carry the meaning.', 'Truncated and clamped text keeps its full value in the title attribute when it is plain text; otherwise give it one, or a tooltip.', 'Paragraphs keep to --apui-measure.' ],
			'wcag'         => [ '1.4.1', '1.4.3' ],
		],
		'tokens'      => [ '--apui-text-default', '--apui-text-muted', '--apui-color-success-text', '--apui-color-warning-text', '--apui-color-error-text', '--apui-measure', '--apui-type-body-md-font-size', '--apui-type-body-sm-font-size', '--apui-type-body-lg-font-size', '--apui-type-caption-font-size', '--apui-font-weight-medium', '--apui-font-weight-semibold' ],
		'fixture'     => [
			'content' => 'Twenty-four bright apartments around a garden courtyard.',
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
	'ThemePreview'      => [
		'name'        => 'ThemePreview',
		'description' => 'Selectable cards that show a live miniature of each theme or preset: a radio group whose miniatures are drawn with the real tokens, by setting data-theme and data-preset on each miniature, so they stay accurate after a rebrand. A system card shows light and dark halves. Livewire only (D-003).',
		'status'      => 'draft',
		'issue'       => 65,
		'rootClass'   => 'apui-theme-preview',
		'stacks'      => [
			'livewire' => [
				'name'         => 'theme-preview',
				'capabilities' => [ 'wire:model binds the chosen option\'s value to each native radio, so .live sends it at once', 'Replaces the 2.x <livewire:theme-preview> theme builder tool, which is removed' ],
			],
			'react'    => false,
			'vue'      => false,
		],
		'props'       => [
			[
				'name'        => 'options',
				'type'        => 'array',
				'required'    => true,
				'description' => 'The cards: { value, label, theme, preset, disabled }. theme is light, dark, high-contrast or system (light and dark halves); without it, a value that names a theme is used, else light. preset sets data-preset on the miniature.',
			],
			[
				'name'        => 'value',
				'type'        => 'string',
				'description' => 'The chosen option\'s value. Livewire binds it with wire:model.',
			],
			[
				'name'        => 'name',
				'type'        => 'string',
				'description' => 'The radios\' name. Defaults to the wire:model property, else a generated one.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'default'     => 'Theme',
				'description' => 'Names the radio group. Translate it: Livewire defaults it through __().',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { card: \'…\', frame: \'…\', label: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The radio group, named by label: a grid of cards.',
			],
			[
				'name'        => 'card',
				'element'     => 'label',
				'description' => 'One option, also .apui-theme-card: the frame and the label. Clicking anywhere on it checks its radio.',
			],
			[
				'name'        => 'frame',
				'element'     => 'span',
				'description' => 'The bordered 16:10 frame around the miniature; the checked card\'s frame takes the primary edge and ring.',
			],
			[
				'name'        => 'miniature',
				'element'     => 'span',
				'description' => 'The decorative page, aria-hidden, carrying data-theme and data-preset so the real tokens draw it. A system card has two, data-half start and end.',
			],
			[
				'name'        => 'sidebar',
				'element'     => 'span',
				'description' => 'The miniature\'s sidebar, with three lines.',
			],
			[
				'name'        => 'main',
				'element'     => 'span',
				'description' => 'The miniature\'s content: the header tile, then the tiles.',
			],
			[
				'name'        => 'tiles',
				'element'     => 'span',
				'description' => 'The two tiles under the header.',
			],
			[
				'name'        => 'tile',
				'element'     => 'span',
				'description' => 'A surface in the miniature; the header tile carries data-header.',
			],
			[
				'name'        => 'line',
				'element'     => 'span',
				'description' => 'A line of text in the miniature: data-accent for the primary color, data-strong for a figure.',
			],
			[
				'name'        => 'pill',
				'element'     => 'span',
				'description' => 'The miniature\'s primary button.',
			],
			[
				'name'        => 'label',
				'element'     => 'span',
				'description' => 'The radio and the option\'s name, under the frame.',
			],
			[
				'name'        => 'box',
				'element'     => 'span',
				'description' => 'The radio\'s circle.',
			],
			[
				'name'        => 'control',
				'element'     => 'input',
				'description' => 'The native radio, transparent over the box, carrying wire:model.',
			],
			[
				'name'        => 'indicator',
				'element'     => 'span',
				'description' => 'The checked radio\'s dot.',
			],
			[
				'name'        => 'text',
				'element'     => 'span',
				'description' => 'The option\'s name, the radio\'s accessible name.',
			],
		],
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'Another card was chosen.',
				'payload'     => 'string',
			],
		],
		'a11y'        => [
			'role'         => 'radiogroup',
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Moves to the checked card\'s radio, or the first one.',
				],
				[
					'keys'   => 'ArrowRight, ArrowDown, ArrowLeft, ArrowUp',
					'action' => 'Moves to the next or previous card and checks it (platform behavior), following the text direction.',
				],
				[
					'keys'   => 'Space',
					'action' => 'Checks the focused card.',
				],
			],
			'requirements' => [ 'A role=radiogroup named by label, of native radios sharing one name, so the platform supplies roving focus and the arrow keys.', 'The miniature is decorative (aria-hidden); the label carries the name.', 'ArrowLeft and ArrowRight follow the text direction (native radios do in RTL); the System card\'s halves mirror too.', 'The checked card is shown by its frame\'s edge and ring and by the filled radio, not by color alone.', 'The focus ring shows on the frame while its radio has focus.', 'Miniatures are drawn with the real tokens, so they match the theme or preset they show.' ],
			'wcag'         => [ '1.1.1', '1.3.1', '1.4.1', '1.4.11', '2.1.1', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-radius-md', '--apui-border-default', '--apui-border-strong', '--apui-border-muted', '--apui-color-primary', '--apui-color-primary-soft', '--apui-color-primary-foreground', '--apui-surface-page', '--apui-surface-default', '--apui-text-default', '--apui-focus-ring-color', '--apui-focus-ring-offset-color' ],
		'fixture'     => [
			'props'  => [
				'label'   => 'Appearance',
				'value'   => 'dark',
				'options' => [
					[
						'value' => 'light',
						'label' => 'Light',
					],
					[
						'value' => 'dark',
						'label' => 'Dark',
					],
					[
						'value' => 'high-contrast',
						'label' => 'High contrast',
					],
					[
						'value' => 'system',
						'label' => 'System',
					],
				],
			],
			'states' => [],
		],
	],
	'ThemeToggle'       => [
		'name'        => 'ThemeToggle',
		'description' => 'Lets people choose light, dark, high contrast or system. The choice sets data-theme on the document, the attribute the tokens switch on, persists in localStorage and is applied before first paint by a blocking head snippet, so there\'s no flash. System follows prefers-color-scheme live. Segmented is a radio group on the segmented Tabs track; icon is one button that switches light and dark; menu is a DropdownMenu of radio items.',
		'status'      => 'draft',
		'issue'       => 65,
		'rootClass'   => 'apui-theme-toggle',
		'stacks'      => [
			'livewire' => [
				'name'         => 'theme-toggle',
				'capabilities' => [ 'wire:model binds the choice; without it the stored choice shows', '@apuiThemeScript in <head> applies the stored choice before first paint', 'The 2.x light and dark labels still work, as lightLabel and darkLabel' ],
			],
			'react'    => [
				'name'         => 'ThemeToggle',
				'capabilities' => [ 'ThemeScript in <head> applies the stored choice before first paint' ],
			],
			'vue'      => [
				'name'         => 'ThemeToggle',
				'capabilities' => [ 'ThemeScript in <head> applies the stored choice before first paint' ],
			],
		],
		'props'       => [
			[
				'name'        => 'value',
				'type'        => 'enum',
				'values'      => [ 'light', 'dark', 'high-contrast', 'system' ],
				'default'     => 'system',
				'description' => 'The choice. Livewire binds it with wire:model, Vue with v-model. Without it, the stored choice shows, else system.',
			],
			[
				'name'        => 'defaultValue',
				'type'        => 'enum',
				'values'      => [ 'light', 'dark', 'high-contrast', 'system' ],
				'default'     => 'system',
				'description' => 'The choice an uncontrolled toggle shows when nothing is stored.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'segmented', 'icon', 'menu' ],
				'default'     => 'segmented',
				'description' => 'Segmented shows every choice on a track; icon is one button that switches between light and dark; menu opens the choices from a Theme button. Emitted as data-variant.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'sm', 'md' ],
				'default'     => 'md',
				'description' => 'The track\'s, the button\'s or the trigger\'s size. Emitted as data-size.',
			],
			[
				'name'        => 'choices',
				'type'        => 'array',
				'description' => 'The choices segmented and menu offer, in the order light, dark, high-contrast, system. Defaults to all four.',
				'a11y'        => 'Keep high contrast offered: don\'t hide it behind settings only.',
			],
			[
				'name'        => 'iconOnly',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Segmented shows only the icons. The names stay, visually hidden, as each radio\'s accessible name. Emitted as data-icon-only.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'default'     => 'Theme',
				'description' => 'Names the radio group and the menu, and is the menu trigger\'s text. Translate it: Livewire defaults it through __().',
			],
			[
				'name'        => 'lightLabel',
				'type'        => 'string',
				'default'     => 'Light',
				'description' => 'The light choice\'s name.',
			],
			[
				'name'        => 'darkLabel',
				'type'        => 'string',
				'default'     => 'Dark',
				'description' => 'The dark choice\'s name.',
			],
			[
				'name'        => 'highContrastLabel',
				'type'        => 'string',
				'default'     => 'High contrast',
				'description' => 'The high contrast choice\'s name.',
			],
			[
				'name'        => 'systemLabel',
				'type'        => 'string',
				'default'     => 'System',
				'description' => 'The system choice\'s name in the segmented control.',
			],
			[
				'name'        => 'matchSystemLabel',
				'type'        => 'string',
				'default'     => 'Match system',
				'description' => 'The system choice\'s name in the menu.',
			],
			[
				'name'        => 'switchToLightLabel',
				'type'        => 'string',
				'default'     => 'Switch to light theme',
				'description' => 'The icon button\'s accessible name while it switches to light.',
			],
			[
				'name'        => 'switchToDarkLabel',
				'type'        => 'string',
				'default'     => 'Switch to dark theme',
				'description' => 'The icon button\'s accessible name while it switches to dark.',
			],
			[
				'name'        => 'persist',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Stores the choice in localStorage, where the head snippet reads it.',
			],
			[
				'name'        => 'storageKey',
				'type'        => 'string',
				'default'     => 'apui-theme',
				'description' => 'The localStorage key. Pass the same key to the head snippet.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { list: \'…\', option: \'…\', button: \'…\', trigger: \'…\', menu: \'…\', item: \'…\' }.',
			],
		],
		'variants'    => [ 'segmented', 'icon', 'menu' ],
		'sizes'       => [ 'sm', 'md' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'Holds the control. Segmented: also .apui-tabs, holding the list (a radiogroup scoped tabs) and a role=radio trigger per choice. Icon: a ghost .apui-button. Menu: an outline .apui-button trigger and the .apui-dropdown-menu of menuitemradio items, scoped dropdown-menu (D-019).',
			],
		],
		'events'      => [
			[
				'name'        => 'value-change',
				'description' => 'The person chose another theme, by click, the keyboard or the icon button, in this toggle. Setting value doesn\'t fire it.',
				'payload'     => '\'light\' | \'dark\' | \'high-contrast\' | \'system\'',
			],
		],
		'a11y'        => [
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Segmented: moves to the checked choice, then out of the group.',
				],
				[
					'keys'   => 'ArrowRight, ArrowLeft, ArrowDown, ArrowUp',
					'action' => 'Segmented: moves to the next or previous choice and applies it, wrapping. ArrowLeft and ArrowRight follow the text direction, so in RTL ArrowLeft moves to the next choice.',
				],
				[
					'keys'   => 'Home, End',
					'action' => 'Segmented: moves to the first or last choice and applies it.',
				],
				[
					'keys'   => 'Enter, Space',
					'action' => 'Icon: switches the theme. Menu: opens the menu, then applies the focused choice.',
				],
				[
					'keys'   => 'Escape',
					'action' => 'Menu: closes it and returns focus to the trigger.',
				],
			],
			'requirements' => [ 'Segmented is a role=radiogroup named by label, with a role=radio per choice, aria-checked, and only the checked one in the Tab order.', 'Every radio and menu item has its name, also when only icons show: iconOnly keeps it visually hidden.', 'The icon button\'s name says what it does (Switch to dark theme), and changes with the theme.', 'The menu\'s choices are menuitemradio with aria-checked, and the trigger shows the current choice\'s icon.', 'The choice persists and is applied before first paint, so there is no flash: put the head snippet in <head>.', 'Storage is guarded: a private window or blocked storage falls back to the default, without errors.', 'System follows prefers-color-scheme live.', 'ArrowLeft and ArrowRight follow the text direction: in RTL, ArrowLeft moves to the next choice.', 'The checked choice is shown by surface and edge, not by color alone; the focus ring shows on the focused choice.' ],
			'wcag'         => [ '1.3.1', '1.4.1', '1.4.3', '1.4.11', '2.1.1', '2.4.3', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-tabs-radius', '--apui-surface-sunken', '--apui-surface-raised', '--apui-border-muted', '--apui-control-height-sm', '--apui-control-height-md', '--apui-text-default', '--apui-text-muted', '--apui-focus-ring-color', '--apui-focus-ring-offset-color' ],
		'fixture'     => [
			'props'  => [
				'value'   => 'dark',
				'persist' => false,
			],
			'parts'  => [
				'choices' => [ 'light', 'dark', 'system' ],
			],
			'states' => [],
		],
	],
	'Timeline'          => [
		'name'        => 'Timeline',
		'description' => 'Events in order, newest or oldest first, each with an icon or dot marker, a head, a time and optional body text or a card. Compose it from TimelineItem children, or pass the same events as items. For steps still to come, use Steps.',
		'status'      => 'draft',
		'issue'       => 61,
		'rootClass'   => 'apui-timeline',
		'stacks'      => [
			'livewire' => [
				'name'         => 'timeline',
				'capabilities' => [ 'Children: timeline-item; items renders the same children, before them', 'A timeline-item\'s default slot is its head; its card slot holds rich card content', 'A 2.x timeline-item\'s subtitle still works, as time; first, last and pending are ignored' ],
			],
			'react'    => [
				'name'         => 'Timeline',
				'capabilities' => [ 'Children: TimelineItem, after items; children of an item are its head' ],
			],
			'vue'      => [
				'name'         => 'Timeline',
				'capabilities' => [ 'Children: TimelineItem, after items; an item\'s default slot is its head' ],
			],
		],
		'props'       => [
			[
				'name'        => 'items',
				'type'        => 'array',
				'description' => 'The events as data, rendering the same children as composition: { title, time, datetime, icon, color, description, card }. title is the head; time the visible time, with datetime as its machine-readable value; icon a registry name; color tints the marker; description the muted body; card a sunken box, such as a comment.',
			],
			[
				'name'        => 'variant',
				'type'        => 'enum',
				'values'      => [ 'icon', 'dot' ],
				'default'     => 'icon',
				'description' => 'Icon markers in a soft circle, or small dots for a compact status history. Dots leave the icons out. Emitted as data-variant.',
			],
			[
				'name'        => 'label',
				'type'        => 'string',
				'description' => 'The list\'s accessible name, such as "Activity".',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, its items\' included, such as { marker: \'…\', time: \'…\' }.',
			],
		],
		'variants'    => [ 'icon', 'dot' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'ol',
				'description' => 'The ordered list of events. It is the spec\'s list part.',
			],
			[
				'name'        => 'item',
				'element'     => 'li',
				'description' => 'One event. The line to the next marker is drawn from the inline start, so it mirrors in RTL.',
			],
			[
				'name'        => 'marker',
				'element'     => 'span',
				'description' => 'The icon in a soft circle, or a dot, with data-color. Hidden from assistive technology.',
			],
			[
				'name'        => 'head',
				'element'     => 'div',
				'description' => 'What happened, then the time at the end.',
			],
			[
				'name'        => 'time',
				'element'     => 'time',
				'description' => 'When it happened, with datetime when given.',
			],
			[
				'name'        => 'body',
				'element'     => 'div',
				'description' => 'Muted detail under the head.',
			],
			[
				'name'        => 'card',
				'element'     => 'div',
				'description' => 'A sunken box under the head, such as a comment.',
			],
		],
		'events'      => [],
		'a11y'        => [
			'element'      => 'ol',
			'requirements' => [ 'An ordered list, so the count and position are announced.', 'Times use time elements, with datetime for the machine-readable value.', 'Markers are decorative and hidden: what happened is in the head, never only in an icon or color.', 'Times and body text keep 4.5:1 (--apui-text-muted).' ],
			'wcag'         => [ '1.3.1', '1.4.1', '1.4.3' ],
		],
		'tokens'      => [ '--apui-text-default', '--apui-text-muted', '--apui-border-muted', '--apui-border-default', '--apui-surface-sunken', '--apui-color-neutral-soft', '--apui-color-neutral-soft-foreground', '--apui-focus-ring-offset-color', '--apui-radius-full', '--apui-radius-md', '--apui-type-body-md-font-size', '--apui-type-body-sm-font-size', '--apui-type-caption-font-size', '--apui-icon-size-md' ],
		'fixture'     => [
			'props' => [
				'items' => [
					[
						'title'       => 'Offer accepted on Lakeview Lofts',
						'time'        => '2h ago',
						'datetime'    => '2026-11-12T08:00',
						'icon'        => 'circle-check',
						'color'       => 'success',
						'description' => 'Phoenix Baker accepted $248,000.',
					],
					[
						'title' => 'Olivia Rhye commented',
						'time'  => '5h ago',
						'icon'  => 'message-square',
						'card'  => 'Can we move the viewing to Thursday at 11:00?',
					],
					[
						'title'    => 'Payment declined for ARKG',
						'time'     => 'Dec 28',
						'datetime' => '2026-12-28',
						'icon'     => 'circle-alert',
						'color'    => 'error',
					],
					[
						'title'    => 'Listing published',
						'time'     => 'Dec 13',
						'datetime' => '2026-12-13',
						'icon'     => 'house',
						'color'    => 'primary',
					],
				],
			],
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
	'Tooltip'           => [
		'name'        => 'Tooltip',
		'description' => 'A short label shown on hover and keyboard focus. The trigger is the author\'s own control: the tooltip describes it with aria-describedby while it shows. It waits delay before showing on hover, shows at once on focus, stays while the pointer is on it and closes on Escape. Never put links or buttons in a tooltip; use Popover.',
		'status'      => 'draft',
		'issue'       => 59,
		'rootClass'   => 'apui-tooltip',
		'stacks'      => [
			'livewire' => [
				'name'         => 'tooltip',
				'capabilities' => [ 'wire:model binds open both ways through $wire.entangle()', 'The first element in the default slot becomes the trigger; text is wrapped in a focusable span' ],
			],
			'react'    => [
				'name' => 'Tooltip',
			],
			'vue'      => [
				'name' => 'Tooltip',
			],
		],
		'props'       => [
			[
				'name'        => 'content',
				'type'        => 'string',
				'required'    => true,
				'description' => 'The label. Keep it short; it describes the trigger, it doesn\'t name it.',
				'a11y'        => 'Linked to the trigger with aria-describedby while it shows. Never the only name of an icon button: give the button its own aria-label.',
			],
			[
				'name'        => 'placement',
				'type'        => 'enum',
				'values'      => [ 'top', 'bottom', 'start', 'end' ],
				'default'     => 'top',
				'description' => 'The trigger\'s side the label sits on, centered. start and end follow the reading direction. Emitted as data-placement; the side the machine settled on, after flipping, is data-side.',
			],
			[
				'name'        => 'delay',
				'type'        => 'number',
				'default'     => 400,
				'description' => 'Milliseconds the pointer rests on the trigger before the label shows. Keyboard focus shows it at once.',
			],
			[
				'name'        => 'size',
				'type'        => 'enum',
				'values'      => [ 'md', 'lg' ],
				'default'     => 'md',
				'description' => 'md is a one-line label; lg is for a sentence or two, at body size. Emitted as data-size.',
			],
			[
				'name'        => 'shortcut',
				'type'        => 'string',
				'description' => 'A keyboard shortcut shown after the label, as keys joined with + (⌘+K). Each key is a kbd part.',
			],
			[
				'name'        => 'open',
				'type'        => 'boolean',
				'description' => 'Controls the label: true shows it, false hides it, whatever the pointer and focus do. Leave it out to let hover and focus show it. Livewire binds it with wire:model, Vue with v-model:open. Emitted as data-state.',
			],
			[
				'name'        => 'defaultOpen',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'The initial state of an uncontrolled tooltip.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'disabled',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Never shows the label. Emitted as data-disabled on the label.',
			],
			[
				'name'        => 'portal',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Renders the label at the end of the body, above everything (x-teleport, a React portal, Vue Teleport). Off renders it in place.',
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, such as { root: \'…\', kbd: \'…\' }.',
			],
		],
		'sizes'       => [ 'md', 'lg' ],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The label, carrying the root class. It is Zag\'s content part, so it also carries data-part="content" (D-019).',
			],
			[
				'name'        => 'content',
				'element'     => 'div',
				'description' => 'The label: the same element as root.',
			],
			[
				'name'        => 'trigger',
				'element'     => 'button',
				'description' => 'The author\'s control, which the label describes.',
			],
			[
				'name'        => 'positioner',
				'element'     => 'div',
				'description' => 'Places the label against the trigger.',
			],
			[
				'name'        => 'arrow',
				'element'     => 'span',
				'description' => 'Points at the trigger. Decorative.',
			],
			[
				'name'        => 'kbd',
				'element'     => 'kbd',
				'description' => 'One key of the shortcut.',
			],
		],
		'slots'       => [
			[
				'name'        => 'content',
				'description' => 'Rich label content (text and inline formatting only), in place of the content prop.',
			],
		],
		'events'      => [
			[
				'name'        => 'open-change',
				'description' => 'The label showed or hid itself: hover, focus, blur or Escape. Setting open doesn\'t fire it.',
				'payload'     => 'boolean',
			],
		],
		'a11y'        => [
			'role'         => 'tooltip',
			'element'      => 'div',
			'keyboard'     => [
				[
					'keys'   => 'Tab',
					'action' => 'Focusing the trigger shows the label at once.',
				],
				[
					'keys'   => 'Escape',
					'action' => 'Hides the label; focus stays on the trigger.',
				],
			],
			'requirements' => [ 'Shown on hover and keyboard focus; dismissible with Escape without moving focus or the pointer; hoverable, so the pointer can move onto it (WCAG 1.4.13).', 'The label is role=tooltip and is linked to the trigger with aria-describedby while it shows.', 'Never the only name of an icon button: the button keeps its own aria-label.', 'No links, buttons or other interactive content in the label; use Popover.', 'Text keeps 4.5:1 on the inverse surface in every theme, and the label has a visible edge in forced colors.', 'start and end follow the reading direction, and the label flips to stay in the viewport.', 'Every part keeps a stable, server-rendered id in Livewire, so morphs never replace the label (D-015).' ],
			'wcag'         => [ '1.3.1', '1.4.3', '1.4.13', '2.1.1', '4.1.2' ],
		],
		'tokens'      => [ '--apui-tooltip-radius', '--apui-kbd-radius', '--apui-surface-inverse', '--apui-text-inverse', '--apui-z-tooltip' ],
		'fixture'     => [
			'content' => 'Archive',
			'props'   => [
				'open'      => true,
				'portal'    => false,
				'placement' => 'bottom',
				'content'   => 'Archive this listing',
			],
			'parts'   => [
				'shortcut' => 'E',
			],
			'states'  => [],
		],
	],
	'UserMenu'          => [
		'name'        => 'UserMenu',
		'description' => 'The account menu: an avatar button that opens a DropdownMenu with the person\'s identity, a workspace switcher, a theme control, your items and Log out, which always comes last. Composed from Avatar and DropdownMenu, on the same menu machine.',
		'status'      => 'draft',
		'issue'       => 58,
		'rootClass'   => 'apui-user-menu',
		'stacks'      => [
			'livewire' => [
				'name'         => 'user-menu',
				'capabilities' => [ 'Children: dropdown-menu-item, dropdown-menu-group and dropdown-menu-separator, after items', 'profile stays as a deprecated alias', 'logoutAction posts the log out item to a URL with the CSRF token' ],
			],
			'react'    => [
				'name'         => 'UserMenu',
				'capabilities' => [ 'Children: DropdownMenuItem, DropdownMenuGroup and DropdownMenuSeparator, after items' ],
			],
			'vue'      => [
				'name'         => 'UserMenu',
				'capabilities' => [ 'Children: DropdownMenuItem, DropdownMenuGroup and DropdownMenuSeparator, after items' ],
			],
		],
		'props'       => [
			[
				'name'        => 'user',
				'type'        => 'object',
				'required'    => true,
				'description' => 'Who is signed in: { name, email, avatar, role, status }. avatar is an image URL; role is the line under the name in the trigger, such as "Admin · Apexify"; status is online, away or offline.',
			],
			[
				'name'        => 'workspaces',
				'type'        => 'array',
				'description' => 'Workspaces to switch between: { id, name }. Two or more render a Workspace group of radio items.',
			],
			[
				'name'        => 'workspace',
				'type'        => 'string',
				'description' => 'The current workspace\'s id, checked in the group.',
			],
			[
				'name'        => 'hideTheme',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Hides the theme control (light, dark and system radio items), for apps with one theme.',
			],
			[
				'name'        => 'theme',
				'type'        => 'enum',
				'values'      => [ 'light', 'dark', 'system' ],
				'default'     => 'system',
				'description' => 'The checked theme. Setting the theme on the page stays yours, on theme-change.',
			],
			[
				'name'        => 'items',
				'type'        => 'array',
				'description' => 'Menu items between the theme control and Log out, as DropdownMenu items data: { value, label, icon, shortcut, disabled }, separators and groups.',
			],
			[
				'name'        => 'compact',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Shows only the avatar in the trigger, for a top bar. The trigger keeps the name as its accessible name.',
			],
			[
				'name'        => 'open',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'Whether the menu is open. Emitted as data-state on its parts.',
			],
			[
				'name'        => 'defaultOpen',
				'type'        => 'boolean',
				'default'     => false,
				'description' => 'The initial state of an uncontrolled menu.',
				'stacks'      => [ 'react' ],
			],
			[
				'name'        => 'align',
				'type'        => 'enum',
				'values'      => [ 'start', 'center', 'end' ],
				'default'     => 'start',
				'description' => 'Which of the menu\'s edges lines up with the trigger\'s. Logical: follows the text direction.',
			],
			[
				'name'        => 'surface',
				'type'        => 'enum',
				'values'      => [ 'overlay', 'glass' ],
				'default'     => 'overlay',
				'description' => 'The menu\'s surface. Emitted as data-surface.',
			],
			[
				'name'        => 'portal',
				'type'        => 'boolean',
				'default'     => true,
				'description' => 'Renders the menu at the end of the body. Off renders it in place.',
			],
			[
				'name'        => 'workspaceLabel',
				'type'        => 'string',
				'default'     => 'Workspace',
				'description' => 'The workspace group\'s label. Translate it: Livewire defaults it through __( \'Workspace\' ).',
			],
			[
				'name'        => 'themeLabel',
				'type'        => 'string',
				'default'     => 'Theme',
				'description' => 'The theme group\'s label. Translate it: Livewire defaults it through __( \'Theme\' ).',
			],
			[
				'name'        => 'themeLabels',
				'type'        => 'object',
				'default'     => [
					'light'  => 'Light',
					'dark'   => 'Dark',
					'system' => 'System',
				],
				'description' => 'The theme options\' names, read by screen readers: { light, dark, system }. Translate them: Livewire defaults them through __().',
			],
			[
				'name'        => 'logoutLabel',
				'type'        => 'string',
				'default'     => 'Log out',
				'description' => 'The last item\'s label. Translate it: Livewire defaults it through __( \'Log out\' ).',
			],
			[
				'name'        => 'logoutAction',
				'type'        => 'string',
				'description' => 'A URL the Log out item posts to, with the CSRF token, such as route( \'logout\' ). Without it, Log out reports select with the value logout.',
				'stacks'      => [ 'livewire' ],
			],
			[
				'name'        => 'classes',
				'type'        => 'object',
				'description' => 'Extra classes per part, the menu\'s included, such as { trigger: \'…\', item: \'…\' }.',
			],
		],
		'parts'       => [
			[
				'name'        => 'root',
				'element'     => 'div',
				'description' => 'The menu panel: .apui-dropdown-menu.apui-user-menu, the machine\'s content part.',
			],
			[
				'name'        => 'trigger',
				'element'     => 'button',
				'description' => 'The avatar button that opens the menu.',
			],
			[
				'name'        => 'avatar',
				'element'     => 'span',
				'description' => 'The Avatar, in the trigger and in the header.',
			],
			[
				'name'        => 'identity',
				'element'     => 'span',
				'description' => 'The name and the role or email, beside an avatar.',
			],
			[
				'name'        => 'name',
				'element'     => 'span',
				'description' => 'The person\'s name.',
			],
			[
				'name'        => 'role',
				'element'     => 'span',
				'description' => 'The line under the name in the trigger.',
			],
			[
				'name'        => 'indicator',
				'element'     => 'span',
				'description' => 'The up-down chevron at the end of the trigger.',
			],
			[
				'name'        => 'header',
				'element'     => 'div',
				'description' => 'The identity at the top of the menu: avatar, name and email.',
			],
			[
				'name'        => 'email',
				'element'     => 'span',
				'description' => 'The email in the header.',
			],
			[
				'name'        => 'theme',
				'element'     => 'div',
				'description' => 'The theme control\'s group.',
			],
			[
				'name'        => 'themeOptions',
				'element'     => 'div',
				'description' => 'The light, dark and system radio items, as a segmented row.',
			],
		],
		'slots'       => [
			[
				'name'        => 'trigger',
				'description' => 'Replaces the trigger\'s content (avatar, name and role).',
			],
		],
		'events'      => [
			[
				'name'        => 'open-change',
				'description' => 'The menu opened or closed itself.',
				'payload'     => 'boolean',
			],
			[
				'name'        => 'select',
				'description' => 'An item was chosen, by click or Enter. The payload is its value; Log out reports logout.',
				'payload'     => 'string',
			],
			[
				'name'        => 'workspace-change',
				'description' => 'A workspace was chosen. The payload is its id; checking it stays yours, through workspace.',
				'payload'     => 'string',
			],
			[
				'name'        => 'theme-change',
				'description' => 'A theme was chosen. The payload is light, dark or system; applying it stays yours.',
				'payload'     => '\'light\' | \'dark\' | \'system\'',
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
					'keys'   => 'ArrowDown, ArrowUp',
					'action' => 'Move through the items, the workspace and theme options included.',
				],
				[
					'keys'   => 'Enter, Space',
					'action' => 'Chooses the item; a workspace or theme option is checked.',
				],
				[
					'keys'   => 'Escape',
					'action' => 'Closes the menu and returns focus to the trigger.',
				],
			],
			'requirements' => [ 'The trigger is a button with aria-haspopup=menu, aria-expanded and the person\'s name as its accessible name, also when compact.', 'Workspace and theme options are menuitemradio in labelled groups, with aria-checked.', 'The theme options show icons; their names stay in the accessibility tree.', 'Log out is always the last item, after a separator.', 'The avatars inside are decorative: the trigger and the header already say the name.', 'Everything DropdownMenu requires: focus moves in on open and back to the trigger on close, stable ids in Livewire.' ],
			'wcag'         => [ '1.3.1', '1.4.1', '1.4.3', '2.1.1', '2.4.3', '2.4.7', '4.1.2' ],
		],
		'tokens'      => [ '--apui-button-radius', '--apui-state-hover', '--apui-text-default', '--apui-text-muted', '--apui-tabs-radius', '--apui-surface-sunken', '--apui-surface-raised', '--apui-border-muted', '--apui-focus-ring-color', '--apui-focus-ring-offset-color' ],
		'fixture'     => [
			'props'  => [
				'open'       => true,
				'portal'     => false,
				'user'       => [
					'name'   => 'Olivia Rhye',
					'email'  => 'olivia@company.com',
					'role'   => 'Admin · Apexify',
					'status' => 'online',
				],
				'workspaces' => [
					[
						'id'   => 'apexify',
						'name' => 'Apexify',
					],
					[
						'id'   => 'horizon',
						'name' => 'Horizon Homes',
					],
				],
				'workspace'  => 'apexify',
				'theme'      => 'dark',
				'items'      => [
					[
						'value' => 'profile',
						'label' => 'Profile',
						'icon'  => 'user',
					],
					[
						'value' => 'settings',
						'label' => 'Settings',
						'icon'  => 'settings',
					],
				],
			],
			'states' => [],
			'parts'  => [
				'themeLabels' => [
					'light'  => 'Day',
					'dark'   => 'Night',
					'system' => 'Auto',
				],
			],
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
