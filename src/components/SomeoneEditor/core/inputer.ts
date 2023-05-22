export interface SomeoneInputerConfig {
  onFocus?: () => void;
  onBlur?: () => void;
  onInput?: () => void;
}

export function createSomeoneInputer(config: SomeoneInputerConfig, root: HTMLDivElement) {
  const inputer = document.createElement('input');
  const inputerView = document.createElement('div');
  const inputerCursor = document.createElement('div');

  inputer.className = 'someone-editor-inputer';
  inputerView.className = 'someone-editor-inputer--view';
  inputerCursor.className = 'someone-editor-inputer--cursor';
  inputerView.appendChild(inputerCursor);
  inputerCursor.appendChild(inputer);

  let index = 0;
  let length = 0;
  let isFocused = false;
  let isVisible = false;

  function clear() {
    inputer.innerText = '';
  }

  function remove(empty?: boolean) {
    empty && clear();
    inputer.remove();
    inputerView.remove();
    isVisible = false;
  }

  function append() {
    root.appendChild(inputerView);
    root.appendChild(inputer);
    isVisible = true;
  }


  function isFocus() {
    return isFocused;
  }


  function focus() {
    inputer.focus();
  }

  function blur() {
    inputer.blur();
  }

  function resetCursor(offset: number) {
    const nextNode = inputerView.childNodes[index + offset];
    nextNode
      ? inputerView.insertBefore(inputerCursor, nextNode)
      : inputerView.appendChild(inputerCursor);
  }

  function resetInputer() {
    inputer.style.left = inputerCursor.offsetLeft + 'px';
    inputer.style.top = inputerCursor.offsetTop + inputerView.offsetTop + 'px';
  }

  function next() {
    if (index < length) {
      index += 1;
      resetCursor(1);
    }
  }

  function prev() {
    if (index) {
      index-=1;
      resetCursor(0);
    }
  }
  
  inputer.addEventListener('focus', () => {
    config.onFocus?.();
    resetInputer();
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
    if (e.key.length === 1) {
      inputerView.insertBefore(document.createTextNode(e.key), inputerCursor);
      resetInputer();
      length++;
      index++;
      return;
    };

    if (e.key === 'ArrowLeft') {
      prev();
      resetInputer();
      return;
    }

    if (e.key === 'ArrowRight') {
      next();
      resetInputer();
      return;
    }
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