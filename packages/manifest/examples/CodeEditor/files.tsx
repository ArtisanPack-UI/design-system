import { useState } from 'react';
import { CodeEditor } from '@artisanpack-ui/react';

const files: Record<string, string> = {
  'format-price.ts': "export const currency = 'USD';",
  'listing.blade.php': '<x-artisanpack-card />',
};

export default function FilesExample() {
  const [file, setFile] = useState('format-price.ts');
  const [language, setLanguage] = useState('typescript');
  const [sources, setSources] = useState(files);

  return (
    <CodeEditor
      label="Source"
      tabs={Object.keys(sources)}
      tab={file}
      onTabChange={setFile}
      languages={[
        { value: 'typescript', label: 'TypeScript' },
        { value: 'php', label: 'PHP' },
      ]}
      language={language}
      onLanguageChange={setLanguage}
      value={sources[file]}
      onValueChange={(value) => setSources({ ...sources, [file]: value })}
    />
  );
}
