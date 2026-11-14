import { Tab, Tabs } from '@artisanpack-ui/react';

export default function UnderlineExample() {
  return (
    <Tabs variant="underline" activationMode="manual" defaultValue="overview">
      <Tab value="overview" label="Overview">
        Your portfolio at a glance.
      </Tab>
      <Tab value="notifications" label="Notifications" count={4}>
        Four unread notifications.
      </Tab>
      <Tab value="history" label="Trade history">
        Every trade in the last year.
      </Tab>
      <Tab value="archived" label="Archived" disabled />
    </Tabs>
  );
}
