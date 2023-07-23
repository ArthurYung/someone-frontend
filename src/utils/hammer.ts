import Hammer from 'hammerjs';

let currentManager: HammerManager

function initManager() {
  if (!currentManager) {
    currentManager = new Hammer(document.body)
  }

  return currentManager;
}

export function createHammerWatch(type: string, cb: (ev: HammerInput) => void) {
  const manager = initManager();
  manager.on(type, cb);
  return () => {
    manager.off(type, cb);
  }
}
