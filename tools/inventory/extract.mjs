/**
 * Extracts the current public API of every component in all three stacks into
 * docs/inventory/data/api-{livewire,react,vue}.json.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { mergeTallies, tallyClasses, tallyPhpStrings } from './lib/daisy.mjs';
import { assertPackage, packageCommit, writeJson } from './lib/paths.mjs';
import { constructorParams, registryEntries } from './lib/php.mjs';
import { barrelExports, declarations, externalIndex, parse, propsOf, ts } from './lib/typescript.mjs';

/** Blade attribute names that are framework plumbing, not component API. */
const BLADE_SLOT_BLOCKLIST = new Set( [ 'attributes', 'slot', 'errors', 'loop', 'component', 'this' ] );

function bladeSlots( blade, props ) {
	const named = new Set();

	for ( const match of blade.matchAll( /\$(\w+)->(?:attributes|isNotEmpty\(\)|isEmpty\(\)|hasActualContent\(\)|toHtml\(\))/g ) ) {
		if ( ! BLADE_SLOT_BLOCKLIST.has( match[ 1 ] ) ) {
			named.add( match[ 1 ] );
		}
	}

	return {
		default: /\$slot\b/.test( blade ),
		// A prop that is also read as a slot object accepts either form.
		named: [ ...named ].sort(),
		dual: [ ...named ].filter( ( name ) => props.has( name ) ).sort(),
	};
}

function browserEvents( source ) {
	const events = new Set();
	const patterns = [
		/\$dispatch\(\s*['"]([\w:.-]+)['"]/g,
		/\$this->dispatch\(\s*['"]([\w:.-]+)['"]/g,
		/new\s+CustomEvent\(\s*['"]([\w:.-]+)['"]/g,
	];

	for ( const pattern of patterns ) {
		for ( const match of source.matchAll( pattern ) ) {
			events.add( match[ 1 ] );
		}
	}

	return [ ...events ].sort();
}

function extractLivewire() {
	const root = assertPackage( 'livewire-ui-components' );
	const provider = readFileSync( join( root, 'src/LivewireUiComponentsServiceProvider.php' ), 'utf8' );
	const registered = [
		...registryEntries( provider, 'bladeComponents' ).map( ( entry ) => ( { ...entry, registry: 'blade' } ) ),
		...registryEntries( provider, 'livewireComponents' ).map( ( entry ) => ( { ...entry, registry: 'livewire' } ) ),
	];

	const components = registered.map( ( { tag, className, registry } ) => {
		const path = join( root, 'src/View/Components', `${ className }.php` );
		const php = readFileSync( path, 'utf8' );
		const viewName = php.match( /view\(\s*['"]livewire-ui-components::([\w.-]+)['"]/ )?.[ 1 ];
		const viewPath = viewName ? join( root, 'resources/views', `${ viewName.replaceAll( '.', '/' ) }.blade.php` ) : null;
		const blade = viewPath && existsSync( viewPath ) ? readFileSync( viewPath, 'utf8' ) : '';
		const params = constructorParams( php );

		return {
			tag: `x-artisanpack-${ tag }`,
			name: tag,
			className,
			registry,
			view: viewName ?? null,
			props: params,
			slots: bladeSlots( blade, new Set( params.map( ( param ) => param.name ) ) ),
			events: browserEvents( `${ php }\n${ blade }` ),
			wireModel: /wire:model|wireModel|modelName\(\)/.test( blade ),
			daisy: mergeTallies(
				tallyClasses( blade ),
				tallyPhpStrings( [ ...blade.matchAll( /@php([\s\S]*?)@endphp/g ) ].map( ( match ) => match[ 1 ] ).join( '\n' ) ),
				tallyPhpStrings( php ),
			),
		};
	} );

	return { stack: 'livewire', commit: packageCommit( 'livewire-ui-components' ), components };
}

/** Reads `{ a = 1, b = 'x' }` defaults from the first destructured parameter. */
function destructuredDefaults( source, name ) {
	const defaults = {};
	let found = false;

	function visit( node ) {
		if ( found ) {
			return;
		}

		const isTarget = ( ts.isVariableDeclaration( node ) || ts.isFunctionDeclaration( node ) )
			&& node.name?.getText( source ) === name;

		if ( isTarget ) {
			( function findPattern( child ) {
				if ( found ) {
					return;
				}

				if ( ts.isParameter( child ) && ts.isObjectBindingPattern( child.name ) ) {
					found = true;

					for ( const element of child.name.elements ) {
						const key = ( element.propertyName ?? element.name ).getText( source );

						defaults[ key ] = element.initializer ? element.initializer.getText( source ).replace( /^['"]|['"]$/g, '' ) : undefined;
					}

					return;
				}

				ts.forEachChild( child, findPattern );
			}( node ) );
		}

		ts.forEachChild( node, visit );
	}

	visit( source );

	return found ? defaults : null;
}

function classifyReactMember( member ) {
	if ( /^on[A-Z]/.test( member.name ) ) {
		return 'event';
	}

	return /\bReactNode\b|\bReactElement\b/.test( member.type ?? '' ) ? 'slot' : 'prop';
}

function extractReact() {
	const root = assertPackage( 'react' );
	const src = join( root, 'packages/react/src/components' );
	const external = externalIndex( join( root, 'packages/tokens/src/types.ts' ), join( root, 'packages/tokens/src/colors.ts' ) );
	const categories = [ 'form', 'layout', 'navigation', 'data', 'feedback', 'utility' ];
	const components = [];

	for ( const category of categories ) {
		const barrel = join( src, category, 'index.ts' );

		for ( const item of barrelExports( barrel ).filter( ( entry ) => ! entry.type && /^[A-Z]/.test( entry.name ) ) ) {
			const file = `${ resolve( dirname( barrel ), item.module ) }.tsx`;
			const scope = declarations( file );
			const props = propsOf( scope, `${ item.name }Props`, external );
			const defaults = destructuredDefaults( scope.source, item.name ) ?? {};
			const members = ( props?.members ?? [] ).map( ( member ) => ( {
				...member,
				default: member.default ?? defaults[ member.name ],
				kind: classifyReactMember( member ),
			} ) );

			components.push( {
				name: item.name,
				category,
				file: file.slice( root.length + 1 ),
				nativeBase: props?.native ?? [],
				props: members.filter( ( member ) => 'prop' === member.kind ),
				slots: members.filter( ( member ) => 'slot' === member.kind ),
				events: members.filter( ( member ) => 'event' === member.kind ),
				children: 'children' in defaults,
				daisy: tallyClasses( readFileSync( file, 'utf8' ) ),
			} );
		}
	}

	return { stack: 'react', commit: packageCommit( 'react' ), components };
}

function vueEmits( script, source ) {
	const events = [];

	( function visit( node ) {
		if ( ts.isCallExpression( node ) && 'defineEmits' === node.expression.getText( source ) && node.typeArguments?.[ 0 ] ) {
			const type = node.typeArguments[ 0 ];

			for ( const member of type.members ?? [] ) {
				if ( ts.isCallSignatureDeclaration( member ) ) {
					const literal = member.parameters[ 0 ]?.type;
					const names = literal && ts.isUnionTypeNode( literal ) ? literal.types : [ literal ];

					for ( const name of names ) {
						events.push( {
							name: name?.getText( source ).replace( /['"]/g, '' ),
							payload: member.parameters.slice( 1 ).map( ( parameter ) => parameter.getText( source ) ).join( ', ' ),
						} );
					}
				} else if ( ts.isPropertySignature( member ) ) {
					events.push( {
						name: member.name.getText( source ).replace( /['"]/g, '' ),
						payload: member.type?.getText( source ) ?? '',
					} );
				}
			}
		}

		ts.forEachChild( node, visit );
	}( source ) );

	return events;
}

function vueDefaults( source ) {
	const defaults = {};

	( function visit( node ) {
		if ( ts.isCallExpression( node ) && 'withDefaults' === node.expression.getText( source ) ) {
			const object = node.arguments[ 1 ];

			for ( const property of object?.properties ?? [] ) {
				if ( ts.isPropertyAssignment( property ) ) {
					defaults[ property.name.getText( source ).replace( /['"]/g, '' ) ] = property.initializer.getText( source ).replace( /^['"]|['"]$/g, '' );
				}
			}
		}

		ts.forEachChild( node, visit );
	}( source ) );

	return defaults;
}

function extractVue() {
	const root = assertPackage( 'vue' );
	const src = join( root, 'packages/vue/src/components' );
	const external = externalIndex(
		join( assertPackage( 'react' ), 'packages/tokens/src/types.ts' ),
		join( assertPackage( 'react' ), 'packages/tokens/src/colors.ts' ),
	);
	const categories = [ 'form', 'layout', 'navigation', 'display', 'data', 'feedback', 'utility' ];
	const components = [];

	for ( const category of categories ) {
		const barrel = join( src, category, 'index.ts' );

		for ( const item of barrelExports( barrel ).filter( ( entry ) => ! entry.type && entry.module.endsWith( '.vue' ) ) ) {
			const file = resolve( dirname( barrel ), item.module );
			const sfc = readFileSync( file, 'utf8' );
			const script = sfc.match( /<script[^>]*setup[^>]*>([\s\S]*?)<\/script>/ )?.[ 1 ] ?? '';
			const template = sfc.match( /<template>([\s\S]*)<\/template>/ )?.[ 1 ] ?? '';
			const source = parse( 'sfc.ts', script );
			const propsType = script.match( /defineProps<\s*(\w+)\s*>/ )?.[ 1 ];
			const typesPath = join( dirname( file ), 'types.ts' );
			const scope = declarations( existsSync( typesPath ) ? typesPath : barrel );
			const props = propsType ? propsOf( scope, propsType, external ) : null;
			const defaults = vueDefaults( source );
			const namedSlots = [ ...template.matchAll( /<slot\b[^>]*\bname="([\w-]+)"/g ) ].map( ( match ) => match[ 1 ] );
			const models = [ ...script.matchAll( /defineModel(?:<[^>]*>)?\(\s*(?:['"]([\w-]+)['"])?/g ) ].map( ( match ) => match[ 1 ] ?? 'modelValue' );

			components.push( {
				name: item.name,
				category,
				file: file.slice( root.length + 1 ),
				props: ( props?.members ?? [] ).map( ( member ) => ( { ...member, default: member.default ?? defaults[ member.name ] } ) ),
				slots: {
					default: /<slot\b(?![^>]*\bname=)/.test( template ),
					named: [ ...new Set( namedSlots ) ].sort(),
				},
				events: vueEmits( script, source ),
				models,
				daisy: tallyClasses( sfc ),
			} );
		}
	}

	return { stack: 'vue', commit: packageCommit( 'vue' ), components };
}

for ( const [ file, extractor ] of [
	[ 'api-livewire.json', extractLivewire ],
	[ 'api-react.json', extractReact ],
	[ 'api-vue.json', extractVue ],
] ) {
	const result = extractor();

	writeJson( file, result );
	console.log( `${ result.stack }: ${ result.components.length } components @ ${ result.commit }` );
}
