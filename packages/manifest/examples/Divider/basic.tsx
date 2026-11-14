import { Divider } from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <>
      <Divider />
      <Divider strength="strong" />
      <Divider label="or continue with" />
      <Divider align="start">Older activity</Divider>
    </>
  );
}
