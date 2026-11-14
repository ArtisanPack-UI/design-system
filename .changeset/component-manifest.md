---
'@artisanpack-ui/manifest': minor
---

Add the component manifest (#26): a JSON Schema (draft 2020-12) for one component's props, variants, sizes, parts, slots, events, accessibility requirements, tokens and the stacks it ships in (D-003), with a Button sample. Includes a validator with the vocabulary rules, the `apui-manifest validate` and `diff` CLI, a typed loader for test harnesses, a manifest diff with Markdown output for upgrade guides, and a PHP loader over a generated `manifests.php`.
