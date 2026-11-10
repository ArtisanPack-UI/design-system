/* global figma */
/**
 * Builds the Reference page in the tokens Figma file (#28): specimens of every
 * foundation and a preset × theme matrix of sample UI, all bound to the
 * variables `sync-variables.js` writes. Nothing on it is a hard-coded value,
 * so it follows the variables after every sync.
 *
 * Idempotent: it removes the nodes it made before (named `apui/…`) and builds
 * them again. Anything else on the page is left alone.
 *
 *   await apuiBuildReferencePage()
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- called by the plugin and the chunks
async function apuiBuildReferencePage({ pageName = 'Reference' } = {}) {
  const api = figma.variables;
  const collections = await api.getLocalVariableCollectionsAsync();
  const variables = await api.getLocalVariablesAsync();
  const collection = (name) => {
    const found = collections.find((c) => c.name === name);
    if (!found) throw new Error(`Collection "${name}" is missing. Sync the variables first.`);
    return found;
  };
  const tokens = collection('Tokens');
  const theme = collection('Theme');
  const density = collection('Density');
  const ids = new Map(collections.map((c) => [c.id, c.name]));
  const index = new Map(variables.map((v) => [`${ids.get(v.variableCollectionId)}/${v.name}`, v]));

  /** A variable by token path, looked up in the collection that holds it. */
  const v = (path) => {
    const name = path.split('.').join('/');
    for (const key of [
      `Theme/${name}`,
      `Density/${name}`,
      `Tokens/semantic/${name}`,
      `Tokens/component/${name}`,
      `Tokens/primitive/${name}`,
    ]) {
      if (index.has(key)) return index.get(key);
    }
    throw new Error(`No variable for ${path}`);
  };
  const has = (path) => {
    try {
      v(path);
      return true;
    } catch {
      return false;
    }
  };
  const names = (prefix, source = 'Theme') =>
    variables
      .filter((x) => ids.get(x.variableCollectionId) === source && x.name.startsWith(prefix))
      .filter((x) => !x.hiddenFromPublishing)
      .map((x) => x.name);

  // Fonts: every family the font-family variables hold in any preset, in the
  // weights the type styles use. Text binds to those variables, so each one
  // has to be loaded before binding.
  const familyNames = new Set();
  const visited = new Set();
  const collect = async (value) => {
    if (typeof value === 'string') {
      familyNames.add(value);
      return;
    }
    if (!value || value.type !== 'VARIABLE_ALIAS' || visited.has(value.id)) return;
    visited.add(value.id);
    const target = await api.getVariableByIdAsync(value.id);
    // Every mode: the alias resolves in whichever preset a frame uses.
    for (const next of Object.values(target?.valuesByMode ?? {})) await collect(next);
  };
  for (const variable of variables) {
    if (variable.resolvedType !== 'STRING' || !variable.scopes.includes('FONT_FAMILY')) continue;
    for (const value of Object.values(variable.valuesByMode)) await collect(value);
  }
  const available = await figma.listAvailableFontsAsync();
  for (const family of familyNames) {
    for (const style of ['Regular', 'Medium', 'SemiBold', 'Bold']) {
      if (available.some((f) => f.fontName.family === family && f.fontName.style === style)) {
        await figma.loadFontAsync({ family, style });
      }
    }
  }

  // The page: reuse it, or the only empty page of a new file.
  let page = figma.root.children.find((p) => p.name === pageName);
  if (!page) {
    const blank = figma.root.children.length === 1 && figma.root.children[0].children.length === 0;
    page = blank ? figma.root.children[0] : figma.createPage();
    page.name = pageName;
  }
  await figma.setCurrentPageAsync(page);
  for (const node of [...page.children]) if (node.name.startsWith('apui/')) node.remove();

  // ---------------------------------------------------------------------------
  // Helpers. Every visual value is a variable.

  const paint = (path) =>
    api.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v(path));
  const fill = (node, path) => {
    node.fills = path ? [paint(path)] : [];
  };
  const stroke = (node, path) => {
    node.strokes = [paint(path)];
    node.setBoundVariable('strokeWeight', v('border.width'));
    node.strokeAlign = 'INSIDE';
  };
  const radius = (node, path) => {
    for (const corner of [
      'topLeftRadius',
      'topRightRadius',
      'bottomLeftRadius',
      'bottomRightRadius',
    ]) {
      node.setBoundVariable(corner, v(path));
    }
  };
  const padding = (node, path, pathY = path) => {
    node.setBoundVariable('paddingLeft', v(path));
    node.setBoundVariable('paddingRight', v(path));
    node.setBoundVariable('paddingTop', v(pathY));
    node.setBoundVariable('paddingBottom', v(pathY));
  };
  const stack = (name, direction = 'VERTICAL', props = {}) => {
    const frame = figma.createAutoLayout(direction, { name, ...props });
    frame.fills = [];
    return frame;
  };
  const append = (parent, ...children) => {
    for (const child of children) parent.appendChild(child);
    return parent;
  };
  /** Text in a type style (`type.body-md`), bound to its family, size, line height and weight. */
  const text = (characters, style = 'body-md', color = 'text.default') => {
    const node = figma.createText();
    node.fontName = { family: 'Geist', style: 'Regular' };
    node.characters = characters;
    const base = `type.${style}`;
    node.setBoundVariable('fontFamily', v(`${base}.font-family`));
    node.setBoundVariable('fontSize', v(`${base}.font-size`));
    node.setBoundVariable('lineHeight', v(`${base}.line-height`));
    node.setBoundVariable('fontWeight', v(`${base}.font-weight`));
    fill(node, color);
    return node;
  };
  const caption = (characters) => text(characters, 'code-sm', 'text.muted');
  const section = (title, description) => {
    const frame = stack(`apui/section/${title}`, 'VERTICAL', { itemSpacing: 24 });
    append(frame, text(title, 'heading-lg'));
    if (description) {
      const note = text(description, 'body-md', 'text.muted');
      frame.appendChild(note);
      note.textAutoResize = 'HEIGHT';
      note.layoutSizingHorizontal = 'FILL';
    }
    return frame;
  };
  const wrapRow = (name) => {
    const row = stack(name, 'HORIZONTAL', { itemSpacing: 16, counterAxisSpacing: 16 });
    row.layoutWrap = 'WRAP';
    return row;
  };
  const fillWidth = (child) => {
    child.layoutSizingHorizontal = 'FILL';
    return child;
  };
  const modes = (node, preset, themeMode, densityMode) => {
    const mode = (c, name) => c.modes.find((m) => m.name === name)?.modeId;
    if (preset) node.setExplicitVariableModeForCollection(tokens, mode(tokens, preset));
    if (themeMode) node.setExplicitVariableModeForCollection(theme, mode(theme, themeMode));
    if (densityMode) node.setExplicitVariableModeForCollection(density, mode(density, densityMode));
  };

  // A swatch: a tile in the color, with its name.
  const swatch = (name, isText = false) => {
    const tile = stack(`swatch/${name}`, 'VERTICAL', { itemSpacing: 8 });
    const chip = figma.createFrame();
    chip.name = 'chip';
    if (isText) {
      chip.layoutMode = 'HORIZONTAL';
      chip.primaryAxisAlignItems = 'CENTER';
      chip.counterAxisAlignItems = 'CENTER';
    }
    // After layoutMode, which would otherwise hug the chip to its content.
    chip.resize(140, 64);
    if (isText) {
      chip.primaryAxisSizingMode = 'FIXED';
      chip.counterAxisSizingMode = 'FIXED';
    }
    radius(chip, 'radius.field');
    stroke(chip, 'border.muted');
    if (isText) {
      // Inverse text is meant for the inverse surface.
      fill(chip, name === 'text/inverse' ? 'surface.inverse' : 'surface.default');
      chip.appendChild(text('Aa', 'heading-lg', name.split('/').join('.')));
    } else {
      fill(chip, name.split('/').join('.'));
    }
    append(tile, chip, caption(name));
    return tile;
  };

  // Sample UI, built from semantic and component tokens like the components.
  const button = (label, variant) => {
    const node = stack(`button/${variant}`, 'HORIZONTAL', {
      primaryAxisAlignItems: 'CENTER',
      counterAxisAlignItems: 'CENTER',
    });
    node.setBoundVariable('height', v('control-height.md'));
    node.counterAxisSizingMode = 'FIXED';
    padding(node, 'space.4', 'space.0');
    radius(node, 'button.radius');
    const colors = {
      solid: ['color.primary', 'color.primary-foreground'],
      soft: ['color.primary-soft', 'color.primary-soft-foreground'],
      outline: [null, 'text.default'],
      danger: ['color.error', 'color.error-foreground'],
    }[variant];
    fill(node, colors[0]);
    if (variant === 'outline') stroke(node, 'border.default');
    const label_ = text(label, 'label-md', colors[1]);
    label_.setBoundVariable('fontWeight', v('button.weight'));
    node.appendChild(label_);
    return node;
  };
  const badge = (label, role) => {
    const node = stack(`badge/${role}`, 'HORIZONTAL');
    padding(node, 'space.2', 'space.0-5');
    radius(node, 'badge.radius');
    fill(node, `color.${role}-soft`);
    node.appendChild(text(label, 'label-xs', `color.${role}-soft-foreground`));
    return node;
  };
  const input = (placeholder) => {
    const field = stack('field', 'VERTICAL', { itemSpacing: 4 });
    const control = stack('input', 'HORIZONTAL', { counterAxisAlignItems: 'CENTER' });
    control.setBoundVariable('height', v('control-height.md'));
    control.counterAxisSizingMode = 'FIXED';
    padding(control, 'space.3', 'space.0');
    radius(control, 'input.radius');
    fill(control, 'surface.default');
    stroke(control, 'border.default');
    control.appendChild(text(placeholder, 'body-md', 'text.muted'));
    append(field, text('Email', 'label-md'));
    field.appendChild(control);
    fillWidth(control);
    return field;
  };
  const card = () => {
    const node = stack('card', 'VERTICAL');
    node.setBoundVariable('itemSpacing', v('panel.gap'));
    padding(node, 'card.padding');
    radius(node, 'card.radius');
    fill(node, 'surface.default');
    stroke(node, 'border.muted');
    node.resize(360, node.height);
    node.primaryAxisSizingMode = 'AUTO';
    const eyebrow = text('Orders', 'eyebrow', 'text.muted');
    eyebrow.textCase = 'UPPER';
    append(node, eyebrow, text('Recent orders', 'heading-md'));
    const body = text(
      'Totals update as payments settle. Edit an order to change it.',
      'body-sm',
      'text.muted',
    );
    node.appendChild(body);
    body.textAutoResize = 'HEIGHT';
    fillWidth(body);
    const badges = stack('badges', 'HORIZONTAL', { itemSpacing: 8 });
    append(badges, badge('Paid', 'success'), badge('Pending', 'warning'), badge('Failed', 'error'));
    node.appendChild(badges);
    const field = input('jordan@example.com');
    node.appendChild(field);
    fillWidth(field);
    const actions = stack('actions', 'HORIZONTAL', { itemSpacing: 8 });
    append(
      actions,
      button('Save', 'solid'),
      button('Preview', 'soft'),
      button('Cancel', 'outline'),
    );
    node.appendChild(actions);
    return node;
  };

  // ---------------------------------------------------------------------------
  // The page

  const root = stack('apui/Reference', 'VERTICAL', { itemSpacing: 64 });
  root.resize(1600, root.height);
  root.primaryAxisSizingMode = 'AUTO';
  root.counterAxisSizingMode = 'FIXED';
  padding(root, 'space.16');
  fill(root, 'surface.page');
  modes(root, 'Strata', 'Light', 'Default');
  root.x = 0;
  root.y = 0;

  // Header
  const header = stack('header', 'VERTICAL', { itemSpacing: 12 });
  append(header, text('ArtisanPack UI Design System · Tokens', 'display-lg'));
  const intro = text(
    'Every value on this page is a variable generated from the DTCG tokens in packages/tokens. Figma follows the code: change tokens there and sync, never here. Select any frame and switch its Tokens (preset), Theme and Density modes in the right-hand panel to see the system change.',
    'body-lg',
    'text.muted',
  );
  header.appendChild(intro);
  intro.textAutoResize = 'HEIGHT';
  intro.layoutSizingHorizontal = 'FILL';
  root.appendChild(header);
  fillWidth(header);

  // Presets × themes
  const matrix = section(
    'Presets × themes',
    'The same sample UI under each preset (rows) and theme (columns). Each cell only sets its Tokens and Theme modes.',
  );
  const presetModes = tokens.modes.map((m) => m.name);
  const themeModes = theme.modes.map((m) => m.name);
  for (const preset of presetModes) {
    const row = stack(`row/${preset}`, 'HORIZONTAL', { itemSpacing: 16 });
    for (const themeMode of themeModes) {
      const cell = stack(`cell/${preset}/${themeMode}`, 'VERTICAL', { itemSpacing: 12 });
      padding(cell, 'space.6');
      radius(cell, 'radius.surface');
      fill(cell, 'surface.page');
      stroke(cell, 'border.muted');
      modes(cell, preset, themeMode);
      append(cell, text(`${preset} · ${themeMode}`, 'label-sm', 'text.muted'), card());
      row.appendChild(cell);
    }
    matrix.appendChild(row);
  }
  root.appendChild(matrix);

  // Color
  const color = section(
    'Color',
    'Theme variables. Switch the Theme mode on this frame to compare.',
  );
  const groups = [
    ['Surfaces', names('surface/').filter((n) => !n.endsWith('border'))],
    ['Text', names('text/'), true],
    [
      'Edges and states',
      [
        ...names('border/'),
        ...names('focus-ring/'),
        ...names('state/'),
        ...names('selected/'),
        'backdrop',
      ],
    ],
    ['Charts', names('chart/')],
  ];
  for (const [title, list, isText] of groups) {
    const block = stack(`group/${title}`, 'VERTICAL', { itemSpacing: 12 });
    const row = wrapRow('swatches');
    for (const name of list) row.appendChild(swatch(name, isText));
    append(block, text(title, 'heading-sm'));
    block.appendChild(row);
    fillWidth(row);
    color.appendChild(block);
    fillWidth(block);
  }
  const roles = stack('group/Roles', 'VERTICAL', { itemSpacing: 12 });
  roles.appendChild(text('Roles', 'heading-sm'));
  for (const role of [
    'primary',
    'secondary',
    'accent',
    'neutral',
    'success',
    'warning',
    'error',
    'info',
  ]) {
    if (!has(`color.${role}`)) continue;
    const row = stack(`role/${role}`, 'HORIZONTAL', {
      itemSpacing: 8,
      counterAxisAlignItems: 'CENTER',
    });
    const chip = (label, bg, fg, outline) => {
      const node = stack('chip', 'HORIZONTAL');
      padding(node, 'space.3', 'space.1');
      radius(node, 'chip.radius');
      fill(node, bg);
      if (outline) stroke(node, outline);
      node.appendChild(text(label, 'label-sm', fg));
      return node;
    };
    append(
      row,
      chip(`${role} solid`, `color.${role}`, `color.${role}-foreground`),
      chip('soft', `color.${role}-soft`, `color.${role}-soft-foreground`),
      chip('outline', null, `color.${role}-text`, `color.${role}-border`),
    );
    roles.appendChild(row);
  }
  color.appendChild(roles);
  root.appendChild(color);

  // Typography
  const type = section(
    'Typography',
    'Each type style, bound to its family, size, line height and weight. The family follows the preset.',
  );
  const styles = [...new Set(names('semantic/type/', 'Tokens').map((n) => n.split('/')[2]))];
  for (const style of styles) {
    const row = stack(`type/${style}`, 'HORIZONTAL', {
      itemSpacing: 24,
      counterAxisAlignItems: 'BASELINE',
    });
    const label = caption(`type.${style}`);
    label.resize(180, label.height);
    label.textAutoResize = 'HEIGHT';
    const sample = /^(stat|num)/.test(style)
      ? '$48,250.75'
      : /^code/.test(style)
        ? 'apui-generate-preset --name acme'
        : 'Ship calm, legible interfaces';
    const specimen = text(sample, style);
    if (style === 'eyebrow') specimen.textCase = 'UPPER';
    append(row, label, specimen);
    type.appendChild(row);
  }
  root.appendChild(type);

  // Spacing
  const space = section('Spacing', 'The space scale. Bars are bound to the primitives.');
  for (const name of names('primitive/space/', 'Tokens')) {
    const row = stack(`space/${name}`, 'HORIZONTAL', {
      itemSpacing: 16,
      counterAxisAlignItems: 'CENTER',
    });
    const label = caption(name.replace('primitive/', ''));
    label.resize(120, label.height);
    label.textAutoResize = 'HEIGHT';
    const bar = figma.createRectangle();
    bar.name = 'bar';
    bar.resize(1, 12);
    bar.setBoundVariable('width', index.get(`Tokens/${name}`));
    fill(bar, 'color.primary');
    append(row, label, bar);
    space.appendChild(row);
  }
  root.appendChild(space);

  // Radius
  const radii = section(
    'Radius',
    'Semantic and component radii. Ledger squares them, Harbor softens them.',
  );
  const radiusRow = wrapRow('radii');
  const radiusNames = [
    ...names('semantic/radius/', 'Tokens'),
    ...names('component/', 'Tokens').filter((n) => n.endsWith('/radius')),
  ];
  for (const name of radiusNames) {
    const tile = stack(`radius/${name}`, 'VERTICAL', { itemSpacing: 8 });
    const box = figma.createRectangle();
    box.name = 'box';
    box.resize(120, 72);
    radius(
      box,
      name
        .replace(/^(semantic|component)\//, '')
        .split('/')
        .join('.'),
    );
    fill(box, 'color.primary-soft');
    stroke(box, 'color.primary-border');
    append(tile, box, caption(name.replace(/^(semantic|component)\//, '')));
    radiusRow.appendChild(tile);
  }
  radii.appendChild(radiusRow);
  fillWidth(radiusRow);
  root.appendChild(radii);

  // Density
  const dense = section(
    'Density',
    'Panel padding, gap and row height follow the Density mode; control sizes do not.',
  );
  const densityRow = stack('densities', 'HORIZONTAL', { itemSpacing: 24 });
  for (const mode of density.modes.map((m) => m.name)) {
    const panel = stack(`density/${mode}`, 'VERTICAL');
    modes(panel, null, null, mode);
    panel.setBoundVariable('itemSpacing', v('panel.gap'));
    padding(panel, 'panel.padding');
    radius(panel, 'card.radius');
    fill(panel, 'surface.default');
    stroke(panel, 'border.muted');
    panel.appendChild(text(mode, 'heading-sm'));
    for (const row of ['Order 1042', 'Order 1041', 'Order 1040']) {
      const line = stack('row', 'HORIZONTAL', { counterAxisAlignItems: 'CENTER' });
      line.resize(240, 40);
      line.setBoundVariable('height', v('row.height'));
      line.counterAxisSizingMode = 'FIXED';
      padding(line, 'cell.padding-x', 'space.0');
      fill(line, 'surface.sunken');
      radius(line, 'radius.field');
      line.appendChild(text(row, 'body-sm'));
      panel.appendChild(line);
    }
    densityRow.appendChild(panel);
  }
  dense.appendChild(densityRow);
  root.appendChild(dense);

  // Notes
  const notes = section(
    'Not shown as variables',
    'Shadows (elevation.*), easings (motion.ease-*), letter spacing in em and measure in ch are string variables holding the CSS value: Figma has no variable type for them. Durations are numbers in milliseconds.',
  );
  root.appendChild(notes);

  for (const child of root.children) child.layoutSizingHorizontal = 'FILL';
  return { pageId: page.id, rootId: root.id, height: Math.round(root.height) };
}
