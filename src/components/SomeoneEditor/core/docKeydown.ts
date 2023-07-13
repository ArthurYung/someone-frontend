const docKeydownListeners = new Map<string, {fn: () => boolean | void, cmds?: string[]}>();

function documentKeydownListener(e: KeyboardEvent) {
  console.log(e);
  if (!docKeydownListeners.has(e.key)) return 
  const { fn, cmds } = docKeydownListeners.get(e.key)!;
  fn() === false && e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation();
}

function startDocumentListener() {
  document.addEventListener('keydown', documentKeydownListener, true);
}

function stopDocumentListener() {
  document.removeEventListener('keydown', documentKeydownListener, true);
}

export function createKeydownListener(key: string, fn: () => boolean | void, cmds?: string[]) {
  if (!docKeydownListeners.size) {
    startDocumentListener();
  }

  docKeydownListeners.set(key, { fn, cmds })
}

export function removeKeydownListener(key: string) {
  docKeydownListeners.delete(key);
  if (!key.length) {
    stopDocumentListener();
  }
}