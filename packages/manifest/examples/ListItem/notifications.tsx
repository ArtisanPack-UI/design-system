import { List, ListItem } from '@artisanpack-ui/react';

export default function NotificationsExample({ onOpen }: { onOpen: (id: number) => void }) {
  return (
    <List variant="divided">
      <ListItem
        interactive
        selected
        onClick={() => onOpen(1)}
        leadingIcon="mail"
        title="Offer received"
        description="Lakeview Lofts · $248,000"
        trailing="2m"
      />
      <ListItem
        interactive
        onClick={() => onOpen(2)}
        leadingIcon="calendar"
        title="Viewing booked"
        description="Thu, Nov 12 · 11:00"
        trailing="1h"
      />
    </List>
  );
}
