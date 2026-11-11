import { Button, Toaster, toast } from '@artisanpack-ui/react';

export default function ToasterExample() {
  return (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast.create({
            title: 'Listing archived',
            description: 'Cedarwood Estates is hidden from search.',
            action: { label: 'Undo', onClick: () => console.log('restored') },
          })
        }
      >
        Archive listing
      </Button>
    </>
  );
}
