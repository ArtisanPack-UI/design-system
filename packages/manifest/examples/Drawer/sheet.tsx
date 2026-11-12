import { Button, Drawer } from '@artisanpack-ui/react';

export default function SheetExample() {
  return (
    <Drawer side="bottom" trigger="Share" title="Share listing">
      <Button variant="outline" color="neutral" leadingIcon="copy">
        Copy link
      </Button>
      <Button variant="outline" color="neutral" leadingIcon="mail">
        Email
      </Button>
    </Drawer>
  );
}
