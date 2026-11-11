import { CheckboxGroup } from '@artisanpack-ui/react';

const amenities = [
  'In-unit laundry',
  'Parking',
  'Rooftop terrace',
  'Gym',
  'Bike storage',
  'Pets allowed',
];

export default function ColumnsExample() {
  return (
    <CheckboxGroup
      label="Amenities"
      name="amenities[]"
      options={amenities}
      columns={3}
      defaultValue={['Parking']}
    />
  );
}
