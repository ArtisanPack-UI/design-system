/**
 * DaisyUI detection used by both the Livewire extractor and the downstream scan.
 *
 * Classes are only ever matched inside class attributes (see classTokens), never
 * in free text, because many DaisyUI names are ordinary English words.
 */

/** Component roots whose bare name and `root-*` modifiers are DaisyUI-only. */
const HIGH_CONFIDENCE_ROOTS = [
	'alert', 'avatar', 'badge', 'breadcrumbs', 'btn', 'card', 'carousel', 'chat', 'checkbox',
	'countdown', 'divider', 'dock', 'drawer', 'dropdown', 'fieldset', 'file-input', 'indicator',
	'join', 'kbd', 'loading', 'mask', 'mockup', 'modal', 'navbar', 'progress', 'radial-progress',
	'radio', 'rating', 'skeleton', 'stat', 'stats', 'steps', 'step', 'swap', 'tab', 'tabs',
	'textarea', 'timeline', 'toast', 'toggle', 'tooltip', 'validator',
];

/**
 * Names that are also Tailwind utilities, HTML-ish hook classes, or common custom
 * class names. Reported separately so the upgrade command warns instead of rewrites.
 */
const AMBIGUOUS_ROOTS = [
	'collapse', 'diff', 'filter', 'footer', 'hero', 'input', 'label', 'link', 'list', 'menu',
	'range', 'select', 'stack', 'status', 'table',
];

/** Tailwind utilities that merely share a prefix with an ambiguous root. */
const TAILWIND_LOOKALIKES = /^(table-(auto|fixed|caption|cell|column|footer-group|header-group|row|row-group)|list-(none|disc|decimal|inside|outside|image-none)|select-(none|text|all|auto)|filter-none|stack-trace|footer-.*)$/;

const STATEFUL_VARIANT = /^(?:[a-z0-9-]+:)*!?/;

const SEMANTIC_NAMES = 'primary|secondary|accent|neutral|info|success|warning|error';

/** `bg-base-200`, `text-base-content/60`, `border-base-300`, … have no token equivalent yet. */
const THEME_BASE_UTILITY = /^(?:bg|text|border|ring|outline|divide|fill|stroke|from|via|to|shadow|placeholder|decoration|accent|caret)-base-(?:100|200|300|content)(?:\/\d+)?$/;

/** `text-primary-content` is a DaisyUI-only pairing. */
const THEME_CONTENT_UTILITY = new RegExp( `^(?:bg|text|border|ring|outline|fill|stroke)-(?:${ SEMANTIC_NAMES })-content(?:/\\d+)?$` );

/** `bg-primary` survives via the optional Tailwind preset, so it is low priority. */
const THEME_SEMANTIC_UTILITY = new RegExp( `^(?:bg|text|border|ring|outline|fill|stroke|divide)-(?:${ SEMANTIC_NAMES })(?:/\\d+)?$` );

const THEME_VARIABLE = new RegExp(
	[
		`--color-(?:base-(?:100|200|300|content)|(?:${ SEMANTIC_NAMES })(?:-content)?)`,
		'--radius-(?:selector|field|box)',
		'--size-(?:selector|field)',
		'--(?:noise|depth|border-btn|tab-radius|rounded-(?:box|btn|badge)|animation-btn|animation-input|btn-focus-scale)',
		'var\\(--(?:b[123]|bc|pc?|sc?|ac?|nc?|in|su|wa|er)\\)',
	].join( '|' ),
	'g',
);

const CONFIG_REFERENCE = /@plugin\s+["']daisyui(?:\/theme)?["']|["']daisyui["']\s*:|require\(\s*["']daisyui["']\s*\)|\bdata-theme\s*=/g;

function matchesRoot( name, roots ) {
	return roots.some( ( root ) => name === root || name.startsWith( `${ root }-` ) );
}

/**
 * Classifies a single class token.
 *
 * @param {string} token Class name, possibly with Tailwind variants (`hover:btn-sm`).
 * @returns {null|{kind: string, name: string}} Classification, or null when not DaisyUI.
 */
export function classifyClass( token ) {
	const name = token.replace( STATEFUL_VARIANT, '' );

	if ( ! /^[a-z][a-z0-9/-]*$/.test( name ) ) {
		return null;
	}

	if ( THEME_BASE_UTILITY.test( name ) ) {
		return { kind: 'themeBase', name };
	}

	if ( THEME_CONTENT_UTILITY.test( name ) ) {
		return { kind: 'themeContent', name };
	}

	if ( THEME_SEMANTIC_UTILITY.test( name ) ) {
		return { kind: 'themeSemantic', name };
	}

	if ( matchesRoot( name, HIGH_CONFIDENCE_ROOTS ) ) {
		return { kind: 'component', name };
	}

	if ( matchesRoot( name, AMBIGUOUS_ROOTS ) && ! TAILWIND_LOOKALIKES.test( name ) ) {
		return { kind: 'ambiguous', name };
	}

	return null;
}

const CLASS_ATTRIBUTE = /(?:^|[\s<"'(])(?::class|x-bind:class|class|className)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*(?:`([^`]*)`|"([^"]*)"|'([^']*)')\s*\})/g;

const CLASS_DIRECTIVE = /@class\(\s*\[([\s\S]*?)\]\s*\)/g;

const CLASS_HELPER = /\b(?:cn|clsx|classNames|twMerge)\(([^;]*?)\)/g;

/** Rejects fragments of Blade/PHP/JS expressions that survive attribute splitting. */
function cleanToken( raw ) {
	return raw.replace( /^[\[\]{}()'"`,:?!=>]+|[\[\]{}()'"`,:?=>;]+$/g, '' );
}

/**
 * Yields every class token found in class attributes of Blade, JSX, Vue or HTML.
 *
 * @param {string} source File contents.
 * @returns {string[]} Class tokens, one entry per occurrence.
 */
export function classTokens( source ) {
	const tokens = [];

	for ( const match of source.matchAll( CLASS_ATTRIBUTE ) ) {
		const value = match.slice( 1 ).find( ( group ) => undefined !== group ) ?? '';

		tokens.push( ...value.split( /\s+/ ).map( cleanToken ) );
	}

	for ( const pattern of [ CLASS_DIRECTIVE, CLASS_HELPER ] ) {
		for ( const match of source.matchAll( pattern ) ) {
			for ( const literal of match[ 1 ].matchAll( /'([^']*)'|"([^"]*)"|`([^`]*)`/g ) ) {
				const value = literal[ 1 ] ?? literal[ 2 ] ?? literal[ 3 ] ?? '';

				tokens.push( ...value.split( /\s+/ ).map( cleanToken ) );
			}
		}
	}

	return tokens.filter( Boolean );
}

/**
 * Tallies classes assembled in PHP: `@php` blocks and component classes build
 * class lists as single-quoted strings, which class attributes never show.
 * Ambiguous names are skipped because PHP strings are not known to be classes.
 *
 * @param {string} source Blade or PHP source.
 * @returns {Record<string, Record<string, number>>} Counts keyed by kind then class name.
 */
export function tallyPhpStrings( source ) {
	const tally = {};
	const code = source.replace( /\/\*[\s\S]*?\*\//g, '' );

	for ( const literal of code.matchAll( /'([^'\n]*)'/g ) ) {
		for ( const token of literal[ 1 ].split( /\s+/ ) ) {
			const hit = classifyClass( token );

			if ( hit && 'ambiguous' !== hit.kind ) {
				tally[ hit.kind ] ??= {};
				tally[ hit.kind ][ hit.name ] = ( tally[ hit.kind ][ hit.name ] ?? 0 ) + 1;
			}
		}
	}

	return tally;
}

/** Merges tallies, keeping the larger count so one literal is never counted twice. */
export function mergeTallies( ...tallies ) {
	const merged = {};

	for ( const tally of tallies ) {
		for ( const [ kind, names ] of Object.entries( tally ) ) {
			merged[ kind ] ??= {};

			for ( const [ name, count ] of Object.entries( names ) ) {
				merged[ kind ][ name ] = Math.max( merged[ kind ][ name ] ?? 0, count );
			}
		}
	}

	return merged;
}

export function themeVariables( source ) {
	return source.match( THEME_VARIABLE ) ?? [];
}

export function configReferences( source ) {
	return source.match( CONFIG_REFERENCE ) ?? [];
}

/**
 * Tallies DaisyUI usage in one file.
 *
 * @param {string} source File contents.
 * @returns {Record<string, Record<string, number>>} Counts keyed by kind then class name.
 */
export function tallyClasses( source ) {
	const tally = {};

	for ( const token of classTokens( source ) ) {
		const hit = classifyClass( token );

		if ( hit ) {
			tally[ hit.kind ] ??= {};
			tally[ hit.kind ][ hit.name ] = ( tally[ hit.kind ][ hit.name ] ?? 0 ) + 1;
		}
	}

	return tally;
}
