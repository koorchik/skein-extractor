import vm from 'vm';

/**
 * Test harness for the self-contained HTML viewers: runs a page's inline script against a minimal
 * DOM stub, so a test can drive the controls and read what the page rendered. Only what the
 * viewers use is stubbed (getElementById, innerHTML/textContent/value/hidden, listeners). Test
 * code only; nothing in the viewers imports it.
 */
export interface FakeElement {
  id: string;
  innerHTML: string;
  textContent: string;
  value: string;
  hidden: boolean;
  max: string;
  style: Record<string, string>;
  dataset: Record<string, string>;
  listeners: Record<string, Array<(event: unknown) => void>>;
  onclick: ((event: unknown) => void) | null;
  addEventListener(type: string, listener: (event: unknown) => void): void;
}

export interface ViewerHarness {
  el(id: string): FakeElement;
  /** Calls the listeners (and onclick for 'click') of an element. `event.target` defaults to the element. */
  fire(id: string, type: string, event?: Record<string, unknown>): void;
  /** Event whose target resolves `closest()` to an element carrying this dataset (a map point, a table row). */
  over(dataset: Record<string, string>): Record<string, unknown>;
  /** The URL fragment as the page last wrote it. */
  hash(): string;
}

/** `hash`: the URL fragment the page is opened with, e.g. '#run=a&cmp=b'. */
export function runViewer(html: string, hash = ''): ViewerHarness {
  const payload = /<script id="data" type="application\/json">([\s\S]*?)<\/script>/.exec(html);
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  if (!payload || scripts.length === 0) throw new Error('viewer page has no data block or no inline script');

  const elements = new Map<string, FakeElement>();
  const el = (id: string): FakeElement => {
    if (!elements.has(id)) {
      const element: FakeElement = {
        id, innerHTML: '', textContent: '', value: '', hidden: false, max: '', style: {}, dataset: {}, listeners: {}, onclick: null,
        addEventListener(type, listener) {
          (this.listeners[type] ??= []).push(listener);
        },
      };
      elements.set(id, element);
    }
    return elements.get(id)!;
  };
  el('data').textContent = payload[1];
  for (const match of html.matchAll(/<[a-z0-9]+[^>]*\sid="([^"]+)"[^>]*\shidden[\s>]/g)) el(match[1]).hidden = true;

  const context: Record<string, any> = { document: { getElementById: el }, window: { innerWidth: 1200, innerHeight: 800 }, location: { hash }, history: { replaceState: (_state: unknown, _title: string, url: string) => { context.location.hash = url; } }, setInterval: () => 0, clearInterval: () => undefined, console };
  for (const script of scripts) vm.runInNewContext(script[1], context);

  return {
    el,
    hash: () => context.location.hash,
    fire(id, type, event = {}) {
      const target = el(id);
      const full = { target, clientX: 0, clientY: 0, ...event };
      for (const listener of target.listeners[type] ?? []) listener(full);
      if (type === 'click' && target.onclick) target.onclick(full);
    },
    over(dataset) {
      return { target: { closest: () => ({ dataset }) } };
    },
  };
}
