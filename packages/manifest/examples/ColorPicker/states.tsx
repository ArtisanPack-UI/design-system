import { ColorPicker } from '@artisanpack-ui/react';

export default function StatesExample() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <ColorPicker
        label="Brand color"
        required
        alpha={false}
        defaultValue="#c92f33"
        error="Enter a color, such as #1f74bf."
      />
      <ColorPicker label="Locked color" disabled defaultValue="#23272b" />
    </div>
  );
}
