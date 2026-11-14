import { AppShell, Menu, MenuItem, MenuTitle, Navbar, PageHeader } from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <AppShell
      brand={<a href="/">Apexify</a>}
      sidebar={
        <Menu label="Main">
          <MenuItem href="/dashboard" icon="house" current>
            Dashboard
          </MenuItem>
          <MenuItem href="/inbox" icon="inbox" badge="4">
            Inbox
          </MenuItem>
          <MenuTitle>Workspace</MenuTitle>
          <MenuItem href="/settings" icon="settings">
            Settings
          </MenuItem>
        </Menu>
      }
      header={<Navbar layout="island" sticky={false} actions="Olivia Rhye" />}
      footer="Olivia Rhye"
    >
      <PageHeader title="Dashboard" />
    </AppShell>
  );
}
