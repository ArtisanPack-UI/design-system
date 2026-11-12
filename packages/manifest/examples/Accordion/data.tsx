import { Accordion } from '@artisanpack-ui/react';

const items = [
  {
    value: 'live',
    title: 'How long does a listing stay live?',
    content: 'Until you archive it or mark it as sold.',
  },
  {
    value: 'owners',
    title: 'Can co-owners edit a listing?',
    content: 'Yes, from the Sharing tab.',
  },
  {
    value: 'files',
    title: 'Which file types can I upload?',
    content: 'Images and PDFs.',
    disabled: true,
  },
];

export default function DataExample() {
  return <Accordion items={items} />;
}
