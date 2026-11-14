import { useState } from 'react';
import { Toggle } from '@artisanpack-ui/react';

export default function BasicExample() {
  const [darkMode, setDarkMode] = useState(false);

  return <Toggle label="Dark mode" checked={darkMode} onCheckedChange={setDarkMode} />;
}
