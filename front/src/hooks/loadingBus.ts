type Listener = (busy: boolean) => void;

let inflight = 0;
let listeners = new Set<Listener>();
let showUntil = 0;
const MIN_SHOW_MS = 120;
const DELAY_SHOW_MS = 120;
let showTimer: number | null = null;

function update() {
  const busy = inflight > 0 || Date.now() < showUntil;
  listeners.forEach((fn) => fn(busy));
}

export function startGlobalLoading() {
  inflight += 1;
  if (inflight === 1) {
    if (showTimer) clearTimeout(showTimer);
    showTimer = window.setTimeout(() => {
      showUntil = Date.now() + MIN_SHOW_MS;
      update();
    }, DELAY_SHOW_MS);
  } else {
    update();
  }
}

export function stopGlobalLoading() {
  inflight = Math.max(0, inflight - 1);
  if (inflight === 0) {
    if (showTimer) {
      clearTimeout(showTimer);
      showTimer = null;
    }
    update();
    const remain = Math.max(0, showUntil - Date.now());
    if (remain > 0) setTimeout(() => update(), remain + 1);
  } else {
    update();
  }
}

export function subscribeGlobalLoading(l: Listener): () => void {
  listeners.add(l);
  l(inflight > 0 || Date.now() < showUntil);
  return () => {
    listeners.delete(l);
  };
}
