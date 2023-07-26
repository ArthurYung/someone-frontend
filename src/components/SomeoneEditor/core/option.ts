import { SomeoneEditorConfig } from './config';
import { watchDocKeydown } from './docKeydown';

export function createSomeoneOption(config: SomeoneEditorConfig) {
  const optionRef: {
    value?: HTMLSpanElement;
    prevWatcher?: () => boolean;
    nextWatcher?: () => boolean;
    options: HTMLSpanElement[];
  } = {
    options: [],
  };

  function getPrevOption() {
    let index = optionRef.value
      ? optionRef.options.indexOf(optionRef.value)
      : -1;
    if (index < 1) {
      index = optionRef.options.length;
    }
    return optionRef.options[index - 1];
  }

  function getNextOption() {
    let index = optionRef.value
      ? optionRef.options.indexOf(optionRef.value)
      : optionRef.options.length;

    if (index > optionRef.options.length - 2) {
      index = -1;
    }
    return optionRef.options[index + 1];
  }

  function watchOptions() {
    optionRef.prevWatcher = watchDocKeydown('ArrowUp', () => {
      const prevOption = getPrevOption();
      prevOption && switchSelect(prevOption);
      return true;
    });

    optionRef.nextWatcher = watchDocKeydown('ArrowDown', () => {
      const nextOption = getNextOption();
      nextOption && switchSelect(nextOption);
      return true;
    });
  }

  function destoryWatchers() {
    optionRef.prevWatcher?.();
    optionRef.nextWatcher?.();
  }

  function switchSelect(nextValue?: HTMLSpanElement) {
    optionRef.value?.classList.remove('select');
    optionRef.value = nextValue;
    optionRef.value?.classList.add('select');
  }

  function run() {
    optionRef.options = config
      .get('optionIds')
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLSpanElement[];

    if (!optionRef.options.length) return;
    switchSelect(optionRef.options[0]);
    watchOptions();
  }

  function hide() {
    switchSelect();
    destoryWatchers();
  }

  function current() {
    return optionRef.value;
  }

  return {
    run,
    hide,
    current,
  };
}
