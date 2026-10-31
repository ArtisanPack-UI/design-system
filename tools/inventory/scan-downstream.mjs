/**
 * Measures how much of the downstream ecosystem the migration touches and writes
 * docs/inventory/data/downstream-usage.json. Every package directory beside this
 * repo is scanned, so consumers missing from the plan's list are still found.
 */
import { execFileSync, execSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, relative } from 'node:path';
import { configReferences, tallyClasses, themeVariables } from './lib/daisy.mjs';
import { jsxUsages, parseBladeTags, parseVueUsages } from './lib/usage.mjs';
import { packageCommit, packagesDir, readJson, writeJson } from './lib/paths.mjs';

/** The component libraries themselves are rewritten, not migrated. */
const LIBRARIES = new Set( [ 'livewire-ui-components', 'react', 'vue', 'design-system', 'specification', 'node_modules' ] );

const IGNORED_DIRS = new Set( [ 'node_modules', 'vendor', 'dist', 'build', 'public', 'storage', 'bootstrap', '.git', '.idea', 'coverage', 'tests', '__tests__', 'docs', '.ai', '.claude', '.junie' ] );

const SCANNED_EXTENSIONS = new Set( [ '.php', '.css', '.scss', '.js', '.jsx', '.ts', '.tsx', '.vue', '.json' ] );

/** Packages register their own `x-artisanpack-ec-*` tags under the same prefix. */
const libraryTags = new Set( readJson( 'api-livewire.json' ).components.map( ( component ) => component.name ) );

function* walk( dir ) {
	for ( const entry of readdirSync( dir ) ) {
		const path = join( dir, entry );

		if ( statSync( path ).isDirectory() ) {
			if ( ! IGNORED_DIRS.has( entry ) ) {
				yield* walk( path );
			}
		} else if ( SCANNED_EXTENSIONS.has( extname( entry ) ) && ! /(^|\.)(lock|min\.(js|css))$|package-lock\.json$/.test( entry ) ) {
			yield path;
		}
	}
}

function addCounts( target, source ) {
	for ( const [ kind, names ] of Object.entries( source ) ) {
		target[ kind ] ??= {};

		for ( const [ name, count ] of Object.entries( names ) ) {
			target[ kind ][ name ] = ( target[ kind ][ name ] ?? 0 ) + count;
		}
	}
}

function bump( map, key, by = 1 ) {
	map[ key ] = ( map[ key ] ?? 0 ) + by;
}

function recordUsage( usage, { name, attributes } ) {
	usage[ name ] ??= { count: 0, attributes: {} };
	usage[ name ].count++;

	for ( const attribute of attributes ) {
		bump( usage[ name ].attributes, attribute );
	}
}

function git( dir, ...args ) {
	try {
		return execFileSync( 'git', [ '-C', dir, ...args ], { encoding: 'utf8', stdio: [ 'ignore', 'pipe', 'ignore' ], maxBuffer: 1 << 28 } ).trim();
	} catch {
		return '';
	}
}

function uiFileCount( listing ) {
	return listing.split( '\n' ).filter( ( file ) => /\.blade\.php$|\.tsx$|\.vue$/.test( file ) ).length;
}

/**
 * Picks what to scan. Checkouts sit on assorted release and feature branches, and
 * some of those hold less UI than origin/main. Taking the fuller ref keeps a stale
 * branch from reading as "no migration needed". Nothing in the checkout is touched.
 *
 * @param {string} dir Package directory.
 * @returns {{root: string, ref: string, cleanup: Function}} Directory to scan and its ref.
 */
function scanTarget( dir ) {
	const branch = git( dir, 'branch', '--show-current' ) || 'detached';
	const here = { root: dir, ref: branch, cleanup: () => {} };

	if ( 'main' === branch || 'master' === branch ) {
		return here;
	}

	if ( uiFileCount( git( dir, 'ls-tree', '-r', '--name-only', 'origin/main' ) ) <= uiFileCount( git( dir, 'ls-files' ) ) ) {
		return here;
	}

	const root = mkdtempSync( join( tmpdir(), 'ap-inventory-' ) );

	execSync( `git -C "${ dir }" archive origin/main | tar -x -C "${ root }"` );

	return { root, ref: 'origin/main', cleanup: () => rmSync( root, { recursive: true, force: true } ) };
}

function scanPackage( name ) {
	const { root, ref, cleanup } = scanTarget( join( packagesDir, name ) );
	const result = {
		name,
		ref,
		commit: 'origin/main' === ref ? git( join( packagesDir, name ), 'rev-parse', '--short', 'origin/main' ) : packageCommit( name ),
		filesScanned: 0,
		bladeFiles: 0,
		jsFiles: 0,
		blade: {},
		packageOwnedTags: {},
		react: {},
		vue: {},
		daisyClasses: {},
		daisyFiles: new Set(),
		themeVariables: {},
		config: {},
		dependsOn: [],
	};

	const manifests = [ 'package.json', 'composer.json' ].filter( ( file ) => existsSync( join( root, file ) ) );

	for ( const file of manifests ) {
		const text = readFileSync( join( root, file ), 'utf8' );

		for ( const dependency of [ 'daisyui', '@artisanpack-ui/react', '@artisanpack-ui/vue', '@artisanpack-ui/tokens', 'artisanpack-ui/livewire-ui-components' ] ) {
			if ( text.includes( `"${ dependency }"` ) ) {
				result.dependsOn.push( dependency );
			}
		}
	}

	for ( const path of walk( root ) ) {
		const text = readFileSync( path, 'utf8' );
		const rel = relative( root, path );
		const extension = extname( path );

		result.filesScanned++;

		const blade = path.endsWith( '.blade.php' ) || ( '.php' === extension && text.includes( '<x-artisanpack-' ) ) ? parseBladeTags( text ) : [];

		const library = blade.filter( ( usage ) => libraryTags.has( usage.name ) );

		if ( library.length ) {
			result.bladeFiles++;
			library.forEach( ( usage ) => recordUsage( result.blade, usage ) );
		}

		blade.filter( ( usage ) => ! libraryTags.has( usage.name ) ).forEach( ( usage ) => bump( result.packageOwnedTags, usage.name ) );

		if ( [ '.tsx', '.jsx' ].includes( extension ) ) {
			const usages = jsxUsages( text );

			if ( usages.length ) {
				result.jsFiles++;
				usages.forEach( ( usage ) => recordUsage( result.react, usage ) );
			}
		}

		if ( '.vue' === extension ) {
			const usages = parseVueUsages( text );

			if ( usages.length ) {
				result.jsFiles++;
				usages.forEach( ( usage ) => recordUsage( result.vue, usage ) );
			}
		}

		if ( [ '.php', '.vue', '.tsx', '.jsx' ].includes( extension ) ) {
			const tally = tallyClasses( text );

			if ( Object.keys( tally ).some( ( kind ) => 'component' === kind || 'themeBase' === kind || 'themeContent' === kind ) ) {
				result.daisyFiles.add( rel );
			}

			addCounts( result.daisyClasses, tally );
		}

		if ( '.json' !== extension ) {
			themeVariables( text ).forEach( ( variable ) => bump( result.themeVariables, variable ) );
			configReferences( text ).forEach( ( reference ) => bump( result.config, reference.replace( /\s+/g, ' ' ) ) );
		}
	}

	cleanup();

	return { ...result, daisyFiles: result.daisyFiles.size };
}

const packages = readdirSync( packagesDir )
	.filter( ( name ) => ! name.startsWith( '.' ) && ! LIBRARIES.has( name ) && statSync( join( packagesDir, name ) ).isDirectory() )
	.sort()
	.map( scanPackage );

writeJson( 'downstream-usage.json', { packages } );

const touched = packages.filter( ( item ) => item.bladeFiles || item.jsFiles || item.daisyFiles );

console.log( `scanned ${ packages.length } packages; ${ touched.length } touch the UI layer` );
