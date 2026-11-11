import { useState } from 'react';
import { CodeEditor } from '@artisanpack-ui/react';

export default function DiagnosticsExample() {
  const [source, setSource] = useState("const fraction: number = '0';");

  return (
    <CodeEditor
      language="TypeScript"
      label="Source"
      diagnostics={[
        {
          line: 1,
          column: 26,
          message: "Type 'string' is not assignable to type 'number'.",
          severity: 'error',
        },
      ]}
      value={source}
      onValueChange={setSource}
    />
  );
}
