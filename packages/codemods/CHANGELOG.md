# @artisanpack-ui/codemods

## 1.0.0

### Major Changes

- [#123](https://github.com/ArtisanPack-UI/design-system/pull/123) [`311eccc`](https://github.com/ArtisanPack-UI/design-system/commit/311eccc871af3f7a81bc7ff282ed82ffed7031ba) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - First stable release of the design system packages: the behavior engine, the CSS, the component manifest, the testing kit and the upgrade codemods. They power Livewire UI Components 3.0, `@artisanpack-ui/react` 2.0 and `@artisanpack-ui/vue` 2.0.

### Minor Changes

- [#107](https://github.com/ArtisanPack-UI/design-system/pull/107) [`a3ca0aa`](https://github.com/ArtisanPack-UI/design-system/commit/a3ca0aa6b4a1acaa512708699679db6db5945700) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Add `@artisanpack-ui/codemods`: the migration tooling for the majors built on the design system ([#67](https://github.com/ArtisanPack-UI/design-system/issues/67) to [#70](https://github.com/ArtisanPack-UI/design-system/issues/70), D-056).
  
  - **Upgrade rules** for Livewire, React and Vue, generated from the Phase 0 API catalogue and the component manifests, with curated rules for what names can't say. The build rejects a rule whose target the manifest doesn't have. `generated/upgrade-rules.php` is the Livewire half, for `php artisan artisanpack:upgrade-ui` in Livewire UI Components 3.0.
  - **React and Vue codemods**, run with `npx @artisanpack-ui/codemods react|vue [paths] [--dry-run]`. They rename imports, components, props, events, slots and `v-model` arguments, turn flags into values, map values that changed and merge per-part class props into `classes`, keeping formatting and comments. What they can't decide is reported with its file, line and column.
  - **A DaisyUI report**: raw DaisyUI classes, theme variables and configuration are listed and never rewritten.
  - **Upgrade guides** per stack in `docs/upgrade/`, with their component and prop tables generated from the rules.
