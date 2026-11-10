/** The reference Probe in React, plus a broken twin for the parity tests. */
import type { ReactNode } from 'react';

export interface ProbeProps {
  variant?: 'solid' | 'outline';
  color?: 'primary' | 'error';
  size?: 'sm' | 'md';
  disabled?: boolean;
  loading?: boolean;
  leadingIcon?: string;
  children?: ReactNode;
  onPress?: () => void;
}

const Icon = () => (
  <span data-scope="probe" data-part="icon" aria-hidden="true">
    <svg viewBox="0 0 16 16" width="16" height="16">
      <circle cx="8" cy="8" r="5" fill="currentColor" />
    </svg>
  </span>
);

export function Probe({
  variant = 'solid',
  color = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leadingIcon,
  children,
  onPress,
}: ProbeProps) {
  return (
    <button
      type="button"
      className="apui-probe"
      data-variant={variant}
      data-color={color}
      data-size={size}
      disabled={disabled || undefined}
      data-disabled={disabled ? '' : undefined}
      aria-busy={loading || undefined}
      onClick={onPress}
    >
      {leadingIcon ? <Icon /> : null}
      <span data-scope="probe" data-part="label">
        {children}
      </span>
      {loading ? <span data-scope="probe" data-part="spinner" aria-hidden="true" /> : null}
    </button>
  );
}

/** Ignores size, loading and leadingIcon, and renders a part the manifest doesn't list. */
export function BrokenProbe({
  variant = 'solid',
  color = 'primary',
  disabled = false,
  children,
}: ProbeProps & { tone?: string }) {
  return (
    <button
      type="button"
      className="apui-probe"
      data-variant={variant}
      data-color={color}
      data-size="md"
      disabled={disabled || undefined}
    >
      <span data-scope="probe" data-part="label">
        {children}
      </span>
      <span data-scope="probe" data-part="badge" />
    </button>
  );
}
