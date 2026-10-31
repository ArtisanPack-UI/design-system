/**
 * Filesystem layout shared by the inventory tools.
 *
 * The tools assume the design-system repo is checked out next to the other
 * ArtisanPack UI packages. Set AP_PACKAGES_DIR to point somewhere else.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname( fileURLToPath( import.meta.url ) );

export const repoRoot = resolve( here, '../../..' );
export const packagesDir = process.env.AP_PACKAGES_DIR ?? resolve( repoRoot, '..' );
export const dataDir = join( repoRoot, 'docs/inventory/data' );
export const docsDir = join( repoRoot, 'docs/inventory' );

/**
 * Reads the short commit of a sibling package so reports state their snapshot.
 *
 * @param {string} name Package directory name.
 * @returns {string|null} Short commit hash, or null when it is not a git checkout.
 */
export function packageCommit( name ) {
	try {
		return execFileSync( 'git', [ '-C', join( packagesDir, name ), 'rev-parse', '--short', 'HEAD' ], {
			encoding: 'utf8',
			stdio: [ 'ignore', 'pipe', 'ignore' ],
		} ).trim();
	} catch {
		return null;
	}
}

export function readJson( name ) {
	return JSON.parse( readFileSync( join( dataDir, name ), 'utf8' ) );
}

export function writeJson( name, value ) {
	mkdirSync( dataDir, { recursive: true } );
	writeFileSync( join( dataDir, name ), `${ JSON.stringify( value, null, 2 ) }\n` );
}

export function writeDoc( name, text ) {
	writeFileSync( join( docsDir, name ), text.endsWith( '\n' ) ? text : `${ text }\n` );
}

export function assertPackage( name ) {
	const dir = join( packagesDir, name );

	if ( ! existsSync( dir ) ) {
		throw new Error( `Package not found: ${ dir }. Set AP_PACKAGES_DIR.` );
	}

	return dir;
}
