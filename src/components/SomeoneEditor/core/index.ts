import { createTypewriter } from "./typewriter";
import { createSomeoneView } from "./view";
import { createSomeoneInputer } from "./inputer";
import { SomeoneEditorConfigProps, createSomeoneConfig } from "./config";
import './style.scss';
import { createSomeoneOption } from "./option";

export type SomeoneEditor = ReturnType<typeof createSomeoneEditor>;

export function createSomeoneEditor (initConfig: SomeoneEditorConfigProps) {
  const config = createSomeoneConfig(initConfig);
  const view = createSomeoneView(config);
  const typewiter = createTypewriter(config, view.getView());
  const inputer = createSomeoneInputer(config, view.getView());
  const optioner = createSomeoneOption(config);

  view.startObserve();

  config.set('onEditorEnter', (value) => {
    typewiter.asyncWrite(value + '\n');
    config.emit('onEnter', value);
  });

  config.set('onEditorInput', (value) => {
    view.scrollCallback();
    config.emit('onInput', value);
  });

  config.set('onEditorWrite', () => {
    config.set('isWriting', true);
    view.setCursor(true);
    config.emit('onWrite');
    removeInputer();
    optioner.hide();
  });

  config.set('onEditorWriteEnd', () => {
    config.emit('onWriteEnd');
    config.set('isWriting', false);
    hideWriteCursor();
    appendInputer();
    showOptions();
  })

  function hideWriteCursor() {
    if(config.get('inputerVisible')) {
      view.setCursor(false);
    }
  }

  function showInputer() {
    config.set('inputerVisible', true);
    if (!config.get('isWriting')) {
      hideWriteCursor();
      appendInputer();
    }
  }

  function hideInputer() {
    config.set('inputerVisible', false);
  }

  function appendInputer() {
    if(config.get('inputerVisible')) {
      inputer.append();
      inputer.focus();
    }
  }

  function showOptions() {
    if (config.get('optionVisible')) {
      view.setCursor(false);
      optioner.run();
    }
  }
  
  function runOptions(options: string[]) {
    config.set('optionIds', options);
    config.set('optionVisible', true);
    if (!config.get('isWriting')) {
      view.setCursor(false);
      optioner.run();
    }
  }

  function clearOptions() {
    optioner.hide();
    view.setCursor(true);
    config.set('optionIds', []);
    config.set('optionVisible', false);
  }

  function removeInputer() {
    inputer.remove();
    inputer.blur();
  }

  function currentOption() {
    return optioner.current()?.id;
  }

  function updateConfig(updateData: Partial<SomeoneEditorConfigProps>) {
    config.setConfig(updateData)
  }

  function clearView() {
    config.set('isWriting', false);
    view.setCursor(false);
    typewiter.clear();
    appendInputer();
  }

  function hideCursor() {
    view.setCursor(false);
  }

  return {
    container: view.getContainer(),
    ...typewiter,
    showInputer,
    hideInputer,
    runOptions,
    currentOption,
    clearOptions,
    updateConfig,
    hideCursor,
    clearView,
  }
}