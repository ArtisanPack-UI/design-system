# Accordion

Stacked sections that expand and collapse.

## Anatomy

Root `.apui-accordion`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, item, heading, trigger, chevron, panel.

## Props

| Prop | Values | Default |
|---|---|---|
| `type` | 'single' \| 'multiple' | single |
| `variant` | 'default' \| 'separated' \| 'flush' | default |
| `defaultOpen` | string[] | — |

## Accessibility

- Triggers are buttons inside headings with aria-expanded and aria-controls.

## Do

- Use for FAQs and optional detail.

## Don’t

- Don’t hide required form fields in collapsed sections.
