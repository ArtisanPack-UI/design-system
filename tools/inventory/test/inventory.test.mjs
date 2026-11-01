import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyClass, classTokens, tallyClasses, tallyPhpStrings, themeVariables } from '../lib/daisy.mjs';
import { alignComponent, attributeOutcome, canonicalEvent, normalizeType, resolveAlias, STACKS } from '../lib/diff.mjs';
import { constructorParams, registryEntries } from '../lib/php.mjs';
import { jsxUsages, parseBladeTags, parseVueUsages } from '../lib/usage.mjs';
import { readJson } from '../lib/paths.mjs';

test( 'classifies DaisyUI classes and leaves Tailwind utilities alone', () => {
	assert.equal( classifyClass( 'btn-primary' ).kind, 'component' );
	assert.equal( classifyClass( 'hover:btn-sm' ).kind, 'component' );
	assert.equal( classifyClass( 'bg-base-200' ).kind, 'themeBase' );
	assert.equal( classifyClass( 'text-base-content/60' ).kind, 'themeBase' );
	assert.equal( classifyClass( 'text-primary-content' ).kind, 'themeContent' );
	assert.equal( classifyClass( 'bg-primary' ).kind, 'themeSemantic' );
	assert.equal( classifyClass( 'input-bordered' ).kind, 'ambiguous' );
	assert.equal( classifyClass( 'table-auto' ), null );
	assert.equal( classifyClass( 'select-none' ), null );
	assert.equal( classifyClass( 'list-disc' ), null );
	assert.equal( classifyClass( 'flex' ), null );
	assert.equal( classifyClass( 'cardinal' ), null );
} );

test( 'reads classes only from class attributes, not prose', () => {
	assert.deepEqual( classTokens( '<p class="btn btn-sm">the card and badge</p>' ), [ 'btn', 'btn-sm' ] );
	assert.ok( classTokens( '<a :class="{ \'btn-primary\': active }">' ).includes( 'btn-primary' ) );
	assert.ok( classTokens( "@class(['badge', 'p-4' => $x])" ).includes( 'badge' ) );
	assert.ok( classTokens( "const c = cn('card', x && 'shadow');" ).includes( 'card' ) );
	assert.ok( classTokens( '<div className={`alert p-2`} />' ).includes( 'alert' ) );
	assert.deepEqual( tallyClasses( 'role="alert" the alert' ), {} );
} );

test( 'finds classes assembled in PHP strings but skips ambiguous names', () => {
	const tally = tallyPhpStrings( "$base = ['btn', 'input']; /** 'card' */" );

	assert.deepEqual( tally, { component: { btn: 1 } } );
} );

test( 'detects DaisyUI theme variables', () => {
	assert.deepEqual( themeVariables( 'color: var(--color-base-200); background: oklch(var(--p)); --apui-x: 1' ), [ '--color-base-200', 'var(--p)' ] );
} );

test( 'parses constructor parameters including array and nested defaults', () => {
	const params = constructorParams( `<?php class A {
		/**
		 * @param  string|null  $size  Optional. Size (xs, sm, md). Default 'md'.
		 */
		public function __construct(
			public ?string $size = 'md',
			public array $options = [ 'a', 'b', ],
			public bool $on = true,
			public string $text = 'x, y',
			protected int $count = 3,
		) {}
	}` );

	assert.deepEqual( params.map( ( param ) => param.name ), [ 'size', 'options', 'on', 'text', 'count' ] );
	assert.equal( params[ 0 ].default, 'md' );
	assert.deepEqual( params[ 0 ].values, [ 'xs', 'sm', 'md' ] );
	assert.equal( params[ 2 ].default, true );
	assert.equal( params[ 3 ].default, 'x, y' );
	assert.equal( params[ 4 ].default, 3 );
} );

test( 'parses component registries', () => {
	const source = "protected array $bladeComponents = [ 'a-b' => View\\Components\\AB::class, ];";

	assert.deepEqual( registryEntries( source, 'bladeComponents' ), [ { tag: 'a-b', className: 'AB' } ] );
} );

test( 'finds Blade usages and public attributes across lines', () => {
	const [ usage ] = parseBladeTags( `<x-artisanpack-button
		label="a > b" :icon="$x ? 'y' : 'z'" no-wire-navigate wire:click="go" class="p-2" />` );

	assert.equal( usage.name, 'button' );
	assert.deepEqual( usage.attributes, [ 'label', 'icon', 'noWireNavigate' ] );
} );

test( 'counts only components imported from the library in React and Vue', () => {
	const jsx = `import { Button as B } from '@artisanpack-ui/react/form'; import { Card } from './local';
		<B color="primary" onClick={() => { go(); }} /> <Card title="x" />`;

	assert.deepEqual( jsxUsages( jsx ), [ { name: 'Button', attributes: [ 'color', 'onClick' ] } ] );

	const vue = `<script setup>import { Modal } from '@artisanpack-ui/vue';</script>
		<template><Modal v-model:open="o" :title="t" class="x" /></template>`;

	assert.deepEqual( parseVueUsages( vue ), [ { name: 'Modal', attributes: [ 'v-model:open', 'title' ] } ] );
} );

test( 'normalizes PHP and TypeScript types to one vocabulary', () => {
	assert.equal( normalizeType( '?string' ), 'string' );
	assert.equal( normalizeType( 'string | null' ), 'string' );
	assert.equal( normalizeType( '?bool' ), 'boolean' );
	assert.equal( normalizeType( 'ReactNode' ), 'node' );
	assert.equal( normalizeType( 'Option[]' ), 'array' );
	assert.equal( normalizeType( "'a' | 'b'", [ 'a', 'b' ] ), 'string' );
} );

const aliases = {
	global: [
		{ from: 'uuid', to: null },
		{ from: 'link', to: 'href' },
		{ stack: 'livewire', pattern: '(\\w+)Class', to: 'classes.$1', note: 'part' },
	],
	events: [
		{ stack: 'react', pattern: 'on([A-Z]\\w*)', to: '$kebab1' },
		{ stack: 'vue', pattern: 'update:(\\w+)', to: '$kebab1-change' },
	],
	components: { Demo: [ { stack: 'livewire', from: 'variant', to: 'color' }, { stack: 'vue', from: 'modelValue', to: 'value', idiom: true } ] },
};

test( 'resolves aliases with component rules winning over global ones', () => {
	assert.equal( resolveAlias( aliases, 'Demo', 'livewire', 'variant' ).to, 'color' );
	assert.equal( resolveAlias( aliases, 'Other', 'livewire', 'variant' ), null );
	assert.equal( resolveAlias( aliases, 'Demo', 'livewire', 'hintClass' ).to, 'classes.hint' );
	assert.equal( resolveAlias( aliases, 'Demo', 'react', 'hintClass' ), null );
	assert.equal( canonicalEvent( aliases, 'react', 'onOpenChange' ), 'open-change' );
	assert.equal( canonicalEvent( aliases, 'vue', 'update:open' ), 'open-change' );
	assert.equal( attributeOutcome( aliases, 'Demo', 'livewire', 'uuid' ), 'remove' );
	assert.equal( attributeOutcome( aliases, 'Demo', 'livewire', 'link' ), 'rename' );
	assert.equal( attributeOutcome( aliases, 'Demo', 'livewire', 'label' ), 'unchanged' );
	assert.equal( attributeOutcome( aliases, 'Demo', 'vue', 'modelValue' ), 'unchanged' );
} );

test( 'classifies rename, missing, behavioral and remove', () => {
	const indexes = {
		livewire: new Map( [ [ 'demo', {
			props: [
				{ name: 'link', type: '?string' },
				{ name: 'uuid', type: 'string' },
				{ name: 'size', type: '?string', default: 'md', values: [ 'xs', 'xl' ] },
				{ name: 'solo', type: '?string' },
			],
			slots: { default: true, named: [], dual: [] },
			events: [],
		} ] ] ),
		react: new Map( [ [ 'Demo', {
			props: [
				{ name: 'href', type: 'string' },
				{ name: 'size', type: 'Size', default: 'sm', values: [ 'xs', 'lg' ] },
				{ name: 'disabled', type: 'boolean' },
			],
			slots: [],
			events: [],
		} ] ] ),
		vue: new Map(),
	};
	const result = alignComponent( { canonical: 'Demo', wave: 'Form', livewire: [ 'demo' ], react: [ 'Demo' ], vue: [] }, indexes, aliases );
	const find = ( name ) => result.members.find( ( member ) => member.canonical === name );
	const kinds = ( name ) => find( name ).differences.map( ( difference ) => difference.kind );

	assert.deepEqual( result.stacks, [ 'livewire', 'react' ] );
	assert.deepEqual( kinds( 'href' ), [ 'rename' ] );
	assert.deepEqual( kinds( 'solo' ), [ 'missing' ] );
	assert.deepEqual( kinds( 'size' ), [ 'behavioral', 'behavioral' ] );
	assert.deepEqual( kinds( 'disabled' ), [] );
	assert.equal( result.members.find( ( member ) => null === member.canonical ).differences[ 0 ].kind, 'remove' );
	assert.equal( result.totals.remove, 1 );
} );

test( 'every extracted component is mapped exactly once', () => {
	const { components } = readJson( 'component-map.json' );

	for ( const stack of STACKS ) {
		const extracted = readJson( `api-${ stack }.json` ).components.map( ( component ) => component.name ).sort();
		const mapped = components.flatMap( ( component ) => component[ stack ] ).sort();

		assert.deepEqual( mapped, extracted, stack );
	}
} );

test( 'token map rows carry a valid tier, decision and target', () => {
	const { tokens } = readJson( 'token-map.json' );

	for ( const token of tokens ) {
		assert.ok( [ 'primitive', 'semantic', 'component' ].includes( token.tier ), token.name );
		assert.ok( [ 'keep', 'rename', 'drop' ].includes( token.decision ), token.name );
		assert.equal( 'drop' === token.decision, null === token.target, token.name );
		assert.ok( 'drop' !== token.decision || token.reason, token.name );
	}
} );

test( 'launch exceptions match decision D-003', () => {
	const { components } = readJson( 'component-map.json' );
	const exceptions = components.filter( ( component ) => component.launchException ).map( ( component ) => component.canonical ).sort();

	assert.deepEqual( exceptions, [ 'ImageLibrary', 'RichTextEditor', 'StreamableContent', 'ThemePreview' ] );
} );

test( 'component map uses known waves and unique canonical names', () => {
	const { components } = readJson( 'component-map.json' );
	const waves = new Set( [ 'Pilot', 'Form', 'Navigation', 'Layout', 'Feedback', 'Data Display', 'Utility' ] );

	assert.equal( new Set( components.map( ( component ) => component.canonical ) ).size, components.length );

	for ( const component of components ) {
		assert.ok( waves.has( component.wave ), component.canonical );
	}
} );
