/**
 * Aligns one canonical component's API across stacks and classifies differences
 * as rename, missing, behavioral or remove (the four kinds asked for in #3).
 */

/** Passed through as plain attributes in every stack, so absence is not a gap. */
const NATIVE_ATTRIBUTES = new Set( [
	'accept', 'alt', 'autocomplete', 'autofocus', 'checked', 'class', 'className', 'cols', 'disabled', 'for',
	'form', 'height', 'href', 'id', 'max', 'maxlength', 'maxLength', 'min', 'minlength', 'minLength',
	'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'readOnly', 'rel', 'required', 'rows', 'src',
	'step', 'style', 'target', 'title', 'type', 'value', 'width',
] );

/** Every component gets these from the vocabulary, so a stack lacking one today is not a gap. */
const UNIVERSAL = /^(?:classes(?:\.|$)|ariaLabel$|aria-)/;

/** Livewire binds these through `wire:model`, so no prop or event is expected. */
const LIVEWIRE_BOUND = new Set( [ 'value', 'defaultValue', 'open', 'value-change', 'open-change' ] );

export const STACKS = [ 'livewire', 'react', 'vue' ];

function kebab( name ) {
	return name.replace( /([a-z0-9])([A-Z])/g, '$1-$2' ).toLowerCase();
}

function fullMatch( pattern, value ) {
	return value.match( new RegExp( `^(?:${ pattern })$` ) );
}

/**
 * Finds the alias rule applying to a member.
 *
 * @param {object} aliases Parsed api-aliases.json.
 * @param {string} canonical Canonical component name.
 * @param {string} stack Stack name.
 * @param {string} name Member name in that stack.
 * @returns {{to: string|null, note?: string}|null} The rule, or null when the name stands.
 */
export function resolveAlias( aliases, canonical, stack, name ) {
	const applies = ( rule ) => ! rule.stack || rule.stack === stack;
	const scoped = ( aliases.components[ canonical ] ?? [] ).filter( applies );
	const global = aliases.global.filter( applies );

	for ( const rule of [ ...scoped, ...global ] ) {
		if ( rule.from === name ) {
			return { to: rule.to, note: rule.note, stackOnly: rule.stackOnly, idiom: rule.idiom };
		}

		if ( rule.pattern ) {
			const match = fullMatch( rule.pattern, name );

			if ( match ) {
				return { to: rule.to.replace( '$1', match[ 1 ].charAt( 0 ).toLowerCase() + match[ 1 ].slice( 1 ) ), note: rule.note };
			}
		}
	}

	return null;
}

/**
 * Normalizes an event to its shared kebab-case name.
 *
 * @param {object} aliases Parsed api-aliases.json.
 * @param {string} stack Stack name.
 * @param {string} name Event name in that stack.
 * @returns {string} Canonical event name.
 */
export function canonicalEvent( aliases, stack, name ) {
	const rules = aliases.events.filter( ( rule ) => rule.stack === stack );
	const exact = rules.find( ( rule ) => rule.from === name );

	if ( exact ) {
		return exact.to;
	}

	for ( const rule of rules.filter( ( item ) => item.pattern ) ) {
		const match = fullMatch( rule.pattern, name );

		if ( match ) {
			return rule.to.replace( '$kebab1', match[ 1 ] ? kebab( match[ 1 ].charAt( 0 ).toLowerCase() + match[ 1 ].slice( 1 ) ) : '' );
		}
	}

	return name;
}

/**
 * Reduces PHP and TypeScript type text to a comparable shape.
 *
 * @param {string|null} type Declared type.
 * @param {string[]|null} values Closed literal values.
 * @returns {string|null} One of string, boolean, number, array, object, node, function, mixed.
 */
export function normalizeType( type, values = null ) {
	if ( values ) {
		return 'string';
	}

	if ( ! type ) {
		return null;
	}

	const text = type.replace( /^\?/, '' ).replace( /\s*\|\s*(null|undefined)/g, '' ).trim();

	if ( /ReactNode|ReactElement|VNode/.test( text ) ) {
		return 'node';
	}

	if ( /=>/.test( text ) ) {
		return 'function';
	}

	if ( /\[\]$|^array$|^Array</.test( text ) ) {
		return 'array';
	}

	if ( /^(string)$/.test( text ) ) {
		return 'string';
	}

	if ( /^(bool|boolean)$/.test( text ) ) {
		return 'boolean';
	}

	if ( /^(int|float|number)$/.test( text ) ) {
		return 'number';
	}

	return 'mixed';
}

function isExpected( row, stack ) {
	if ( NATIVE_ATTRIBUTES.has( row.canonical ) || UNIVERSAL.test( row.canonical ) || row.stackOnly ) {
		return false;
	}

	return ! ( 'livewire' === stack && LIVEWIRE_BOUND.has( row.canonical ) );
}

function membersFor( component, stack ) {
	if ( 'livewire' === stack ) {
		const props = component.props.map( ( prop ) => ( {
			group: 'prop',
			kind: component.slots.dual.includes( prop.name ) ? 'prop+slot' : 'prop',
			...prop,
		} ) );
		const propNames = new Set( component.props.map( ( prop ) => prop.name ) );
		const slots = component.slots.named.filter( ( name ) => ! propNames.has( name ) ).map( ( name ) => ( { group: 'prop', kind: 'slot', name } ) );
		const events = component.events.map( ( name ) => ( { group: 'event', kind: 'event', name } ) );

		return [ ...props, ...slots, ...events ];
	}

	if ( 'react' === stack ) {
		return [
			...component.props.map( ( prop ) => ( { group: 'prop', kind: 'prop', ...prop } ) ),
			...component.slots.filter( ( slot ) => 'children' !== slot.name ).map( ( slot ) => ( { group: 'prop', kind: 'slot', ...slot } ) ),
			...component.events.map( ( event ) => ( { group: 'event', kind: 'event', name: event.name, type: event.type } ) ),
		];
	}

	return [
		...component.props.map( ( prop ) => ( { group: 'prop', kind: 'prop', ...prop } ) ),
		...component.slots.named.map( ( name ) => ( { group: 'prop', kind: 'slot', name } ) ),
		...component.events.map( ( event ) => ( { group: 'event', kind: 'event', name: event.name, type: event.payload } ) ),
	];
}

function isDaisyCoupled( member ) {
	const text = `${ member.doc ?? '' } ${ member.type ?? '' } ${ 'string' === typeof member.default ? member.default : '' }`;

	return /daisy|lg:tooltip|\b(?:btn|badge|alert|tab|menu|modal)-[a-z]/i.test( text ) || /(?:Class|Classes|ClassName)$/.test( member.name );
}

function comparableDefault( value ) {
	return null === value || undefined === value || false === value || 'false' === value || 'undefined' === value || 'null' === value || '' === value
		? null
		: String( value ).replace( /^['"]|['"]$/g, '' );
}

function behavioralDifferences( entries ) {
	const differences = [];
	const present = Object.entries( entries );

	if ( present.length < 2 ) {
		return differences;
	}

	const describe = ( pick ) => present.map( ( [ stack, member ] ) => `${ stack }: ${ pick( member ) ?? '—' }` ).join( ', ' );
	const distinct = ( pick ) => new Set( present.map( ( [ , member ] ) => pick( member ) ).filter( ( value ) => null !== value && undefined !== value ) ).size > 1;

	const kind = ( member ) => member.kind;

	if ( distinct( kind ) ) {
		differences.push( { kind: 'behavioral', aspect: 'form', detail: describe( kind ) } );
	}

	const type = ( member ) => normalizeType( member.type, member.values );

	if ( distinct( type ) ) {
		differences.push( { kind: 'behavioral', aspect: 'type', detail: describe( type ) } );
	}

	const values = ( member ) => ( member.values ? [ ...member.values ].sort().join( '|' ) : null );

	if ( distinct( values ) ) {
		differences.push( { kind: 'behavioral', aspect: 'values', detail: describe( values ) } );
	}

	const defaults = ( member ) => comparableDefault( member.default );

	if ( distinct( defaults ) ) {
		differences.push( { kind: 'behavioral', aspect: 'default', detail: describe( defaults ) } );
	}

	return differences;
}

/**
 * Builds the aligned API for one canonical component.
 *
 * @param {object} entry Row from component-map.json.
 * @param {Record<string, Map<string, object>>} indexes Extracted components by stack and name.
 * @param {object} aliases Parsed api-aliases.json.
 * @returns {object} Aligned members and their differences.
 */
export function alignComponent( entry, indexes, aliases ) {
	const stacks = STACKS.filter( ( stack ) => entry[ stack ].length );
	const rows = new Map();

	for ( const stack of stacks ) {
		for ( const name of entry[ stack ] ) {
			for ( const member of membersFor( indexes[ stack ].get( name ), stack ) ) {
				const rule = 'event' === member.group ? null : resolveAlias( aliases, entry.canonical, stack, member.name );
				const removed = null !== rule && null === rule.to;
				const target = 'event' === member.group
					? canonicalEvent( aliases, stack, member.name )
					: ( rule?.to ?? member.name );
				const key = removed ? `removed:${ stack }:${ member.name }` : `${ member.group }:${ target }`;

				if ( ! rows.has( key ) ) {
					rows.set( key, { group: member.group, canonical: removed ? null : target, stacks: {}, sources: {}, notes: {}, stackOnly: false } );
				}

				const row = rows.get( key );

				row.stackOnly ||= Boolean( rule?.stackOnly );

				// Merged members (tooltipLeft → tooltip) keep the plain-named one for comparison.
				if ( ! row.stacks[ stack ] || member.name === target ) {
					row.stacks[ stack ] = member;
				}

				if ( ! rule?.idiom ) {
					( row.sources[ stack ] ??= [] ).push( { component: name, name: member.name } );
				}

				if ( rule?.note ) {
					row.notes[ stack ] = rule.note;
				}
			}
		}
	}

	const members = [ ...rows.values() ].map( ( row ) => {
		const differences = [];

		for ( const [ stack, sources ] of Object.entries( row.sources ) ) {
			for ( const source of sources ) {
				if ( null === row.canonical ) {
					differences.push( { kind: 'remove', stack, from: source.name, note: row.notes[ stack ] } );
				} else if ( source.name !== row.canonical && 'event' !== row.group ) {
					differences.push( { kind: 'rename', stack, from: source.name, to: row.canonical, note: row.notes[ stack ] } );
				} else if ( source.name !== row.canonical ) {
					differences.push( { kind: 'rename', stack, from: source.name, to: row.canonical } );
				}
			}
		}

		if ( null !== row.canonical && stacks.length > 1 ) {
			for ( const stack of stacks ) {
				if ( ! row.stacks[ stack ] && isExpected( row, stack ) ) {
					differences.push( { kind: 'missing', stack } );
				}
			}

			differences.push( ...behavioralDifferences( row.stacks ) );
		}

		return {
			group: row.group,
			canonical: row.canonical,
			current: Object.fromEntries( Object.entries( row.stacks ).map( ( [ stack, member ] ) => [ stack, {
				name: member.name,
				kind: member.kind,
				type: member.type ?? null,
				default: member.default ?? null,
				values: member.values ?? null,
			} ] ) ),
			daisyCoupled: Object.values( row.stacks ).some( isDaisyCoupled ),
			differences,
		};
	} );

	return {
		canonical: entry.canonical,
		wave: entry.wave,
		stacks,
		members,
		totals: tally( members ),
	};
}

export function tally( members ) {
	const totals = { members: members.length, rename: 0, missing: 0, behavioral: 0, remove: 0, daisyCoupled: 0 };

	for ( const member of members ) {
		totals.daisyCoupled += member.daisyCoupled ? 1 : 0;

		for ( const difference of member.differences ) {
			totals[ difference.kind ]++;
		}
	}

	return totals;
}

/**
 * Classifies one downstream attribute for the codemod report.
 *
 * @param {object} aliases Parsed api-aliases.json.
 * @param {string} canonical Canonical component name.
 * @param {string} stack Stack name.
 * @param {string} attribute Attribute name as used.
 * @returns {'unchanged'|'rename'|'remove'} What happens to the attribute.
 */
export function attributeOutcome( aliases, canonical, stack, attribute ) {
	const rule = resolveAlias( aliases, canonical, stack, attribute );

	if ( ! rule ) {
		return 'unchanged';
	}

	if ( null === rule.to ) {
		return 'remove';
	}

	return rule.idiom || rule.to === attribute ? 'unchanged' : 'rename';
}
