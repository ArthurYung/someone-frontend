import { SomeoneEditorConfig } from "./config";

export type SomeoneViewInstance = ReturnType<typeof createSomeoneView>;

export function createSomeoneView(config: SomeoneEditorConfig) {
  const baseContainer = document.createElement("div");
  const viewContainer = document.createElement("div");
  const contentObserve = new MutationObserver(contentCallback);

  let isObserved = false;
  let cursorType: "none" | "text" | "block" = "none";
  let showCursor = false;

  viewContainer.className = `someone-editor ${config.get("className") || ""}`;
  baseContainer.className = "someone-editor--container";
  baseContainer.appendChild(viewContainer);

  function scrollCallback() {
    const { offsetHeight, scrollHeight, scrollTop } = viewContainer;
    if (offsetHeight + scrollTop < scrollHeight) {
      viewContainer.scrollTo(0, viewContainer.scrollHeight + 1);
    }
  }

  function checkCursorType() {
    if (!showCursor) {
      return;
    }

    console.log('>>>> last cursor', viewContainer.lastChild);
    const isBlockEmit = !!(viewContainer.lastChild as HTMLElement)?.dataset
      ?.block;
    if (isBlockEmit && cursorType === "text") {
      viewContainer.classList.add("block-cursor");
      cursorType = "block";
    }

    if (!isBlockEmit && cursorType === "block") {
      viewContainer.classList.remove("block-cursor");
      cursorType = "text";
    }
  }

  function contentCallback() {
    scrollCallback();
    checkCursorType();
  }

  function startObserve() {
    if (isObserved) return;
    contentObserve.observe(viewContainer, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    isObserved = true;
  }

  function clearObserve() {
    if (!isObserved) return;
    contentObserve.disconnect();
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
    if (visible) {
      viewContainer.classList.add("cursor");
      showCursor = true;
      cursorType = 'text';
    } else {
      viewContainer.classList.remove("cursor");
      showCursor = false;
      cursorType = "none";
    }
  }

  return {
    getView,
    getContainer,
    startObserve,
    setCursor,
    clearObserve,
    scrollCallback,
    getObserveStatus,
  };
}

