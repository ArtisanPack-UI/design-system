import { useState } from 'react';
import { Swap } from '@artisanpack-ui/react';

export default function BasicExample() {
  const [darkMode, setDarkMode] = useState(false);
  return <Swap label="Dark mode" checked={darkMode} onCheckedChange={setDarkMode} />;
}
