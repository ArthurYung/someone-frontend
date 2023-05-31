import { createEventWatcher } from "./domListener";
import { subTextLeft, subTextRight } from "./util";

export interface SomeoneInputerConfig {
  onFocus?: () => void;
  onBlur?: () => void;
  onInput?: () => void;
  onEnter?: (text: string) => void;
}

export function createSomeoneInputer(
  config: SomeoneInputerConfig,
  root: HTMLDivElement
) {
  const inputer = document.createElement("input");
  const inputerView = document.createElement("span");
  const inputerCursor = document.createElement("span");
  const leftContainer = document.createTextNode("");
  const rightContainer = document.createTextNode("");

  inputer.className = "someone-editor-inputer";
  inputerView.className = "someone-editor-inputer--view";
  inputerCursor.className = "someone-editor-inputer--cursor";
  inputerView.appendChild(leftContainer);
  inputerView.appendChild(inputerCursor);
  inputerView.appendChild(rightContainer);
  inputerCursor.appendChild(inputer);

  let index = 0;
  let length = 0;
  let isFocused = false;
  let isVisible = false;
  let isCompose = false;

  function clear() {
    inputer.innerText = "";
    leftContainer.textContent! = '';
    rightContainer.textContent! = '';
    index = 0;
    length = 0;
  }

  function remove(empty?: boolean) {
    empty && clear();
    inputerView.remove();
    isVisible = false;
    isFocused = false;
    isCompose = false;
  }

  function append() {
    root.appendChild(inputerView);
    isVisible = true;
  }

  function isFocus() {
    return isFocused;
  }

  function inputText(text: string) {
    const len = text.length;
    index += len;
    length += len;
    leftContainer.textContent += text;
    inputer.value = "";
    config.onInput?.()
  }

  function focus() {
    inputer.focus();
    console.log(inputer);
  }

  function blur() {
    inputer.blur();
  }

  function next() {
    if (index < length) {
      const walkerText = subTextLeft(rightContainer, 1);
      leftContainer.textContent += walkerText;
      rightContainer.textContent = subTextRight(rightContainer, 1);
      index += 1;
    }
  }

  function prev() {
    if (index) {
      const walkerText = subTextRight(leftContainer, --index);
      leftContainer.textContent = subTextLeft(leftContainer, index);
      rightContainer.textContent = walkerText + rightContainer.textContent!;
    }
  }

  function back() {
    if (index) {
      leftContainer.textContent = leftContainer.textContent!.substring(
        0,
        --index
      );
      length--;
    }
  }

  function enter() {
    config.onEnter?.(leftContainer.textContent! + rightContainer.textContent!);
    clear();
  }

  const destroyInputerEvents = createEventWatcher(inputer)({
    focus: () => {
      config.onFocus?.();
      if (isFocused) return;
      isFocused = true;
      root.classList.add("focus");
    },
    blur: () => {
      config.onBlur?.();
      if (!isFocused) return;
      isFocused = false;
      root.classList.remove("focus");
    },
    keydown: (e) => {
      if (isCompose) {
        return;
      }

      if (e.key.length === 1) {
        inputText(e.key);
        return;
      }

      if (e.key === "ArrowLeft") {
        prev();
        return;
      }

      if (e.key === "ArrowRight") {
        next();
        return;
      }

      if (e.key === "Backspace") {
        back();
        return;
      }

      if (e.key === 'Enter') {
        e.shiftKey
          ? inputText('\n')
          : enter();
        return;
      }

      console.log(e);
    },
    compositionstart: () => {
      isCompose = true;
    },
    compositionend: (e) => {
      isCompose = false;
      inputText((e.target as any).value);
    },
  })


  const destroyDocumentEvents = createEventWatcher(document)({
    mouseup: () => {
      if (isVisible) {
        inputer.focus();
      }
    },
  })

  function destroy() {
    destroyInputerEvents();
    destroyDocumentEvents();
  }

  return {
    inputer,
    isFocus,
    focus,
    blur,
    clear,
    remove,
    append,
    destroy,
  };
}
