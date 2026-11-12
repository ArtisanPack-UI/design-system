import { Button, Diff } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function SplitExample({ before, after }: { before: string; after: string }) {
  const [view, setView] = useState<'unified' | 'split'>('split');

  return (
    <Diff
      oldContent={before}
      newContent={after}
      fileName="Version 3 → Version 4"
      view={view}
      actions={
        <Button
          size="xs"
          variant="ghost"
          color="neutral"
          onClick={() => setView(view === 'split' ? 'unified' : 'split')}
        >
          {view === 'split' ? 'Unified' : 'Split'}
        </Button>
      }
    />
  );
}
