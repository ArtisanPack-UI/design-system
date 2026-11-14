import { Menu, MenuItem, MenuSeparator, MenuSub, MenuTitle } from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <Menu label="Main">
      <MenuItem href="/dashboard" icon="list">
        Dashboard
      </MenuItem>
      <MenuSub label="Properties" icon="settings">
        <MenuItem href="/properties">All properties</MenuItem>
        <MenuItem href="/properties/lakeview" current>
          Lakeview Lofts
        </MenuItem>
        <MenuItem href="/properties/drafts" badge="3">
          Drafts
        </MenuItem>
      </MenuSub>
      <MenuItem href="/inbox" icon="mail" badge="12">
        Inbox
      </MenuItem>
      <MenuTitle>Settings</MenuTitle>
      <MenuItem href="/team" icon="user">
        Team
      </MenuItem>
      <MenuSeparator />
      <MenuItem href="/billing" disabled>
        Billing
      </MenuItem>
    </Menu>
  );
}
