export type KeydownCMD = "alt" | "meta" | "shift" | "ctrl";
const docKeydownListeners = new Map<
  string,
  ((() => boolean | void) | [KeydownCMD[], () => boolean | void])[]
>();

function documentKeydownListener(e: KeyboardEvent) {
  if (!docKeydownListeners.has(e.key)) return;
  const listeners = docKeydownListeners.get(e.key)!;
  let needPreventDefault = false;
  listeners.forEach((item) => {
    if (!Array.isArray(item)) {
      needPreventDefault = item() || needPreventDefault;
      return;
    }

    const [cmds, fn] = item;
    for (const key of cmds) {
      if (!e[`${key}Key`]) return;
    }

    needPreventDefault = fn() || needPreventDefault;
  });

  if (needPreventDefault) {
    e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation();
  }
}

function startDocumentListener() {
  document.addEventListener("keydown", documentKeydownListener, true);
  console.log("keydown start");
}

function stopDocumentListener() {
  document.removeEventListener("keydown", documentKeydownListener, true);
}

function removeKeydownListener(
  key: string,
  val: (() => boolean | void) | [KeydownCMD[], () => boolean | void]
) {
  const listeners = docKeydownListeners.get(key) || [];
  const idx = listeners.indexOf(val);
  if (idx === -1) return false;
  listeners.splice(idx, 1);
  listeners.length
    ? docKeydownListeners.set(key, listeners)
    : docKeydownListeners.delete(key);

  if (!docKeydownListeners.size) {
    stopDocumentListener();
  }

  return true;
}

export function watchDocKeydown(
  key: string,
  fn: () => boolean | void,
  cmds?: KeydownCMD[]
) {
  if (!docKeydownListeners.size) {
    startDocumentListener();
  }

  const currentListener = cmds
    ? ([cmds, fn] as [KeydownCMD[], () => boolean | void])
    : fn;
  const keydownInfo = docKeydownListeners.get(key) || [];
  keydownInfo.push(currentListener);
  docKeydownListeners.set(key, keydownInfo);

  return () => removeKeydownListener(key, currentListener);
}
