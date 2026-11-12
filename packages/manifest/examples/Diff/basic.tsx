import { Diff } from '@artisanpack-ui/react';

const before = `{
  price: 220000,
  rent: 1600,
  currency: "USD",
  available: "2027-01-01",
}`;

const after = `{
  price: 220000,
  rent: 1650,
  deposit: 3300,
  currency: "USD",
  available: "2027-01-15",
}`;

export default function BasicExample() {
  return <Diff oldContent={before} newContent={after} fileName="listings/grove-greenfield.json" />;
}
