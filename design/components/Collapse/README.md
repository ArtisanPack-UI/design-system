# Collapse

A single disclosure: show and hide one region.

## Anatomy

Root `.apui-collapse`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: trigger, icon, panel, fade.

## Props

| Prop | Values | Default |
|---|---|---|
| `open` | boolean | false |
| `variant` | 'section' \| 'read-more' | section |

## Accessibility

- Trigger is a button with aria-expanded; the panel follows it in the DOM.

## Do

- Say what will appear (“Advanced settings”).

## Don’t

- Don’t clamp text that contains the main point.
