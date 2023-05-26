export function sleepTimeout(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time);
  })
}

export function subTextLeft(textNode: Node, index: number) {
  return textNode.textContent!.substring(0, index);
}

export function subTextRight(textNode: Node, index: number) {
  return textNode.textContent!.substring(index);
}
