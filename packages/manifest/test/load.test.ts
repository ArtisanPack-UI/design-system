import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  componentsDir,
  eventName,
  loadManifest,
  loadManifests,
  ManifestLoadError,
  propsFor,
  shipsIn,
  stackName,
} from '../src/load';
import { button } from './helpers';

function dirWith(files: Record<string, unknown>): string {
  const dir = mkdtempSync(join(tmpdir(), 'apui-manifest-'));
  for (const [name, data] of Object.entries(files)) {
    writeFileSync(join(dir, name), typeof data === 'string' ? data : JSON.stringify(data));
  }
  return dir;
}

describe('loader', () => {
  it('defaults to the package components directory', () => {
    expect(componentsDir).toBe(join(__dirname, '..', 'components') + '/');
  });

  it('loads one manifest and all of them', () => {
    expect(loadManifest('Button').rootClass).toBe('apui-button');
    expect(loadManifests().map((m) => m.name)).toContain('Button');
  });

  it('throws a readable error for a missing manifest', () => {
    expect(() => loadManifest('Nope')).toThrow(/No manifest for "Nope"/);
  });

  it('throws a readable error for an invalid manifest', () => {
    const dir = dirWith({ 'Button.json': { ...button(), sizes: ['huge'] } });
    expect(() => loadManifests(dir)).toThrow(ManifestLoadError);
    expect(() => loadManifests(dir)).toThrow('Button.json/sizes/0: "huge" is not a size');
  });

  it('throws for malformed JSON', () => {
    const dir = dirWith({ 'Button.json': '{ nope' });
    expect(() => loadManifest('Button', dir)).toThrow(/Button\.json/);
  });

  it('reports stacks and stack names', () => {
    const m = button();
    m.name = 'ThemePreview';
    m.rootClass = 'apui-theme-preview';
    m.stacks = { livewire: { name: 'theme-preview' }, react: false, vue: false };
    expect(shipsIn(m, 'livewire')).toBe(true);
    expect(shipsIn(m, 'react')).toBe(false);
    expect(stackName(m, 'livewire')).toBe('x-artisanpack-theme-preview');
    expect(() => stackName(m, 'vue')).toThrow('ThemePreview does not ship in vue');
    expect(stackName(button(), 'react')).toBe('Button');
  });

  it('filters props by stack', () => {
    const m = button();
    m.props.push({ name: 'errorField', type: 'string', description: 'x', stacks: ['livewire'] });
    expect(propsFor(m, 'livewire').map((p) => p.name)).toContain('errorField');
    expect(propsFor(m, 'react').map((p) => p.name)).not.toContain('errorField');
  });
});

describe('eventName', () => {
  it.each([
    ['value-change', 'wire:model', 'onValueChange', 'update:modelValue'],
    ['open-change', 'open-change', 'onOpenChange', 'update:open'],
    ['checked-change', 'wire:model', 'onCheckedChange', 'update:checked'],
    ['row-click', 'row-click', 'onRowClick', 'row-click'],
    ['complete', 'complete', 'onComplete', 'complete'],
  ])('maps %s', (concept, livewire, react, vue) => {
    expect(eventName(concept, 'livewire')).toBe(livewire);
    expect(eventName(concept, 'react')).toBe(react);
    expect(eventName({ name: concept, description: 'x' }, 'vue')).toBe(vue);
  });
});
