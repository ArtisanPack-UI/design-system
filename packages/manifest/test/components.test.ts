/**
 * The CI check (#26): every manifest in components/ validates, and the PHP
 * output is current.
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { buildPhp, OUTPUT } from '../scripts/build-php.mjs';
import { validateManifests } from '../src/validate';

const root = join(__dirname, '..');
const files = readdirSync(join(root, 'components')).filter((name) => name.endsWith('.json'));

describe('components/', () => {
  it('has the Button sample', () => {
    expect(files).toContain('Button.json');
  });

  it('validates every manifest', () => {
    const sources = files.map((file) => ({
      data: JSON.parse(readFileSync(join(root, 'components', file), 'utf8')),
      file,
    }));
    expect(validateManifests(sources).errors).toEqual([]);
  });

  it('keeps generated/manifests.php up to date', () => {
    expect(readFileSync(join(root, OUTPUT), 'utf8')).toBe(buildPhp());
  });
});

const hasPhp = (() => {
  try {
    execFileSync('php', ['-v'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

describe('PHP loader', () => {
  it.skipIf(!hasPhp)('loads the same Button as the JSON', () => {
    const script = `
      require ${JSON.stringify(join(root, 'php', 'ComponentManifest.php'))};
      require ${JSON.stringify(join(root, 'php', 'ManifestRepository.php'))};
      $repo = ArtisanPackUI\\DesignSystem\\Manifest\\ManifestRepository::fromFile();
      $button = $repo->get( 'Button' );
      echo json_encode( [
        'manifest' => $button->toArray(),
        'has' => [ $repo->has( 'Button' ), $repo->has( 'Nope' ) ],
        'vue' => $button->shipsIn( 'vue' ),
        'tag' => $button->bladeTag(),
        'parts' => $button->partNames(),
        'livewire' => array_keys( $repo->forStack( 'livewire' ) ),
      ] );
      try { $repo->get( 'Nope' ); } catch ( OutOfBoundsException $e ) { fwrite( STDERR, $e->getMessage() ); }
    `;
    const output = JSON.parse(execFileSync('php', ['-r', script], { encoding: 'utf8' }));
    const json = JSON.parse(readFileSync(join(root, 'components', 'Button.json'), 'utf8'));
    delete json.$schema;
    expect(output.manifest).toEqual(json);
    expect(output.has).toEqual([true, false]);
    expect(output.vue).toBe(true);
    expect(output.tag).toBe('x-artisanpack-button');
    expect(output.parts).toEqual(json.parts.map((p: { name: string }) => p.name));
    expect(output.livewire).toContain('Button');
  });
});
