/**
 * Value rules for each supported DTCG token type, and conversion to CSS.
 *
 * Supported types follow the W3C DTCG 2025.10 format. Two documented
 * extensions apply (see docs/tokens.md): `dimension` also accepts the `em` and
 * `ch` units, and `color` accepts only the `srgb` and `oklch` color spaces.
 */

export const TYPES = [
  'color',
  'dimension',
  'fontFamily',
  'fontWeight',
  'duration',
  'cubicBezier',
  'number',
  'shadow',
];

export const DIMENSION_UNITS = ['px', 'rem', 'em', 'ch'];
export const DURATION_UNITS = ['ms', 's'];
export const COLOR_SPACES = ['srgb', 'oklch'];

const ALIAS = /^\{([^{}]+)\}$/;
const GENERIC_FAMILIES = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'ui-rounded',
  'emoji',
  'math',
  'fangsong',
]);

const SHADOW_FIELDS = {
  color: 'color',
  offsetX: 'dimension',
  offsetY: 'dimension',
  blur: 'dimension',
  spread: 'dimension',
};

export function isAlias(value) {
  return typeof value === 'string' && ALIAS.test(value);
}

export function aliasTarget(value) {
  return value.match(ALIAS)[1];
}

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isNumber = (value) => typeof value === 'number' && Number.isFinite(value);

/**
 * Walks a value and calls `onAlias(path, expectedType)` for every alias in it,
 * including aliases inside composite values.
 */
export function forEachAlias(type, value, onAlias) {
  if (isAlias(value)) {
    onAlias(aliasTarget(value), type);
    return;
  }
  if (type === 'shadow') {
    for (const layer of Array.isArray(value) ? value : [value]) {
      if (!isObject(layer)) continue;
      for (const [field, fieldType] of Object.entries(SHADOW_FIELDS)) {
        if (isAlias(layer[field])) onAlias(aliasTarget(layer[field]), fieldType);
      }
    }
  }
}

/**
 * Replaces every alias in a value with `replace(path)`.
 */
export function mapAliases(type, value, replace) {
  if (isAlias(value)) return replace(aliasTarget(value));
  if (type === 'shadow') {
    const map = (layer) =>
      Object.fromEntries(
        Object.entries(layer).map(([field, v]) => [
          field,
          isAlias(v) ? replace(aliasTarget(v)) : v,
        ]),
      );
    return Array.isArray(value) ? value.map(map) : map(value);
  }
  return value;
}

function hexToComponents(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
}

function validateColor(value, errors) {
  if (!isObject(value))
    return errors.push('color must be an object with colorSpace and components');
  const { colorSpace, components, alpha = 1, hex } = value;
  if (!COLOR_SPACES.includes(colorSpace)) {
    errors.push(`colorSpace must be one of ${COLOR_SPACES.join(', ')}`);
  }
  if (!Array.isArray(components) || components.length !== 3 || !components.every(isNumber)) {
    errors.push('components must be three numbers');
    return;
  }
  if (!isNumber(alpha) || alpha < 0 || alpha > 1) errors.push('alpha must be a number from 0 to 1');
  if (colorSpace === 'srgb') {
    if (typeof hex !== 'string' || !/^#[0-9a-f]{6}$/.test(hex)) {
      errors.push('srgb colors need a lowercase 6-digit hex');
    } else if (hexToComponents(hex).some((c, i) => Math.abs(c - components[i]) > 0.003)) {
      errors.push(`components do not match hex ${hex}`);
    }
  }
  if (colorSpace === 'oklch') {
    const [l, c, h] = components;
    if (l < 0 || l > 1) errors.push('oklch lightness must be from 0 to 1');
    if (c < 0) errors.push('oklch chroma must not be negative');
    if (h < 0 || h >= 360) errors.push('oklch hue must be from 0 to 360');
    if (hex !== undefined) errors.push('oklch colors must not carry a hex fallback');
  }
}

function validateUnitValue(value, units, errors, label) {
  if (!isObject(value) || !isNumber(value.value) || !units.includes(value.unit)) {
    errors.push(`${label} must be { value: number, unit: ${units.join(' | ')} }`);
  }
}

/**
 * Returns a list of problems with a literal or partially aliased value.
 */
export function validateValue(type, value) {
  const errors = [];
  if (isAlias(value)) return errors;

  switch (type) {
    case 'color':
      validateColor(value, errors);
      break;
    case 'dimension':
      validateUnitValue(value, DIMENSION_UNITS, errors, 'dimension');
      break;
    case 'duration':
      validateUnitValue(value, DURATION_UNITS, errors, 'duration');
      if (isObject(value) && value.value < 0) errors.push('duration must not be negative');
      break;
    case 'number':
      if (!isNumber(value)) errors.push('number must be a finite number');
      break;
    case 'fontWeight':
      if (!Number.isInteger(value) || value < 1 || value > 1000) {
        errors.push('fontWeight must be an integer from 1 to 1000');
      }
      break;
    case 'fontFamily': {
      const list = Array.isArray(value) ? value : [value];
      if (!list.length || !list.every((f) => typeof f === 'string' && f.trim() !== '')) {
        errors.push('fontFamily must be a non-empty string or array of strings');
      } else if (list.some((f) => /[;{}<>\\\n]/.test(f))) {
        // These would end the declaration or block in the CSS output.
        errors.push('fontFamily names must not contain ; { } < > \\ or line breaks');
      }
      break;
    }
    case 'cubicBezier':
      if (!Array.isArray(value) || value.length !== 4 || !value.every(isNumber)) {
        errors.push('cubicBezier must be four numbers');
      } else if ([value[0], value[2]].some((x) => x < 0 || x > 1)) {
        errors.push('cubicBezier x values must be from 0 to 1');
      }
      break;
    case 'shadow': {
      const layers = Array.isArray(value) ? value : [value];
      for (const layer of layers) {
        if (!isObject(layer)) {
          errors.push('shadow layers must be objects');
          continue;
        }
        for (const key of Object.keys(layer)) {
          if (!(key in SHADOW_FIELDS) && key !== 'inset')
            errors.push(`unknown shadow field "${key}"`);
        }
        for (const [field, fieldType] of Object.entries(SHADOW_FIELDS)) {
          if (layer[field] === undefined) {
            errors.push(`shadow is missing "${field}"`);
            continue;
          }
          for (const error of validateValue(fieldType, layer[field])) {
            errors.push(`shadow ${field}: ${error}`);
          }
        }
        if (layer.inset !== undefined && typeof layer.inset !== 'boolean') {
          errors.push('shadow inset must be a boolean');
        }
      }
      break;
    }
    default:
      errors.push(`unsupported type "${type}"`);
  }
  return errors;
}

const trim = (n, digits = 4) => String(Number(n.toFixed(digits)));

function colorToCss(value) {
  const alpha = value.alpha ?? 1;
  if (value.colorSpace === 'oklch') {
    const [l, c, h] = value.components;
    const body = `${trim(l * 100)}% ${trim(c)} ${trim(h)}`;
    return alpha === 1 ? `oklch(${body})` : `oklch(${body} / ${trim(alpha)})`;
  }
  if (alpha === 1) return value.hex;
  const [r, g, b] = hexToComponents(value.hex).map((c) => Math.round(c * 255));
  return `rgb(${r} ${g} ${b} / ${trim(alpha)})`;
}

function familyToCss(name) {
  if (GENERIC_FAMILIES.has(name) || /^[A-Za-z][\w-]*$/.test(name)) return name;
  return `"${name.replace(/"/g, '\\"')}"`;
}

/**
 * Converts a value to CSS. `ref(path)` supplies the CSS for an alias, usually
 * `var(--apui-...)`.
 */
export function toCss(type, value, ref) {
  if (isAlias(value)) return ref(aliasTarget(value));

  switch (type) {
    case 'color':
      return colorToCss(value);
    case 'dimension':
      return value.value === 0 ? '0' : `${trim(value.value)}${value.unit}`;
    case 'duration':
      return `${trim(value.value)}${value.unit}`;
    case 'number':
    case 'fontWeight':
      return String(value);
    case 'fontFamily':
      return (Array.isArray(value) ? value : [value]).map(familyToCss).join(', ');
    case 'cubicBezier':
      return `cubic-bezier(${value.map((n) => trim(n)).join(', ')})`;
    case 'shadow': {
      const layers = Array.isArray(value) ? value : [value];
      if (!layers.length) return 'none';
      return layers
        .map((layer) =>
          [
            layer.inset ? 'inset' : null,
            toCss('dimension', layer.offsetX, ref),
            toCss('dimension', layer.offsetY, ref),
            toCss('dimension', layer.blur, ref),
            toCss('dimension', layer.spread, ref),
            toCss('color', layer.color, ref),
          ]
            .filter(Boolean)
            .join(' '),
        )
        .join(', ');
    }
    default:
      throw new Error(`unsupported type "${type}"`);
  }
}
