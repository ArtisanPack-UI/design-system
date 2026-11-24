/**
 * The drag-and-drop engine on its own, for drag-and-drop.browser.test.ts:
 * exposes the module as `window.DnD` so tests register plain markup.
 */
import * as DnD from '../../src/widgets/drag-and-drop';

(window as unknown as { DnD: typeof DnD }).DnD = DnD;
