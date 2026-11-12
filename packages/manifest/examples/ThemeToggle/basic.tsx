import { ThemeScript, ThemeToggle } from '@artisanpack-ui/react';

// ThemeScript renders the blocking snippet: put it in <head> (in Next.js, the root layout's <head>).
export function Head() {
  return (
    <head>
      <ThemeScript />
    </head>
  );
}

export default function BasicExample() {
  return <ThemeToggle label="Theme" />;
}
