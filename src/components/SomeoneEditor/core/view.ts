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
    viewContainer.scrollTo(0, viewContainer.scrollHeight + 1);
  }

  function startObserve() {
    if (isObserved) return;
    scrollObserve.observe(viewContainer, {
      childList: true,
      subtree: true,
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

  return {
    getContainer,
    startObserve,
    clearObserve,
    getObserveStatus,
  }
}