export interface SomeoneViewConfig {
  className?: string
}

export type SomeoneViewInstance = ReturnType<typeof createSomeoneView>;

export function createSomeoneView(config: SomeoneViewConfig) {
  const viewContainer = document.createElement('div');
  const scrollObserve = new MutationObserver(scrollCallback);
  
  let isObserved = false;

  viewContainer.className = `someone-editor ${config.className || ''}`;

  function scrollCallback() {
    console.log('callback');
    viewContainer.scrollTo(0, viewContainer.scrollHeight + 1);
  }

  function startObserve() {
    if (isObserved) return;
    scrollObserve.observe(viewContainer, {
      childList: true,
      subtree: false,
    });
    isObserved = true;
  }

  function clearObserve() {
    if (!isObserved) return;
    scrollObserve.disconnect();
    isObserved = false;
  }

  function getContainer() {
    return viewContainer;
  }

  function getObserveStatus() {
    return isObserved;
  }

  function setCursor(visible: boolean) {
    visible ? viewContainer.classList.add('cursor') : viewContainer.classList.remove('cursor');
  }

  return {
    getContainer,
    startObserve,
    setCursor,
    clearObserve,
    getObserveStatus,
  }
}