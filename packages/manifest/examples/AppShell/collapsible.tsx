import { AppShell, Menu, MenuItem } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function CollapsibleExample() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AppShell
      collapsible
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      sidebarWidth="280px"
      brand="Apexify"
      sidebar={
        <Menu label="Main">
          <MenuItem href="/dashboard" icon="house" current>
            Dashboard
          </MenuItem>
          <MenuItem href="/settings" icon="settings">
            Settings
          </MenuItem>
        </Menu>
      }
    >
      Page content
    </AppShell>
  );
}
