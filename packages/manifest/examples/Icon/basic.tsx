import { Icon } from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <>
      <Icon name="house" size="sm" />
      <Icon name="house" />
      <Icon name="house" size="lg" />
      <Icon name="house" size="xl" />
      <Icon name="circle-alert" color="error" label="Payment failed" />
      <Icon name="arrow-right" />
    </>
  );
}
