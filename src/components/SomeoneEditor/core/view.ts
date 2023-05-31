export interface SomeoneViewConfig {
  className?: string
}

export type SomeoneViewInstance = ReturnType<typeof createSomeoneView>;

export function createSomeoneView(config: SomeoneViewConfig) {
  const baseContainer = document.createElement('div');
  const viewContainer = document.createElement('div');
  const scrollObserve = new MutationObserver(scrollCallback);
  
  let isObserved = false;

  viewContainer.className = `someone-editor ${config.className || ''}`;
  baseContainer.className = 'someone-editor--container';
  baseContainer.appendChild(viewContainer);

  function scrollCallback() {
    const { offsetHeight, scrollHeight, scrollTop } = viewContainer;
    if (offsetHeight + scrollTop < scrollHeight) {
      viewContainer.scrollTo(0, viewContainer.scrollHeight + 1);
    }
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

  function getView() {
    return viewContainer;
  }

  function getContainer() {
    return baseContainer;
  }

  function getObserveStatus() {
    return isObserved;
  }

  function setCursor(visible: boolean) {
    visible ? viewContainer.classList.add('cursor') : viewContainer.classList.remove('cursor');
  }

  return {
    getView,
    getContainer,
    startObserve,
    setCursor,
    clearObserve,
    scrollCallback,
    getObserveStatus,
  }
}