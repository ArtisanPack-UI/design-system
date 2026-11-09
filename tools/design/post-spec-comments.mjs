#!/usr/bin/env node
// Posts one "Claude Design spec" comment per component on its issue, embedding the
// light and dark renders from design/screens and linking the spec files.
//
// Usage (from the repo root, after the design/ folder is merged to main):
//   node tools/design/post-spec-comments.mjs            # dry run: prints every comment
//   node tools/design/post-spec-comments.mjs --post     # posts with `gh issue comment`
//   node tools/design/post-spec-comments.mjs --post --only=Button,Input
//   node tools/design/post-spec-comments.mjs --ref=<branch-or-sha>
//
// Re-running is safe: a comment is skipped when the issue already has one with the
// same hidden marker.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const repo = 'ArtisanPack-UI/design-system';
const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v ?? true];
}));
const ref = args.ref || 'main';
const only = args.only ? new Set(String(args.only).split(',')) : null;
const post = Boolean(args.post);

const map = JSON.parse(readFileSync(join(root, 'design', 'issue-map.json'), 'utf8')).components;
const raw = (p) => `https://raw.githubusercontent.com/${repo}/${ref}/${p}`;
const blob = (p) => `https://github.com/${repo}/blob/${ref}/${p}`;

function existingMarkers(issue) {
  const out = execFileSync('gh', ['api', `repos/${repo}/issues/${issue}/comments`, '--paginate', '--jq', '.[].body'], { encoding: 'utf8' });
  return new Set([...out.matchAll(/<!-- apui-design-spec:(\w+) -->/g)].map((m) => m[1]));
}

function body(name) {
  const shot = (t) => raw(`design/screens/${name}-${t}.png`);
  return [
    `<!-- apui-design-spec:${name} -->`,
    `### Design spec: ${name}`,
    '',
    `The Claude Design spec for **${name}** is in [\`design/components/${name}/\`](${blob(`design/components/${name}`)}):`,
    `[guidelines](${blob(`design/components/${name}/README.md`)}) (anatomy, props, accessibility) and`,
    `[preview](${blob(`design/components/${name}/preview.html`)}) (variants, sizes, states, surfaces).`,
    'Tokens and conventions: [brand book](' + blob('design/brand-book.md') + ').',
    '',
    '| Light | Dark |',
    '|---|---|',
    `| <img src="${shot('light')}" width="420"> | <img src="${shot('dark')}" width="420"> |`,
    '',
    `[High contrast](${shot('high-contrast')}). Open the preview with \`?theme=dark\` or \`?theme=high-contrast\` to inspect it live.`,
    '',
    'Design sign-off for this component means the build matches this spec in every variant, size, state and theme.',
  ].join('\n');
}

const byIssue = {};
for (const [name, issue] of Object.entries(map)) {
  if (only && !only.has(name)) continue;
  (byIssue[issue] ??= []).push(name);
}

for (const [issue, names] of Object.entries(byIssue)) {
  const done = post ? existingMarkers(issue) : new Set();
  for (const name of names) {
    if (done.has(name)) { console.log(`#${issue} ${name}: already posted, skipping`); continue; }
    const text = body(name);
    if (!post) { console.log(`\n===== #${issue} ${name} =====\n${text}`); continue; }
    execFileSync('gh', ['issue', 'comment', issue, '-R', repo, '--body', text], { stdio: 'inherit' });
    console.log(`#${issue} ${name}: posted`);
  }
}
if (!post) console.log('\nDry run. Add --post to publish.');
