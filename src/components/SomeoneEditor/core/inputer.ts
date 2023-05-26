import { subTextLeft, subTextRight } from "./util";

export interface SomeoneInputerConfig {
  onFocus?: () => void;
  onBlur?: () => void;
  onInput?: () => void;
}

export function createSomeoneInputer(config: SomeoneInputerConfig, root: HTMLDivElement) {
  const inputer = document.createElement('input');
  const inputerView = document.createElement('div');
  const inputerCursor = document.createElement('div');
  const leftContainer = document.createTextNode('');
  const rightContainer = document.createTextNode('');

  inputer.className = 'someone-editor-inputer';
  inputerView.className = 'someone-editor-inputer--view';
  inputerCursor.className = 'someone-editor-inputer--cursor';
  inputerView.appendChild(leftContainer)
  inputerView.appendChild(inputerCursor);
  inputerView.appendChild(rightContainer);
  inputerCursor.appendChild(inputer);

  let index = 0;
  let length = 0;
  let isFocused = false;
  let isVisible = false;
  let isCompose = false;

  function clear() {
    inputer.innerText = '';
  }

  function remove(empty?: boolean) {
    empty && clear();
    inputerView.remove();
    isVisible = false;
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
    inputer.value = '';
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
      leftContainer.textContent = subTextLeft(leftContainer, index)
      rightContainer.textContent = walkerText + rightContainer.textContent!;
    }
  }

  function back() {
    if (index) {
      leftContainer.textContent = leftContainer.textContent!.substring(0, --index);
      length--;
    }
  }
  
  inputer.addEventListener('focus', () => {
    config.onFocus?.();
    // resetInputer();
    if (isFocused) return;
    isFocused = true;
    root.classList.add('focus');
  });

  inputer.addEventListener('blur', () => {
    config.onBlur?.();
    if (!isFocused) return;
    isFocused = false;
    root.classList.remove('focus')
  });

  inputer.addEventListener('keydown', (e) => {
    if (isCompose) {
      return;
    }

    if (e.key.length === 1) {
      inputText(e.key);
      return;
    };

    if (e.key === 'ArrowLeft') {
      prev();
      return;
    }

    if (e.key === 'ArrowRight') {
      next();
      return;
    }

    if (e.key === 'Backspace') {
      back();
      return;
    }
  })

  inputer.addEventListener('compositionstart', () => {
    isCompose = true;
  })

  inputer.addEventListener('compositionend', (e) => {
    isCompose = false;
    inputText((e.target as any).value);
  })

  document.addEventListener('mouseup', (e) => {
    if (isVisible) {
      inputer.focus();
    }
  });


  return {
    inputer,
    isFocus,
    focus,
    blur,
    clear,
    remove,
    append,
  }
} 