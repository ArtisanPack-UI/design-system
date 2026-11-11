import type { FormEvent } from 'react';
import { Button, Form, Input, Textarea } from '@artisanpack-ui/react';

export default function BasicExample() {
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <Form
      aria-label="Invite member"
      onSubmit={save}
      actions={
        <>
          <Button variant="ghost">Cancel</Button>
          <Button type="submit">Send invite</Button>
        </>
      }
    >
      <Input type="email" name="email" label="Email" required />
      <Textarea name="message" label="Message" rows={3} />
    </Form>
  );
}
