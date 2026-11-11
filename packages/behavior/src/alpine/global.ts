/**
 * The Alpine adapter as a classic script, for pages without a bundler: the
 * prebuilt asset Livewire UI Components publishes (#42, D-014). It registers
 * itself when Alpine starts, so load it before Livewire's script.
 */
import { keepClientState } from '../core/morph';
import apuiBehavior, { showToast } from './index';

/**
 * Marks registration. A symbol, not a named property, so page markup can't
 * fake it through DOM clobbering (`<img name="…">`) and stop the plugin loading.
 */
const REGISTERED = Symbol.for('artisanpack-ui.behavior');

type AlpineWindow = Window & {
  Alpine?: Parameters<typeof apuiBehavior>[0];
  ApuiBehavior?: { keepClientState: typeof keepClientState; toast: typeof showToast };
  [REGISTERED]?: boolean;
};

const host = window as AlpineWindow;

// keepClientState is for morph libraries other than Livewire's: call it
// before each element is patched. toast() shows a toast in the page's toaster.
host.ApuiBehavior = { keepClientState, toast: showToast };

/** Registers the plugin once, when Alpine is available. */
function register() {
  if (host[REGISTERED] || !host.Alpine) return;
  host[REGISTERED] = true;
  host.Alpine.plugin(apuiBehavior);
}

if (host.Alpine) register();
else document.addEventListener('alpine:init', register);
