/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createEventWatcher } from './domListener';
import { isSpaceChar, subTextLeft, subTextRight } from './util';

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
  const inputer = document.createElement('span');
  const inputerView = document.createElement('span');
  const inputerCursor = document.createElement('span');
  const leftContainer = document.createTextNode('');
  const rightContainer = document.createTextNode('');

  const inputerObserver = new MutationObserver(onInputerChange);

  const destroyInputerEvents = createEventWatcher(inputer as HTMLInputElement)({
    focus: () => {
      config.onFocus?.();
      if (isFocused) return;
      isFocused = true;
      root.classList.add('focus');
    },
    blur: () => {
      config.onBlur?.();
      if (!isFocused) return;
      isFocused = false;
      root.classList.remove('focus');
    },
    keydown: (e) => {
      if (isCompose) {
        return;
      }

      console.log(e);
    
      if (e.key === 'Backspace') {
        back();
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.altKey ? wordJumpPrev() : prev();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.altKey ? wordJumpNext() : next();
        return;
      }

      if (e.key === 'Enter') {
        e.shiftKey ? inputText('\n') : enter();
        e.preventDefault();
        return;
      }
    },
    paste: (e) => {
      const pasteValue = e.clipboardData?.getData('text') || '';
      inputText(pasteValue);
      e.preventDefault();
    },
    compositionstart: () => {
      isCompose = true;
    },
    compositionend: () => {
      isCompose = false;
      inputText(inputer.innerText);
    },
  });

  const destroyDocumentEvents = createEventWatcher(document)({
    mouseup: () => {
      if (isVisible) {
        inputer.focus();
      }
    },
  });

  inputer.className = 'someone-editor-inputer';
  inputerView.className = 'someone-editor-inputer--view';
  inputerCursor.className = 'someone-editor-inputer--cursor';
  inputer.contentEditable = 'true';
  inputerView.appendChild(leftContainer);
  inputerView.appendChild(inputer);
  inputerView.appendChild(inputerCursor);
  inputerView.appendChild(rightContainer);

  let index = 0;
  let length = 0;
  let isFocused = false;
  let isVisible = false;
  let isCompose = false;

  function onInputerChange() {
    !isCompose && inputText(inputer.innerText);
  }

  function observeInput() {
    inputerObserver.observe(inputer, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  function disconnectInput() {
    inputerObserver.disconnect();
  }

  function clear() {
    inputer.innerText = '';
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
    disconnectInput();
  }

  function append() {
    root.appendChild(inputerView);
    isVisible = true;
    observeInput();
  }

  function isFocus() {
    return isFocused;
  }

  function inputText(text: string) {
    const len = text.length;
    index += len;
    length += len;
    leftContainer.textContent += text;
    disconnectInput();
    inputer.innerText = '';
    config.onInput?.();
    observeInput();
  }

  function focus() {
    inputer.focus();
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

  function wordJumpPrev() {
    if (!index) return;
    const prevTexts = leftContainer.textContent || '';
    let walker = index;
    while (--walker) {
      if (isSpaceChar(prevTexts.charAt(walker))) break;
    }
    leftContainer.textContent! = prevTexts.substring(0, walker);
    rightContainer.textContent! =
      prevTexts.substring(walker) + rightContainer.textContent!;
    index = walker;
  }

  function wordJumpNext() {
    if (index >= length) return;
    const nextTexts = rightContainer.textContent || '';
    let walker = 0;
    while (index + ++walker < length) {
      if (isSpaceChar(nextTexts.charAt(walker))) break;
    }

    leftContainer.textContent! =
      leftContainer.textContent! + nextTexts.substring(0, walker);
    rightContainer.textContent! = nextTexts.substring(walker);
    index += walker
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

  function destroy() {
    destroyInputerEvents();
    destroyDocumentEvents();
    remove();
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
