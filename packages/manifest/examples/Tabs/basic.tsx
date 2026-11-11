import { Tab, Tabs } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function BasicExample() {
  const [section, setSection] = useState('profile');

  return (
    <Tabs value={section} onValueChange={setSection} label="Account">
      <Tab value="profile" label="Profile" icon="user">
        Your name, photo and contact details.
      </Tab>
      <Tab value="notifications" label="Notifications" icon="mail">
        Choose what we email you about.
      </Tab>
      <Tab value="security" label="Security" icon="lock">
        Password and two-factor authentication.
      </Tab>
    </Tabs>
  );
}
