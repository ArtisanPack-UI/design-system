import { Markdown } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function EditorExample({ initial }: { initial: string }) {
  const [notes, setNotes] = useState(initial);

  return <Markdown source={notes} onSourceChange={setNotes} mode="split" />;
}
