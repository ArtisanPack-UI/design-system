/**
 * Token playground (#29). A classic script: it reads the token map from
 * `window.APUI_TOKENS` (dist/tokens.js) and drives the preview with the same
 * attributes and custom properties an app uses: `data-preset`, `data-theme`,
 * `data-density`, `dir`, and `--apui-*` overrides.
 */
(function () {
  'use strict';

  const data = window.APUI_TOKENS;
  const stage = document.getElementById('pg-stage');
  const tokens = new Map(data.tokens.map((token) => [token.path, token]));
  const presets = new Map(data.presets.map((preset) => [preset.name, preset]));
  const ROLES = [
    'primary',
    'secondary',
    'accent',
    'neutral',
    'success',
    'warning',
    'error',
    'info',
  ];

  const state = {
    preset: '',
    theme: data.axes.theme.default,
    density: data.axes.density.default,
    dir: 'ltr',
    overrides: new Map(),
  };

  // ---------------------------------------------------------------------------
  // Helpers

  const cssVar = (path) => tokens.get(path).cssVar;
  const ref = (path) => `var(${cssVar(path)})`;
  const label = (name) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ') : '';
  const paths = (prefix, tier) =>
    data.tokens
      .filter((t) => t.path.startsWith(prefix) && (!tier || t.tier === tier))
      .map((t) => t.path);

  /** Creates an element. `props` sets attributes, except `text`, `style` and `on*`. */
  function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (value === undefined || value === null || value === false) continue;
      if (key === 'text') node.textContent = value;
      else if (key === 'style') {
        for (const [name, v] of Object.entries(value)) if (v !== undefined) node.style[name] = v;
      } else if (key === 'vars')
        for (const [name, v] of Object.entries(value)) node.style.setProperty(name, v);
      else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value === true ? '' : value);
    }
    node.append(...children.flat().filter((child) => child !== null && child !== undefined));
    return node;
  }

  /** A span that shows a token's computed value on the preview, kept current by refresh(). */
  const valueOf = (path) => el('code', { class: 'pg-value', 'data-pg-value': cssVar(path) });

  const computed = (name) => getComputedStyle(stage).getPropertyValue(name).trim();

  /** A CSS color as #rrggbb, or null when it isn't opaque. Works for any color syntax. */
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  function toHex(color) {
    if (!color) return null;
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = '#000';
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
    if (a !== 255) return null;
    return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
  }

  // ---------------------------------------------------------------------------
  // Applying state to the preview

  /** The value a token is declared with in the current preset and modes, with aliases as var(). */
  function declared(token) {
    const preset = state.preset && presets.get(state.preset);
    const value = preset && token.path in preset.values ? preset.values[token.path] : token.value;
    return value && typeof value === 'object' ? value[state[token.axis]] : value;
  }

  const inline = new Set();

  /**
   * Writes the overrides onto the preview. A custom property is computed where
   * it's declared, so overriding `--apui-radius-control` here wouldn't reach
   * `--apui-button-radius`, which is declared on :root. While there are
   * overrides, every token that aliases another is declared again on the
   * preview, with the value for the current preset and modes, so the
   * overrides cascade the way they would in an app's own scope.
   */
  function applyOverrides() {
    for (const name of inline) stage.style.removeProperty(name);
    inline.clear();
    if (state.overrides.size) {
      for (const token of data.tokens) {
        if (state.overrides.has(token.path)) continue;
        const value = declared(token);
        if (typeof value === 'string' && value.includes('var(')) {
          stage.style.setProperty(token.cssVar, value);
          inline.add(token.cssVar);
        }
      }
      for (const [path, value] of state.overrides) {
        stage.style.setProperty(cssVar(path), value);
        inline.add(cssVar(path));
      }
    }
    renderOverrides();
    refresh();
  }

  function apply() {
    if (state.preset) stage.setAttribute(data.presetAttribute, state.preset);
    else stage.removeAttribute(data.presetAttribute);
    stage.setAttribute(data.axes.theme.attribute, state.theme);
    stage.setAttribute(data.axes.density.attribute, state.density);
    stage.setAttribute('dir', state.dir);

    const params = new URLSearchParams();
    if (state.preset) params.set('preset', state.preset);
    if (state.theme !== data.axes.theme.default) params.set('theme', state.theme);
    if (state.density !== data.axes.density.default) params.set('density', state.density);
    if (state.dir !== 'ltr') params.set('dir', state.dir);
    const query = params.toString();
    try {
      history.replaceState(null, '', query ? `?${query}` : location.pathname);
    } catch {
      // file:// in some browsers refuses replaceState; the page still works.
    }
    applyOverrides();
  }

  /** Updates every displayed value and editor row from the preview's computed style. */
  function refresh() {
    for (const node of document.querySelectorAll('[data-pg-value]')) {
      node.textContent = computed(node.getAttribute('data-pg-value')) || '—';
    }
    for (const row of document.querySelectorAll('[data-pg-token]')) {
      const path = row.getAttribute('data-pg-token');
      const token = tokens.get(path);
      const value = computed(token.cssVar);
      const text = row.querySelector('input[type="text"]');
      text.placeholder = value;
      if (document.activeElement !== text) text.value = state.overrides.get(path) ?? '';
      row.classList.toggle('pg-token-overridden', state.overrides.has(path));
      const swatch = row.querySelector('input[type="color"]');
      if (swatch) {
        const hex = toHex(value);
        swatch.disabled = hex === null;
        if (hex) swatch.value = hex;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Controls

  function segmented(fieldset, name, options, current, onChange) {
    const segments = el('span', { class: 'pg-segments' });
    fieldset.append(segments);
    for (const option of options) {
      const id = `pg-${name}-${option.value}`;
      segments.append(
        el(
          'span',
          { class: 'pg-segment' },
          el('input', {
            type: 'radio',
            id,
            name,
            value: option.value,
            checked: option.value === current,
            onchange: () => onChange(option.value),
          }),
          el('label', { for: id, text: option.label }),
        ),
      );
    }
  }

  function initControls() {
    const params = new URLSearchParams(location.search);
    const pick = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback);
    state.preset = pick(params.get('preset'), [...presets.keys()], '');
    state.theme = pick(params.get('theme'), data.axes.theme.modes, state.theme);
    state.density = pick(params.get('density'), data.axes.density.modes, state.density);
    state.dir = pick(params.get('dir'), ['ltr', 'rtl'], 'ltr');

    const preset = document.getElementById('pg-preset');
    preset.append(el('option', { value: '', text: 'Strata (default)' }));
    for (const { name, description } of data.presets) {
      preset.append(
        el('option', { value: name, text: label(name), title: description || undefined }),
      );
    }
    preset.value = state.preset;
    preset.addEventListener('change', () => {
      state.preset = preset.value;
      apply();
    });

    const modes = (axis) =>
      data.axes[axis].modes.map((mode) => ({ value: mode, label: label(mode) }));
    segmented(
      document.getElementById('pg-theme'),
      'theme',
      modes('theme'),
      state.theme,
      (value) => {
        state.theme = value;
        apply();
      },
    );
    segmented(
      document.getElementById('pg-density'),
      'density',
      modes('density'),
      state.density,
      (value) => {
        state.density = value;
        apply();
      },
    );
    segmented(
      document.getElementById('pg-dir'),
      'dir',
      [
        { value: 'ltr', label: 'LTR' },
        { value: 'rtl', label: 'RTL' },
      ],
      state.dir,
      (value) => {
        state.dir = value;
        apply();
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Token editor

  function renderEditor() {
    const list = document.getElementById('pg-token-list');
    const filter = document.getElementById('pg-filter').value.trim().toLowerCase();
    const tier = document.getElementById('pg-tier').value;
    list.replaceChildren();

    const groups = new Map();
    for (const token of data.tokens) {
      if (token.tier !== tier) continue;
      if (filter && !token.path.includes(filter) && !token.cssVar.includes(filter)) continue;
      const group = token.path.split('.')[0];
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(token);
    }
    if (!groups.size) {
      list.append(el('p', { class: 'pg-muted', text: 'No tokens match.' }));
      return;
    }

    for (const [group, members] of groups) {
      const details = el('details', { class: 'pg-group', open: filter ? true : undefined });
      details.append(el('summary', { text: `${group} (${members.length})` }));
      for (const token of members) details.append(tokenRow(token));
      list.append(details);
    }
    refresh();
  }

  function tokenRow(token) {
    const id = `pg-edit-${token.path.replace(/\./g, '-')}`;
    const set = (value) => {
      if (value) state.overrides.set(token.path, value);
      else state.overrides.delete(token.path);
      applyOverrides();
    };
    const text = el('input', {
      type: 'text',
      id,
      class: 'pg-input pg-token-input',
      spellcheck: 'false',
      autocomplete: 'off',
      onchange: (event) => set(event.target.value.trim()),
    });
    const controls = [text];
    if (token.type === 'color') {
      controls.unshift(
        el('input', {
          type: 'color',
          class: 'pg-swatch-input',
          'aria-label': `Pick ${token.path}`,
          oninput: (event) => set(event.target.value),
        }),
      );
    }
    controls.push(
      el('button', {
        type: 'button',
        class: 'pg-icon-button apui-focus-ring',
        'aria-label': `Reset ${token.path}`,
        title: 'Reset',
        text: '↺',
        onclick: () => set(''),
      }),
    );
    return el(
      'div',
      { class: 'pg-token', 'data-pg-token': token.path },
      el('label', { for: id, class: 'pg-token-name' }, el('code', { text: token.path })),
      el('div', { class: 'pg-token-controls' }, controls),
    );
  }

  function renderOverrides() {
    const lines = [...state.overrides].map(([path, value]) => `  ${cssVar(path)}: ${value};`);
    // Overrides apply in every theme and preset as written, so say where they were made.
    const context = `/* Made with preset ${state.preset || 'Strata'}, theme ${state.theme}, density ${state.density}. As written, these apply in every theme. */`;
    document.getElementById('pg-overrides').textContent = lines.length
      ? `${context}\n:root {\n${lines.join('\n')}\n}`
      : '';
    const count = state.overrides.size;
    document.getElementById('pg-override-count').textContent = count
      ? `${count} token${count === 1 ? '' : 's'} overridden. Paste this into your app's CSS to keep them.`
      : 'None yet.';
  }

  function initEditor() {
    document.getElementById('pg-filter').addEventListener('input', renderEditor);
    document.getElementById('pg-tier').addEventListener('change', renderEditor);
    document.getElementById('pg-reset').addEventListener('click', () => {
      state.overrides.clear();
      applyOverrides();
    });
    document.getElementById('pg-copy').addEventListener('click', async (event) => {
      const button = event.currentTarget;
      try {
        await navigator.clipboard.writeText(document.getElementById('pg-overrides').textContent);
        button.textContent = 'Copied';
      } catch {
        button.textContent = 'Copy failed';
      }
      setTimeout(() => (button.textContent = 'Copy CSS'), 1500);
    });
    renderEditor();
  }

  // ---------------------------------------------------------------------------
  // Foundations

  function swatch(path, { text } = {}) {
    const token = tokens.get(path);
    const sample = text
      ? el('span', { class: 'pg-swatch pg-swatch-text', style: { color: ref(path) }, text: 'Aa' })
      : el('span', { class: 'pg-swatch', style: { background: ref(path) } });
    return el(
      'figure',
      { class: 'pg-tile' },
      sample,
      el('figcaption', {}, el('code', { text: token.path }), valueOf(path)),
    );
  }

  function group(title, ...children) {
    return el(
      'div',
      { class: 'pg-subsection' },
      el('h3', { class: 'pg-h3', text: title }),
      children,
    );
  }

  function renderColor() {
    const root = document.getElementById('pg-color');
    const colors = (prefix) =>
      paths(prefix, 'semantic').filter((p) => tokens.get(p).type === 'color');
    root.append(
      group(
        'Surfaces',
        el(
          'div',
          { class: 'pg-grid' },
          colors('surface.').map((p) => swatch(p)),
        ),
      ),
      group(
        'Text',
        el(
          'div',
          { class: 'pg-grid' },
          colors('text.').map((p) => swatch(p, { text: true })),
        ),
      ),
      group(
        'Edges and states',
        el(
          'div',
          { class: 'pg-grid' },
          [
            ...colors('border.'),
            ...colors('focus-ring.'),
            ...colors('state.'),
            ...colors('selected.'),
            'backdrop',
          ].map((p) => swatch(p)),
        ),
      ),
      group(
        'Roles',
        el(
          'div',
          { class: 'pg-roles' },
          ROLES.map((role) =>
            el(
              'div',
              { class: 'pg-role' },
              el('span', {
                class: 'pg-chip',
                style: { background: ref(`color.${role}`), color: ref(`color.${role}-foreground`) },
                text: `${label(role)} solid`,
              }),
              el('span', {
                class: 'pg-chip',
                style: {
                  background: ref(`color.${role}-soft`),
                  color: ref(`color.${role}-soft-foreground`),
                },
                text: 'Soft',
              }),
              el('span', {
                class: 'pg-chip pg-chip-outline',
                style: {
                  borderColor: ref(`color.${role}-border`),
                  color: ref(`color.${role}-text`),
                },
                text: 'Outline',
              }),
            ),
          ),
        ),
      ),
      group(
        'Charts',
        el(
          'div',
          { class: 'pg-grid' },
          colors('chart.').map((p) => swatch(p)),
        ),
      ),
      group(
        'Syntax',
        el(
          'pre',
          { class: 'pg-code-sample', dir: 'ltr' },
          el('span', {
            style: { color: ref('syntax.comment'), fontStyle: 'italic' },
            text: '// Token-driven\n',
          }),
          el('span', { style: { color: ref('syntax.keyword') }, text: 'const ' }),
          el('span', { style: { color: ref('syntax.property') }, text: 'theme' }),
          ' = ',
          el('span', { style: { color: ref('syntax.function') }, text: 'preset' }),
          '(',
          el('span', { style: { color: ref('syntax.string') }, text: "'ledger'" }),
          ', ',
          el('span', { style: { color: ref('syntax.number') }, text: '0.8' }),
          ');',
        ),
      ),
    );
  }

  function renderType() {
    const root = document.getElementById('pg-type');
    const styles = [...new Set(paths('type.').map((p) => p.split('.')[1]))];
    for (const name of styles) {
      const part = (prop) => ref(`type.${name}.${prop}`);
      root.append(
        el(
          'div',
          { class: 'pg-type-row' },
          el(
            'div',
            { class: 'pg-type-meta' },
            el('code', { text: `type.${name}` }),
            valueOf(`type.${name}.font-size`),
          ),
          el('p', {
            class: 'pg-type-sample',
            style: {
              fontFamily: part('font-family'),
              fontSize: part('font-size'),
              lineHeight: part('line-height'),
              fontWeight: part('font-weight'),
              letterSpacing: part('letter-spacing'),
              textTransform: name === 'eyebrow' ? 'uppercase' : undefined,
              fontVariantNumeric: /^(stat|num)/.test(name) ? 'tabular-nums' : undefined,
            },
            text: /^(stat|num)/.test(name)
              ? '$48,250.75'
              : /^code/.test(name)
                ? 'apui-generate-preset --name acme'
                : 'Ship calm, legible interfaces',
          }),
        ),
      );
    }
  }

  function renderSpace() {
    const root = document.getElementById('pg-space');
    const scale = paths('space.', 'primitive');
    root.append(
      group(
        'Space scale',
        el(
          'div',
          { class: 'pg-space-list' },
          scale.map((p) =>
            el(
              'div',
              { class: 'pg-space-row' },
              el('code', { text: p }),
              el('span', { class: 'pg-space-bar', style: { inlineSize: ref(p) } }),
              valueOf(p),
            ),
          ),
        ),
      ),
      group(
        'Density',
        el(
          'div',
          { class: 'pg-grid' },
          [
            'density',
            'panel.padding',
            'panel.gap',
            'row.height',
            'cell.padding-x',
            'field.gap',
          ].map((p) =>
            el(
              'figure',
              { class: 'pg-tile' },
              el('figcaption', {}, el('code', { text: p }), valueOf(p)),
            ),
          ),
        ),
        el(
          'div',
          { class: 'pg-density-demo' },
          [1, 2, 3].map((n) =>
            el(
              'div',
              { class: 'pg-density-card' },
              el('strong', { text: `Panel ${n}` }),
              el('span', { class: 'pg-muted', text: 'Padding and gap follow data-density.' }),
            ),
          ),
        ),
      ),
    );
  }

  function renderRadius() {
    const root = document.getElementById('pg-radius');
    const radii = [
      ...paths('radius.', 'semantic'),
      ...data.tokens
        .filter((t) => t.tier === 'component' && t.path.endsWith('.radius'))
        .map((t) => t.path),
    ];
    for (const p of radii) {
      root.append(
        el(
          'figure',
          { class: 'pg-tile' },
          el('span', { class: 'pg-radius-box', style: { borderRadius: ref(p) } }),
          el('figcaption', {}, el('code', { text: p }), valueOf(p)),
        ),
      );
    }
  }

  function renderElevation() {
    const root = document.getElementById('pg-elevation');
    for (const [p, surface] of [
      ['elevation.raised', 'surface.raised'],
      ['elevation.overlay', 'surface.overlay'],
      ['elevation.glass', 'surface.glass'],
    ]) {
      root.append(
        el(
          'figure',
          { class: 'pg-tile' },
          el('span', {
            class: 'pg-elevation-box',
            style: { boxShadow: ref(p), background: ref(surface) },
          }),
          el('figcaption', {}, el('code', { text: p }), valueOf(p)),
        ),
      );
    }
  }

  function renderMotion() {
    const root = document.getElementById('pg-motion');
    const durations = paths('motion.duration', 'semantic');
    const easings = paths('motion.ease', 'semantic');
    const tracks = [];
    for (const duration of durations) {
      for (const easing of easings) {
        const dot = el('span', {
          class: 'pg-motion-dot',
          style: { transitionDuration: ref(duration), transitionTimingFunction: ref(easing) },
        });
        tracks.push(
          el(
            'div',
            { class: 'pg-motion-row' },
            el('code', { text: `${duration.split('.')[1]} · ${easing.split('.')[1]}` }),
            el('span', { class: 'pg-motion-track' }, dot),
          ),
        );
      }
    }
    const play = el('button', {
      type: 'button',
      class: 'pg-button apui-focus-ring',
      'aria-pressed': 'false',
      text: 'Play',
      onclick: () => {
        const on = play.getAttribute('aria-pressed') !== 'true';
        play.setAttribute('aria-pressed', String(on));
        root.classList.toggle('pg-motion-on', on);
      },
    });
    root.append(
      el('p', {
        class: 'pg-muted',
        text: 'Durations and easings from the semantic motion tokens. Reduced motion turns movement off.',
      }),
      play,
      el('div', { class: 'pg-motion-list' }, tracks),
      el(
        'div',
        { class: 'pg-grid' },
        [...durations, ...easings].map((p) =>
          el(
            'figure',
            { class: 'pg-tile' },
            el('figcaption', {}, el('code', { text: p }), valueOf(p)),
          ),
        ),
      ),
    );
  }

  function renderFocus() {
    const root = document.getElementById('pg-focus');
    root.append(
      el('p', {
        class: 'pg-muted',
        text: 'Tab through these. The ring is 2px outside a 2px gap of the surface color, on every surface.',
      }),
      el(
        'div',
        { class: 'pg-focus-surfaces' },
        ['surface.page', 'surface.default', 'surface.sunken', 'surface.raised'].map((surface) =>
          el(
            'div',
            {
              class: 'pg-focus-surface',
              style: { background: ref(surface) },
              vars: { '--apui-focus-ring-offset-color': ref(surface) },
            },
            el('code', { text: surface }),
            el('button', {
              type: 'button',
              class: 'pg-btn pg-btn-solid apui-focus-ring',
              text: 'Button',
            }),
            el('span', { class: 'pg-btn pg-btn-outline pg-focus-forced', text: 'Forced focus' }),
          ),
        ),
      ),
      el(
        'div',
        { class: 'pg-grid' },
        paths('focus-ring.').map((p) =>
          el(
            'figure',
            { class: 'pg-tile' },
            el('figcaption', {}, el('code', { text: p }), valueOf(p)),
          ),
        ),
      ),
    );
  }

  function renderGlass() {
    const root = document.getElementById('pg-glass');
    root.append(
      el('p', {
        class: 'pg-muted',
        text: 'Glass is a surface (data-surface="glass"), not a theme. It falls back to the raised surface under reduced transparency and in high contrast.',
      }),
      el(
        'div',
        { class: 'pg-glass-backdrop' },
        el(
          'div',
          { class: 'pg-glass-card', 'data-surface': 'glass' },
          el('strong', { text: 'Revenue this week' }),
          el('span', { class: 'pg-glass-stat', text: '$48,250' }),
          el('span', { class: 'pg-glass-muted', text: 'Muted text uses text.muted-glass.' }),
        ),
      ),
    );
  }

  function renderSample() {
    // Static markup: no user data goes into it.
    document.getElementById('pg-sample').innerHTML = `
      <div class="pg-card">
        <div class="pg-card-header">
          <div>
            <p class="pg-eyebrow">Orders</p>
            <h3 class="pg-card-title">Recent orders</h3>
          </div>
          <div class="pg-tabs" role="group" aria-label="Order range">
            <button type="button" aria-pressed="true" class="pg-tab apui-focus-ring">Week</button>
            <button type="button" aria-pressed="false" class="pg-tab apui-focus-ring">Month</button>
            <button type="button" aria-pressed="false" class="pg-tab apui-focus-ring">Year</button>
          </div>
        </div>
        <div class="pg-table-wrap">
          <table class="pg-table">
            <thead><tr><th scope="col">Order</th><th scope="col">Customer</th><th scope="col">Status</th><th scope="col" class="pg-num">Total</th></tr></thead>
            <tbody>
              <tr><td><code>#1042</code></td><td>Amira Haddad</td><td><span class="pg-badge" data-color="success">Paid</span></td><td class="pg-num">$248.00</td></tr>
              <tr data-selected><td><code>#1041</code></td><td>Leo Park</td><td><span class="pg-badge" data-color="warning">Pending</span></td><td class="pg-num">$92.50</td></tr>
              <tr><td><code>#1040</code></td><td>Sofia Rossi</td><td><span class="pg-badge" data-color="error">Failed</span></td><td class="pg-num">$1,310.00</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="pg-card">
        <h3 class="pg-card-title">Account</h3>
        <form class="pg-form" onsubmit="return false">
          <div class="pg-field">
            <label for="pg-sample-name">Name</label>
            <input id="pg-sample-name" class="pg-field-input apui-focus-ring" value="Jordan Lee" />
          </div>
          <div class="pg-field">
            <label for="pg-sample-email">Email</label>
            <input id="pg-sample-email" class="pg-field-input apui-focus-ring" aria-invalid="true" aria-describedby="pg-sample-email-error" value="jordan@" />
            <span class="pg-field-error" id="pg-sample-email-error">Enter a full email address.</span>
          </div>
          <label class="pg-check"><input type="checkbox" class="apui-focus-ring" checked /> Email me receipts</label>
          <div class="pg-alert" data-color="info" role="note"><strong>Heads up.</strong> Changes apply to every workspace.</div>
          <div class="pg-row">
            <button type="button" class="pg-btn pg-btn-solid apui-focus-ring">Save</button>
            <button type="button" class="pg-btn pg-btn-soft apui-focus-ring">Preview</button>
            <button type="button" class="pg-btn pg-btn-outline apui-focus-ring">Cancel</button>
            <button type="button" class="pg-btn pg-btn-ghost apui-focus-ring">Help</button>
          </div>
        </form>
      </div>
      <div class="pg-card pg-overlay-card">
        <h3 class="pg-card-title">Delete project?</h3>
        <p class="pg-muted">This removes 12 pages and their history. You can't undo it.</p>
        <div class="pg-row">
          <button type="button" class="pg-btn pg-btn-danger apui-focus-ring">Delete</button>
          <button type="button" class="pg-btn pg-btn-outline apui-focus-ring">Keep</button>
        </div>
      </div>`;
  }

  // ---------------------------------------------------------------------------

  initControls();
  renderSample();
  // The sample's segmented control: one pressed button at a time.
  document.querySelector('.pg-tabs').addEventListener('click', (event) => {
    const pressed = event.target.closest('.pg-tab');
    if (!pressed) return;
    for (const tab of document.querySelectorAll('.pg-tab')) {
      tab.setAttribute('aria-pressed', String(tab === pressed));
    }
  });
  renderColor();
  renderType();
  renderSpace();
  renderRadius();
  renderElevation();
  renderMotion();
  renderFocus();
  renderGlass();
  initEditor();
  apply();
  document.documentElement.setAttribute('data-pg-ready', '');
})();
