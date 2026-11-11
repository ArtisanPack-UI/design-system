import { Button, Navbar, NavbarItem } from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <Navbar
      brand={<a href="/">Horizon</a>}
      actions={
        <>
          <Button variant="ghost" color="neutral" size="sm" href="/login">
            Sign in
          </Button>
          <Button size="sm" href="/register">
            Get started
          </Button>
        </>
      }
    >
      <NavbarItem href="/properties" current>
        Properties
      </NavbarItem>
      <NavbarItem href="/analytics">Analytics</NavbarItem>
      <NavbarItem href="/tools">Tools &amp; calculators</NavbarItem>
    </Navbar>
  );
}
