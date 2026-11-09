/**
 * @module cn
 *
 * Class name utility that combines {@link https://github.com/lukeed/clsx | clsx}
 * conditional class merging with {@link https://github.com/dcastil/tailwind-merge | tailwind-merge}
 * conflict resolution.
 *
 * @packageDocumentation
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge CSS class names with Tailwind-aware conflict resolution.
 *
 * Accepts any combination of strings, arrays, objects, and falsy values.
 * Tailwind CSS utility conflicts (e.g. `p-4` vs `p-8`) are resolved in
 * last-wins order. Classes that Tailwind doesn't recognize are kept as given,
 * so this is not general deduplication: `cn('btn', 'btn')` returns `'btn btn'`.
 *
 * @param inputs - Class values to merge (strings, arrays, objects, or conditionals)
 * @returns A single class string with Tailwind conflicts resolved
 *
 * @example
 * ```ts
 * cn('btn', 'btn-primary');           // 'btn btn-primary'
 * cn('p-4', isLarge && 'p-8');        // 'p-8' when isLarge is true
 * cn('text-red-500', 'text-blue-500'); // 'text-blue-500'
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
