/**
 * TypeScript AST helpers shared by the React and Vue extractors.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';

const NATIVE_BASE = /(HTMLAttributes|HTMLProps|Omit<.*HTMLAttributes|ComponentProps)/;

/** `DaisyColor` is `keyof typeof daisyColorMap`, which cannot be read as a literal union. */
const KNOWN_UNIONS = { DaisyColor: [ 'primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error' ] };

export function parse( fileName, text ) {
	return ts.createSourceFile( fileName, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX );
}

function memberDoc( node ) {
	const comments = ts.getJSDocCommentsAndTags( node ).filter( ts.isJSDoc );
	const comment = comments[ comments.length - 1 ];

	if ( ! comment ) {
		return { doc: null, defaultValue: undefined };
	}

	const text = ts.getTextOfJSDocComment( comment.comment ) ?? '';
	const tag = comment.tags?.find( ( item ) => 'defaultValue' === item.tagName.text );
	const inline = text.match( /@defaultValue\s+`([^`]*)`/ )?.[ 1 ];
	const tagged = tag ? ts.getTextOfJSDocComment( tag.comment )?.replaceAll( '`', '' ).trim() : undefined;

	return {
		doc: text.replace( /@defaultValue[\s\S]*$/, '' ).trim() || null,
		defaultValue: tagged ?? inline,
	};
}

/**
 * Indexes a file's interfaces, type aliases and relative imports.
 *
 * @param {string} path Absolute path to a TS or TSX file.
 * @returns {object} Declarations keyed by name, plus the import map.
 */
export function declarations( path ) {
	const source = parse( path, readFileSync( path, 'utf8' ) );
	const types = new Map();
	const imports = new Map();

	source.forEachChild( ( node ) => {
		if ( ts.isInterfaceDeclaration( node ) || ts.isTypeAliasDeclaration( node ) ) {
			types.set( node.name.text, node );
		}

		if ( ts.isImportDeclaration( node ) && node.importClause?.namedBindings && ts.isNamedImports( node.importClause.namedBindings ) ) {
			for ( const element of node.importClause.namedBindings.elements ) {
				imports.set( element.name.text, node.moduleSpecifier.text );
			}
		}
	} );

	return { path, source, types, imports };
}

function resolveModule( fromPath, specifier ) {
	if ( ! specifier.startsWith( '.' ) ) {
		return null;
	}

	const base = resolve( dirname( fromPath ), specifier );

	return [ `${ base }.ts`, `${ base }.tsx`, `${ base }/index.ts`, base ].find( ( item ) => existsSync( item ) && ! item.endsWith( '.vue' ) ) ?? null;
}

/**
 * Finds a named type, following relative imports and an external fallback index.
 *
 * @param {object} scope Result of declarations().
 * @param {string} name Type name.
 * @param {Map<string, object>} external Types from packages such as @artisanpack-ui/tokens.
 * @returns {{node: object, scope: object}|null} The declaration and the scope it lives in.
 */
export function lookup( scope, name, external = new Map() ) {
	if ( scope.types.has( name ) ) {
		return { node: scope.types.get( name ), scope };
	}

	const module = scope.imports.get( name );

	if ( module ) {
		const path = resolveModule( scope.path, module );

		if ( path ) {
			return lookup( declarations( path ), name, external );
		}
	}

	return external.get( name ) ?? null;
}

/**
 * Expands a type node to string literals when it is a closed string union.
 *
 * @param {object} node Type node.
 * @param {object} scope Declarations scope.
 * @param {Map<string, object>} external External type index.
 * @returns {string[]|null} Literal values, or null when the type is open.
 */
export function literalValues( node, scope, external ) {
	if ( ts.isUnionTypeNode( node ) ) {
		const parts = node.types.map( ( part ) => literalValues( part, scope, external ) );

		return parts.every( Boolean ) ? parts.flat() : null;
	}

	if ( ts.isLiteralTypeNode( node ) && ts.isStringLiteral( node.literal ) ) {
		return [ node.literal.text ];
	}

	if ( ts.isTypeReferenceNode( node ) && ts.isIdentifier( node.typeName ) ) {
		if ( KNOWN_UNIONS[ node.typeName.text ] ) {
			return KNOWN_UNIONS[ node.typeName.text ];
		}

		const found = lookup( scope, node.typeName.text, external );

		if ( found && ts.isTypeAliasDeclaration( found.node ) ) {
			return literalValues( found.node.type, found.scope, external );
		}
	}

	return null;
}

function membersOf( node, scope, external, seen ) {
	if ( ts.isTypeAliasDeclaration( node ) ) {
		return collectType( node.type, scope, external, seen );
	}

	const own = node.members.filter( ts.isPropertySignature ).map( ( member ) => {
		const { doc, defaultValue } = memberDoc( member );

		return {
			name: member.name.getText( scope.source ).replace( /['"]/g, '' ),
			type: member.type?.getText( scope.source ).replace( /\s+/g, ' ' ) ?? null,
			required: ! member.questionToken,
			doc,
			default: defaultValue,
			values: member.type ? literalValues( member.type, scope, external ) : null,
		};
	} );

	const inherited = { members: [], native: [] };

	for ( const clause of node.heritageClauses ?? [] ) {
		for ( const base of clause.types ) {
			const merged = collectType( base, scope, external, seen );

			inherited.members.push( ...merged.members );
			inherited.native.push( ...merged.native );
		}
	}

	const ownNames = new Set( own.map( ( member ) => member.name ) );

	return {
		members: [ ...own, ...inherited.members.filter( ( member ) => ! ownNames.has( member.name ) ) ],
		native: inherited.native,
	};
}

function collectType( node, scope, external, seen ) {
	const text = node.getText( scope.source ).replace( /\s+/g, ' ' );

	if ( ts.isIntersectionTypeNode( node ) ) {
		const parts = node.types.map( ( part ) => collectType( part, scope, external, seen ) );

		return { members: parts.flatMap( ( part ) => part.members ), native: parts.flatMap( ( part ) => part.native ) };
	}

	if ( ts.isTypeLiteralNode( node ) ) {
		return membersOf( node, scope, external, seen );
	}

	const name = ts.isTypeReferenceNode( node ) && ts.isIdentifier( node.typeName )
		? node.typeName.text
		: ts.isExpressionWithTypeArguments( node ) && ts.isIdentifier( node.expression )
			? node.expression.text
			: null;

	if ( 'Omit' === name || 'Pick' === name ) {
		const inner = collectType( node.typeArguments[ 0 ], scope, external, seen );
		const keys = literalValues( node.typeArguments[ 1 ], scope, external ) ?? [];
		const keep = ( member ) => ( 'Omit' === name ? ! keys.includes( member.name ) : keys.includes( member.name ) );

		return { members: inner.members.filter( keep ), native: inner.native };
	}

	if ( name && ! seen.has( name ) ) {
		seen.add( name );

		const found = lookup( scope, name, external );

		if ( found ) {
			return membersOf( found.node, found.scope, external, seen );
		}
	}

	return { members: [], native: NATIVE_BASE.test( text ) ? [ text ] : [] };
}

/**
 * Flattens a named props type, including inherited members.
 *
 * @param {object} scope Declarations scope.
 * @param {string} name Props type name.
 * @param {Map<string, object>} external External type index.
 * @returns {{members: Array<object>, native: string[]}|null} Members and native bases.
 */
export function propsOf( scope, name, external ) {
	const found = lookup( scope, name, external );

	return found ? membersOf( found.node, found.scope, external, new Set( [ name ] ) ) : null;
}

/**
 * Reads relative re-exports from a barrel file.
 *
 * @param {string} path Barrel path.
 * @returns {Array<{name: string, module: string, type: boolean}>} Exports in order.
 */
export function barrelExports( path ) {
	const source = parse( path, readFileSync( path, 'utf8' ) );
	const found = [];

	source.forEachChild( ( node ) => {
		if ( ts.isExportDeclaration( node ) && node.exportClause && ts.isNamedExports( node.exportClause ) && node.moduleSpecifier ) {
			for ( const element of node.exportClause.elements ) {
				found.push( {
					name: element.name.text,
					module: node.moduleSpecifier.text,
					type: node.isTypeOnly || element.isTypeOnly,
				} );
			}
		}
	} );

	return found;
}

export function externalIndex( ...paths ) {
	const index = new Map();

	for ( const path of paths ) {
		const scope = declarations( path );

		for ( const [ name, node ] of scope.types ) {
			index.set( name, { node, scope } );
		}
	}

	return index;
}

export { ts };
