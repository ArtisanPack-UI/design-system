/**
 * Minimal PHP source readers. The Livewire package's constructors are the public
 * API of each Blade component, so promoted parameters are all that needs parsing.
 */

/**
 * Finds the index of the bracket closing the one at `open`, skipping strings.
 *
 * @param {string} source Source text.
 * @param {number} open Index of the opening bracket.
 * @returns {number} Index of the closing bracket, or -1.
 */
export function closingIndex( source, open ) {
	const pairs = { '(': ')', '[': ']', '{': '}' };
	const stack = [];
	let quote = null;

	for ( let index = open; index < source.length; index++ ) {
		const char = source[ index ];

		if ( quote ) {
			if ( '\\' === char ) {
				index++;
			} else if ( char === quote ) {
				quote = null;
			}
			continue;
		}

		if ( '\'' === char || '"' === char ) {
			quote = char;
		} else if ( pairs[ char ] ) {
			stack.push( pairs[ char ] );
		} else if ( char === stack[ stack.length - 1 ] ) {
			stack.pop();

			if ( 0 === stack.length ) {
				return index;
			}
		}
	}

	return -1;
}

/**
 * Splits a parameter list on its top-level commas.
 *
 * @param {string} list Text between the constructor parentheses.
 * @returns {string[]} One trimmed string per parameter.
 */
export function splitTopLevel( list ) {
	const parts = [];
	let depth = 0;
	let quote = null;
	let current = '';

	for ( let index = 0; index < list.length; index++ ) {
		const char = list[ index ];

		if ( quote ) {
			current += char;

			if ( '\\' === char ) {
				current += list[ ++index ];
			} else if ( char === quote ) {
				quote = null;
			}
			continue;
		}

		if ( '\'' === char || '"' === char ) {
			quote = char;
		} else if ( '([{'.includes( char ) ) {
			depth++;
		} else if ( ')]}'.includes( char ) ) {
			depth--;
		}

		if ( ',' === char && 0 === depth ) {
			parts.push( current );
			current = '';
		} else {
			current += char;
		}
	}

	parts.push( current );

	return parts.map( ( part ) => part.replace( /\/\/.*$/gm, '' ).trim() ).filter( Boolean );
}

function parseDefault( raw ) {
	if ( undefined === raw ) {
		return undefined;
	}

	const value = raw.trim();

	if ( 'null' === value ) {
		return null;
	}

	if ( 'true' === value || 'false' === value ) {
		return 'true' === value;
	}

	if ( /^-?\d+(\.\d+)?$/.test( value ) ) {
		return Number( value );
	}

	const quoted = value.match( /^'(.*)'$|^"(.*)"$/s );

	return quoted ? ( quoted[ 1 ] ?? quoted[ 2 ] ) : value;
}

/**
 * Reads constructor parameters, descriptions and enumerated values.
 *
 * @param {string} source PHP class source.
 * @returns {Array<object>} Parameters in declaration order.
 */
export function constructorParams( source ) {
	const start = source.indexOf( 'function __construct' );

	if ( -1 === start ) {
		return [];
	}

	const open = source.indexOf( '(', start );
	const close = closingIndex( source, open );
	const docblock = source.slice( 0, start ).match( /\/\*\*(?:(?!\*\/)[\s\S])*\*\/\s*(?:public\s+)?$/ )?.[ 0 ] ?? '';

	return splitTopLevel( source.slice( open + 1, close ) ).flatMap( ( parameter ) => {
		const match = parameter.match(
			/^(?:#\[[^\]]*\]\s*)?((?:public|protected|private)\s+)?(?:readonly\s+)?([?\w\\|]+\s+)?(?:\.\.\.)?\$(\w+)(?:\s*=\s*([\s\S]*))?$/,
		);

		if ( ! match ) {
			return [];
		}

		const name = match[ 3 ];
		const doc = docblock.match( new RegExp( `@param\\s+\\S+\\s+\\$${ name }\\s+(.*)` ) )?.[ 1 ]?.trim() ?? null;
		const listed = doc?.match( /\(([a-z0-9-]+(?:,\s*[a-z0-9-]+)+)\)/i )?.[ 1 ];

		return [ {
			name,
			type: match[ 2 ]?.trim() ?? null,
			default: parseDefault( match[ 4 ] ),
			doc,
			values: listed ? listed.split( /,\s*/ ) : null,
		} ];
	} );
}

/**
 * Parses a `'tag' => View\Components\Class::class` registry array.
 *
 * @param {string} source Service provider source.
 * @param {string} property Array property name.
 * @returns {Array<{tag: string, className: string}>} Registered components.
 */
export function registryEntries( source, property ) {
	const start = source.indexOf( `$${ property } = [` );
	const open = source.indexOf( '[', start );
	const body = source.slice( open, closingIndex( source, open ) );

	return [ ...body.matchAll( /'([\w-]+)'\s*=>\s*View\\Components\\(\w+)::class/g ) ]
		.map( ( [ , tag, className ] ) => ( { tag, className } ) );
}
