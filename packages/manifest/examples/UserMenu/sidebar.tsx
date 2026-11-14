import { UserMenu } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function SidebarExample({ onSelect }: { onSelect: (value: string) => void }) {
  const [workspace, setWorkspace] = useState('apexify');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  return (
    <UserMenu
      user={{ name: 'Olivia Rhye', email: 'olivia@company.com', role: 'Admin · Apexify' }}
      workspaces={[
        { id: 'apexify', name: 'Apexify' },
        { id: 'horizon', name: 'Horizon Homes' },
      ]}
      workspace={workspace}
      onWorkspaceChange={setWorkspace}
      theme={theme}
      onThemeChange={setTheme}
      items={[
        { value: 'profile', label: 'Profile', icon: 'user' },
        { value: 'settings', label: 'Settings', icon: 'settings' },
      ]}
      onSelect={onSelect}
    />
  );
}
