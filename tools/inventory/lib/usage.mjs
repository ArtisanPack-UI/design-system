/**
 * Finds component usages and the attributes passed to them.
 */
import { closingIndex } from './php.mjs';

/** Directive attributes that carry through unchanged and are not component API. */
const PASSTHROUGH_ATTRIBUTE = /^(?:wire:|x-|@|:?class$|:?style$|:?key$|ref$|v-if$|v-else|v-for$|v-show$|data-|aria-)/;

/**
 * Reads the attribute names of a tag whose name ends at `start`.
 *
 * @param {string} source File contents.
 * @param {number} start Index just past the tag name.
 * @returns {string[]} Attribute names with Blade/Vue binding prefixes removed.
 */
export function tagAttributes( source, start ) {
	const names = [];
	let index = start;

	while ( index < source.length ) {
		const char = source[ index ];

		if ( '>' === char ) {
			break;
		}

		if ( '/' === char && '>' === source[ index + 1 ] ) {
			break;
		}

		if ( '{' === char ) {
			const close = closingIndex( source, index );

			index = -1 === close ? index + 1 : close + 1;
			continue;
		}

		const attribute = source.slice( index ).match( /^[^\s=>/{]+/ );

		if ( ! attribute ) {
			index++;
			continue;
		}

		index += attribute[ 0 ].length;

		const value = source.slice( index ).match( /^\s*=\s*/ );

		if ( value ) {
			index += value[ 0 ].length;

			const quote = source[ index ];

			if ( '"' === quote || '\'' === quote ) {
				const end = source.indexOf( quote, index + 1 );

				index = -1 === end ? source.length : end + 1;
			} else if ( '{' === quote ) {
				const close = closingIndex( source, index );

				index = -1 === close ? index + 1 : close + 1;
			}
		}

		names.push( attribute[ 0 ] );
	}

	return names;
}

function publicAttributes( names ) {
	return names
		.filter( ( name ) => ! PASSTHROUGH_ATTRIBUTE.test( name ) )
		.map( ( name ) => name.replace( /^(?:v-bind)?:+/, '' ) );
}

function camel( name ) {
	if ( name.startsWith( 'v-model' ) ) {
		return name;
	}

	return name.replace( /-([a-z])/g, ( _, letter ) => letter.toUpperCase() );
}

/**
 * Finds `<x-artisanpack-*>` tags.
 *
 * @param {string} source Blade source.
 * @returns {Array<{name: string, attributes: string[]}>} One entry per tag.
 */
export function parseBladeTags( source ) {
	return [ ...source.matchAll( /<x-artisanpack-([a-z][a-z0-9-]*)/g ) ].map( ( match ) => ( {
		name: match[ 1 ],
		attributes: publicAttributes( tagAttributes( source, match.index + match[ 0 ].length ) ).map( camel ),
	} ) );
}

function importedNames( source, packagePattern ) {
	const names = new Map();

	for ( const match of source.matchAll( /import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+['"]([^'"]+)['"]/g ) ) {
		if ( match[ 0 ].startsWith( 'import type' ) || ! packagePattern.test( match[ 2 ] ) ) {
			continue;
		}

		for ( const part of match[ 1 ].split( ',' ) ) {
			const [ imported, local ] = part.trim().split( /\s+as\s+/ );

			if ( /^[A-Z]/.test( imported ?? '' ) ) {
				names.set( local ?? imported, imported );
			}
		}
	}

	return names;
}

function componentUsages( source, names ) {
	const usages = [];

	for ( const [ local, imported ] of names ) {
		for ( const match of source.matchAll( new RegExp( `<${ local }(?=[\\s/>])`, 'g' ) ) ) {
			usages.push( {
				name: imported,
				attributes: publicAttributes( tagAttributes( source, match.index + match[ 0 ].length ) ).map( camel ),
			} );
		}
	}

	return usages;
}

export function jsxUsages( source ) {
	return componentUsages( source, importedNames( source, /^@artisanpack-ui\/react(\/|$)/ ) );
}

export function parseVueUsages( source ) {
	return componentUsages( source, importedNames( source, /^@artisanpack-ui\/vue(\/|$)/ ) );
}
