import { useState } from 'react';
import { RichTextEditor } from '@artisanpack-ui/react';

export default function MarkdownExample() {
  const [summary, setSummary] = useState('## Highlights\n\n- In-unit laundry');

  return (
    <RichTextEditor
      output="markdown"
      maxLength={500}
      label="Summary"
      value={summary}
      onValueChange={setSummary}
    />
  );
}
