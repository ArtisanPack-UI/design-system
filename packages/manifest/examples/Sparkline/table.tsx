import { Sparkline } from '@artisanpack-ui/react';

const properties = [
  { name: 'Lakeview Lofts', visits: '9.8K', weekly: [2, 4, 3, 7, 6, 9, 12, 11, 14] },
  { name: 'Tranquil Oaks', visits: '6.1K', weekly: [14, 12, 13, 9, 10, 6, 5, 3, 2] },
];

export default function TableExample() {
  return (
    <table>
      <tbody>
        {properties.map((property) => (
          <tr key={property.name}>
            <td>{property.name}</td>
            <td>{property.visits}</td>
            <td>
              <Sparkline data={property.weekly} label="Visits from {first} to {latest}" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
