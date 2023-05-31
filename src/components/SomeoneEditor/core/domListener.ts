export function createEventWatcher<
  T extends HTMLDivElement | HTMLInputElement | Document,
  R extends T extends Document ? DocumentEventMap : HTMLElementEventMap
>(node: T) {
  return function watchEvents(eventMap:  { [x in keyof R]?: (this: T, e: R[x]) => any }) {
    Object.keys(eventMap).forEach(eventKey => {
      node.addEventListener(eventKey, eventMap[eventKey as keyof R] as any);
    });

    return () => {
      Object.keys(eventMap).forEach(eventKey => {
        node.removeEventListener(eventKey, eventMap[eventKey as keyof R] as any);
      });
    }
  }
}

