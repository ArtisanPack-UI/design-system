import { Tabs, type TabData } from '@artisanpack-ui/react';
import { useState } from 'react';

const ranges: TabData[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

export default function DataExample() {
  const [range, setRange] = useState('week');

  return <Tabs size="sm" label="Range" tabs={ranges} value={range} onValueChange={setRange} />;
}
