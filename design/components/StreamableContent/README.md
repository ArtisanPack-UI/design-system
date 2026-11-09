# StreamableContent

Content that arrives over time, with streaming, waiting, complete and interrupted states.

## Anatomy

Root `.apui-streamable-content`. Each part carries `data-part`, scoped by `data-scope`, and each package also exposes it through `classes` and slots. Parts: root, status, content, caret, actions.

## Props

| Prop | Values | Default |
|---|---|---|
| `state` | 'waiting' \| 'streaming' \| 'done' \| 'error' \| 'stopped' | streaming |
| `onStop` | function | — |

## Accessibility

- The region is aria-live=polite and aria-busy while streaming; it isn’t re-announced token by token.
- Stop is always available while streaming.

## Do

- Keep partial content when a stream fails, and offer Continue.

## Don’t

- No sparkle icons or gradients; the status line says what’s happening.
