---
'@artisanpack-ui/css': minor
'@artisanpack-ui/manifest': minor
'@artisanpack-ui/behavior': minor
'@artisanpack-ui/testing': minor
---

Add the Dialog, DropdownMenu and Toast pilots (#49 to #51, D-019). `@artisanpack-ui/behavior` adds the DropdownMenu widget (Zag's menu, scoped `dropdown-menu`) and the toast stack (`createToaster`, `toast`, `toastGroup`, `staticToastParts`), with `apuiDropdownMenu`, `apuiToaster` and `apuiToast` for Alpine, `useDropdownMenu`, `useToaster` and `useToast` for React and Vue, `ApuiBehavior.toast()` in the classic script, and five more Lucide icons. `@artisanpack-ui/css` ships Dialog, DropdownMenu and Toast. `@artisanpack-ui/manifest` adds their manifests and docs examples. `@artisanpack-ui/testing` compares Zag's kebab-case part names with the manifests' camelCase ones, and renders overlays' positioner and backdrop inside their fixture case.
