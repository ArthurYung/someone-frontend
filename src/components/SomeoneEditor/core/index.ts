import { createTypewriter } from "./typewriter";
import { createSomeoneView } from "./view";
import { createSomeoneInputer } from "./inputer";
import { SomeoneEditorConfigProps, createSomeoneConfig } from "./config";
import './style.scss';

export type SomeoneEditor = ReturnType<typeof createSomeoneEditor>;

export function createSomeoneEditor (initConfig: SomeoneEditorConfigProps) {
  const config = createSomeoneConfig(initConfig);
  const view = createSomeoneView(config);
  const typewiter = createTypewriter(config, view.getView());
  const inputer = createSomeoneInputer(config, view.getView());

  view.startObserve();

  config.set('onEditorEnter', (value) => {
    typewiter.asyncWrite(value + '\n');
    config.emit('onEnter', value);
  });

  config.set('onEditorInput', (value) => {
    console.log(value);
    view.scrollCallback();
    config.emit('onInput', value);
  });

  config.set('onEditorWrite', () => {
    config.set('isWriting', true);
    view.setCursor(true);
    config.emit('onWrite');
    removeInputer();
  });

  config.set('onEditorWriteEnd', () => {
    config.emit('onWriteEnd');
    config.set('isWriting', false);
    hideWriteCursor();
    appendInputer();
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

  function removeInputer() {
    inputer.remove();
    inputer.blur();
  }

  function updateConfig(updateData: Partial<SomeoneEditorConfigProps>) {
    config.setConfig(updateData)
  }

  function clearView() {
    typewiter.clear();
    appendInputer();
  }

  return {
    container: view.getContainer(),
    ...typewiter,
    showInputer,
    hideInputer,
    updateConfig,
    clearView,
  }
}