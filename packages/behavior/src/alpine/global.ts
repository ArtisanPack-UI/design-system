/**
 * The Alpine adapter as a classic script, for pages without a bundler: the
 * prebuilt asset Livewire UI Components publishes (#42, D-014). It registers
 * itself when Alpine starts, so load it before Livewire's script.
 */
import apuiBehavior from './index';

type AlpineWindow = Window & {
  Alpine?: Parameters<typeof apuiBehavior>[0];
  __apuiBehavior?: boolean;
};

const host = window as AlpineWindow;

function register() {
  if (host.__apuiBehavior || !host.Alpine) return;
  host.__apuiBehavior = true;
  host.Alpine.plugin(apuiBehavior);
}

if (host.Alpine) register();
else document.addEventListener('alpine:init', register);
