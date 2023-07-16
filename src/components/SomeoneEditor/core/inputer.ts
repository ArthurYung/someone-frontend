/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SomeoneEditorConfig } from './config';
import { createEventWatcher } from './domListener';
import { getBackSize } from './events';
import { createInputerHistory } from './history';
import { SUFFIX_TOKEN } from './token';
import { isSpaceChar, subTextLeft, subTextRight } from './util';

export function createSomeoneInputer(
  config: SomeoneEditorConfig,
  root: HTMLDivElement
) {
  const inputer = document.createElement('span');
  const inputerView = document.createElement('span');
  const inputerSuffix = document.createElement('span');
  const inputerCursor = document.createElement('span');
  const leftContainer = document.createTextNode('');
  const rightContainer = document.createTextNode('');

  const inputerObserver = new MutationObserver(onInputerChange);

  const inputerHistory = createInputerHistory();

  const destroyInputerEvents = createEventWatcher(inputer as HTMLInputElement)({
    focus: () => {
      config.emit('onFocus');
      if (isFocused) return;
      isFocused = true;
      root.classList.add('focus');
    },
    blur: () => {
      config.emit('onBlur');
      if (!isFocused) return;
      isFocused = false;
      root.classList.remove('focus');
    },
    keydown: (e) => {
      if (isCompose) {
        return;
      }

      if (e.key === 'ArrowUp') {
        undo();
        return;
      }

      if (e.key === 'ArrowDown') {
        redo();
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.altKey ? wordJumpPrev() : prev();
        return;
      }

      if (e.key === 'ArrowRight') {
        if (hasSuffix) {
          inputForSuffix();
        } else {
          e.altKey ? wordJumpNext() : next();
        }
        return;
      }


      if (e.key === 'Backspace') {
        back();
        return;
      }


      if (e.key === 'Enter') {
        e.shiftKey ? inputText('\n') : enter();
        e.preventDefault();
        return;
      }

      if (e.key === 'Tab') {
        inputForSuffix();
        e.preventDefault();
        return;
      }

      useHistory = false;
    },
    paste: (e) => {
      const pasteValue = e.clipboardData?.getData('text') || '';
      inputText(pasteValue);
      e.preventDefault();
      useHistory = false;
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
    keydown: () => {
      if (isVisible && !isFocus) {
        inputer.focus();
      }
    },
  });

  inputer.className = 'someone-editor-inputer';
  inputerView.className = 'someone-editor-inputer--view';
  inputerCursor.className = 'someone-editor-inputer--cursor';
  inputerSuffix.className = 'someone-editor-inputer--suffix';
  inputer.contentEditable = 'true';
  inputerView.appendChild(leftContainer);
  inputerView.appendChild(inputer);
  inputerView.appendChild(inputerCursor);
  inputerView.appendChild(rightContainer);
  inputerView.appendChild(inputerSuffix);

  let index = 0;
  let length = 0;
  let value = '';
  let isFocused = false;
  let isVisible = false;
  let isCompose = false;
  let hasSuffix = false;
  let useHistory = false;

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
    inputerSuffix.innerText = '';
    leftContainer.textContent! = '';
    rightContainer.textContent! = '';
    value = '';
    index = 0;
    length = 0;
    hasSuffix = false;
    isCompose = false;
  }

  function remove() {
    disconnectInput();
    clear();
    inputerView.remove();
    isVisible = false;
    isFocused = false;
  }

  function append() {
    root.appendChild(inputerView);
    isVisible = true;
    observeInput();
  }

  function isFocus() {
    return isFocused;
  }

  function inputForSuffix() {
    if (hasSuffix) {
      inputText(inputerSuffix.innerText);
      inputerSuffix.innerText = '';
      hasSuffix = false;
    }
  }

  function matchSuffixs() {
    if (
      index === length &&
      config.get('suffixs')?.length &&
      leftContainer.textContent![0] === SUFFIX_TOKEN
    ) {
      /**
       * Each suffix config string order buy default
       */
      const suffixs = config.get('suffixs')!;
      let suffixText = '';
      for (const suffix of suffixs) {
        if (suffix.startsWith(value)) {
          suffixText = suffix.substring(value.length);
          inputerSuffix.innerText = suffixText;
          hasSuffix = suffixText !== '';
          return;
        }
      }
    }

    if (hasSuffix) {
      inputerSuffix.innerText = '';
      hasSuffix = false;
    }
  }

  function inputText(text: string) {
    const len = text.length;
    index += len;
    length += len;

    /**
     * Close observe before input node content to avoid duplicate callbacks
     */
    disconnectInput();
    leftContainer.textContent += text;
    inputer.innerText = '';

    /**
     * Update inputer value and emit callback;
     */
    value = leftContainer.textContent! + rightContainer.textContent!;
    config.emit('onEditorInput', value);

    /**
     * Match inputer suffix list with user config
     */
    observeInput();
    matchSuffixs();
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
    index += walker;
  }

  function back() {
    if (!index) return;
    const walk = getBackSize();
    index -= walk;
    length -= walk;
    disconnectInput();
    leftContainer.textContent = leftContainer.textContent!.substring(0, index);
    value = leftContainer.textContent! + rightContainer.textContent!;
    useHistory = false;
    matchSuffixs();
    observeInput();
  }

  function undo() {
    if (!useHistory && inputerHistory.len()) {
      inputerHistory.save(value);
    }
  
    const undoText = inputerHistory.undo();
    if (undoText !== null) {
      disconnectInput();
      leftContainer.textContent = undoText;
      rightContainer.textContent = '';
      length = undoText.length;
      value = undoText;
      index = length;
      useHistory = true;
      matchSuffixs();
      observeInput();
    }
  }

  function redo() {
    const redoText = inputerHistory.redo();
    if (redoText !== null) {
      disconnectInput();
      leftContainer.textContent = redoText;
      rightContainer.textContent = '';
      length = redoText.length;
      value = redoText;
      index = length;
      useHistory = true;
      matchSuffixs();
      observeInput();
    }
  }

  function enter() {
    !useHistory && inputerHistory.save(value);
    config.emit('onEditorEnter', value);
    useHistory = false;
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
