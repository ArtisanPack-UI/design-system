import { Button, Input, Navbar } from '@artisanpack-ui/react';

export default function IslandExample() {
  return (
    <Navbar
      layout="island"
      surface="glass"
      brand="Socials"
      search={
        <Input
          type="search"
          size="sm"
          leadingIcon="search"
          placeholder="Search"
          aria-label="Search"
        />
      }
      actions={
        <Button size="sm" leadingIcon="plus">
          New page
        </Button>
      }
    />
  );
}
