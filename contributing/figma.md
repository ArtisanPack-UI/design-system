# Figma variables

Outside designers work from Figma variables generated from the DTCG tokens (#28). **Figma follows the code tokens and never edits them.** The sync is one-way: nothing is read back out of Figma, and anything changed by hand in the variables is overwritten on the next sync. Design changes still arrive as diffs against `packages/tokens/tokens/` ([tokens README](tokens/README.md#changing-tokens)).

**File:** [ArtisanPack UI Design System — Tokens](https://www.figma.com/design/cDxSkbV5WjAcM9o4uT5KX5) (Jacob Martella Web Development team). Publish it as a library to use the variables in other files.

## What's in the file

The **Reference** page shows every foundation bound to the variables: a preset × theme matrix of sample UI (a card with badges, a field and buttons, in every preset and theme), color swatches, the type scale, the space scale, radii and the three densities. Nothing on it is a hard-coded value, so it follows every sync. Select any frame and switch its Tokens, Theme or Density mode in the right-hand panel to see the system change. Fonts: Geist, IBM Plex, Hanken Grotesk, Bricolage Grotesque and JetBrains Mono, which Figma serves from Google Fonts.

The variables themselves are under **Local variables** (click an empty spot on the canvas, then Variables in the right-hand panel):

Three collections, one per axis, so a frame switches preset, theme and density independently, the way `data-preset`, `data-theme` and `data-density` do in CSS:

| Collection | Modes | Holds |
|---|---|---|
| **Tokens** | Strata, Forest, Harbor, Ledger | Every primitive (`primitive/…`), flat semantic (`semantic/…`) and component (`component/…`) token |
| **Theme** | Light, Dark, High contrast | The theme tokens: surfaces, text, borders, color roles, charts, syntax, elevation |
| **Density** | Compact, Default, Comfortable | The density tokens: panel padding and gap, row height, cell padding, field gap |

- **Aliases stay aliases.** `component/card/padding` aliases `Density › panel/padding`, which aliases a space primitive, so Figma resolves values through the modes the same way CSS resolves `var()`.
- **Preset × theme.** A theme or density token that a preset changes (Harbor's ink primary, Ledger's line colors) is routed through a hidden `Tokens` variable such as `theme/dark/color/primary`, which varies by preset. Use the `Theme` variable; the routes are hidden from publishing and from every picker.
- **Pickers.** Primitives have no scopes, so they don't show in property pickers: designs use semantic and component tokens, as components do. Semantic colors are scoped by role (`text/*` to text fill, `surface/*` to frame and shape fill, `border/*` to stroke).
- **Dev Mode.** Every variable carries its custom property as WEB code syntax, `var(--apui-color-primary)`, and in its description.
- **Types.** Colors, `px`/`rem` dimensions (`rem` × 16), durations (ms), font weights and numbers are numeric variables. Values Figma has no type for are strings holding the CSS: easings, shadows (`elevation/*`), letter spacing in `em` and `measure` in `ch`. Font families hold the first family of the stack.
- **Mode limit.** Figma Professional allows 4 modes per collection, and Tokens uses all four. A fifth preset needs an Organization plan, or a separate file for brand presets.

## Syncing after a token change

`npm run tokens` regenerates the payload with every other output, and CI fails when it's stale:

| File | What it is |
|---|---|
| `packages/tokens/generated/figma/variables.json` | The payload: collections, modes, variables and values. Also exported as `@artisanpack-ui/tokens/figma` |
| `packages/tokens/generated/figma/plugin.js` + `manifest.json` | A development plugin that syncs the payload into the open file |
| `packages/tokens/figma/sync-variables.js` | The Plugin API code both routes run |
| `packages/tokens/figma/reference-page.js` | Rebuilds the Reference page from the file's variables. It replaces only the nodes it made (named `apui/…`), so notes added to the page stay |

The sync matches collections, modes and variables by name. It creates what's missing, updates what changed, recreates a variable whose type changed, and removes variables and modes that are no longer in the payload. Running it twice changes nothing.

### With the Figma desktop app

1. Open the file.
2. **Plugins › Development › Import plugin from manifest…** and pick `packages/tokens/generated/figma/manifest.json` (once per machine).
3. **Plugins › Development › ArtisanPack UI tokens sync.** It syncs the variables, rebuilds the Reference page and closes with a summary of what it created, updated and removed.

### With Claude and the Figma connector

The connector's `use_figma` tool takes one script of at most 50,000 characters, so the payload goes in chunks:

```bash
npm run figma:chunks --workspace @artisanpack-ui/tokens
```

This writes `packages/tokens/.figma-chunks/NN-<step>.js` (gitignored). Each file is the sync code plus one compact chunk and runs on its own. Run them **in order** with `use_figma` on the file key `cDxSkbV5WjAcM9o4uT5KX5`: every `declare` chunk, then every `values` chunk, then `prune`, then `reference`, which rebuilds the Reference page. Values can only be set once every alias target exists, which is why every chunk is declared first. Each chunk returns a summary; `values` should equal the number of variables times their modes.

### Checking the result

Open the Reference page: the Ledger row of the matrix should have square corners and IBM Plex, and the Dark column dark surfaces. **Local variables** should show the three collections with the modes above. The tests check the payload and run both routes against an in-memory stand-in for the Plugin API (`packages/tokens/test/figma.test.ts`), so a sync that would fail in Figma fails in CI first.
