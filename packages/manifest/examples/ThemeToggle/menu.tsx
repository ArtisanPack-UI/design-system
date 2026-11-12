import { ThemeToggle, type ThemeChoice } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function MenuExample({ save }: { save: (theme: ThemeChoice) => void }) {
  const [theme, setTheme] = useState<ThemeChoice>('system');

  return (
    <ThemeToggle
      variant="menu"
      size="sm"
      value={theme}
      onValueChange={(next) => {
        setTheme(next);
        save(next);
      }}
    />
  );
}
