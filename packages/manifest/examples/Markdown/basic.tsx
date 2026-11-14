import { Markdown } from '@artisanpack-ui/react';

const notes = `## Viewing checklist

Bring **photo ID** and proof of income.

- [x] Confirm time with agent
- [ ] Measure the living room
- [ ] Ask about \`heating costs\`

> Viewings run 30 minutes.`;

export default function BasicExample() {
  return <Markdown source={notes} />;
}
