import { ColorPicker } from '@artisanpack-ui/react';

const brand = [
  '#1f74bf',
  '#0b9488',
  '#1f6f3d',
  '#de9d16',
  '#e88761',
  '#c92f33',
  '#91256c',
  '#23272b',
];

export default function SwatchesExample() {
  return (
    <ColorPicker
      label="Accent color"
      hint="Pick a brand color or enter any CSS color."
      format="oklch"
      name="accent"
      swatches={brand}
      defaultValue="#de9d16"
    />
  );
}
