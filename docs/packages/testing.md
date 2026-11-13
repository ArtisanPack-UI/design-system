---
title: Testing Package
menu_order: 6
---

# @artisanpack-ui/testing

The quality gates every component passes, in every stack it ships in. Use them if you build components on the design system and want the same guarantees.

| Gate | What fails it |
|---|---|
| **Cross-stack visual regression**, with a right-to-left pass | A screenshot that differs from the baseline, or from another stack's |
| **Accessibility** | An axe violation (WCAG 2.2 A and AA) on any fixture sheet, or a root element or role the manifest doesn't allow |
| **API parity** | Props, parts or events that drift from the [manifest](Packages-Manifest) |

```bash
npm install --save-dev @artisanpack-ui/testing playwright
```

## Fixtures

Fixtures come from each component's manifest, so every stack renders the same matrix: every variant, size and state, every color, every surface, one sheet per theme, and a right-to-left sheet.

## Run the gates

```json
{
  "components": ["Button"],
  "css": ["node_modules/@artisanpack-ui/css/dist/index.css"],
  "stacks": {
    "react": { "host": "test/fixture-host.tsx" }
  },
  "baselines": "node_modules/@artisanpack-ui/testing/baselines",
  "out": "build/gates"
}
```

```bash
npx apui-gates check --config apui-gates.config.json            # fail on any difference
npx apui-gates check --config apui-gates.config.json --update   # write new or changed baselines
```

`apui-gates check` renders every sheet in every configured stack, runs axe and the manifest checks, then compares each screenshot against the baseline and the stacks against each other. It writes screenshots, diff images and a report to `out`, and exits with a failure when anything fails.

## Exports

| Import | What it is |
|---|---|
| `@artisanpack-ui/testing` | The gate helpers: fixture pages, sheet capture and forced states, axe runs, the manifest accessibility checks and image comparison |
| `@artisanpack-ui/testing/react`, `/vue` | Fixture helpers for React and Vue |
| `@artisanpack-ui/testing/react-host`, `/vue-host` | The default fixture hosts |
| `@artisanpack-ui/testing/generated/fixtures/*` | The fixtures as JSON, for PHP |

The PHP side ships in the Composer package `artisanpack-ui/design-system`.
