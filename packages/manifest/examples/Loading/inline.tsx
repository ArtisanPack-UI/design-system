import { Loading } from '@artisanpack-ui/react';

export default function InlineExample({ saving }: { saving: boolean }) {
  return (
    <>
      <Loading />
      <Loading variant="dots" color="neutral" />
      {saving ? <Loading size="sm">Saving changes…</Loading> : null}
    </>
  );
}
