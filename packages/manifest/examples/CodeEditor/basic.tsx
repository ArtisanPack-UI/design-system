import { useState } from 'react';
import { CodeEditor } from '@artisanpack-ui/react';

export default function BasicExample() {
  const [css, setCss] = useState('.listing {\n  color: var(--apui-text-default);\n}');

  return (
    <CodeEditor
      language="CSS"
      label="Custom CSS"
      hint="Added after the theme styles."
      rows={8}
      value={css}
      onValueChange={setCss}
    />
  );
}
