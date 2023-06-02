import { SomeoneTypewriterConfig, createTypewriter } from "./typewriter";
import { SomeoneViewConfig, createSomeoneView } from "./view";
import { SomeoneInputerConfig, createSomeoneInputer } from "./inputer";
import './style.scss';
import { createEditorState } from "./state";

export type SomeoneEditorConfig = SomeoneViewConfig & SomeoneInputerConfig & Omit<SomeoneTypewriterConfig, 'view'> 

export type SomeoneEditor = ReturnType<typeof createSomeoneEditor>;

export function createSomeoneEditor (config: SomeoneEditorConfig) {
  const { state, updater } = createEditorState({});

  const view = createSomeoneView(config);
  const typewiter = createTypewriter({
    view: view.getView(),
    speed: config.speed || 100,
    onWrite,
    onWriteEnd,
  });

  const inputer = createSomeoneInputer({
    ...config,
    onEnter: (text) => {
      typewiter.asyncWrite(text + '\n');
      config.onEnter?.(text);
    },
    onInput: (value) => {
      console.log(value);
      view.scrollCallback();
      config.onInput?.(value);
    }
  }, view.getView());

  view.startObserve();

  function showInputer() {
    updater.setInputerVisible(true);
    !state.isWriting && appendInputer();
  }

  function hideInputer() {
    updater.setInputerVisible(false);
  }

  function appendInputer() {
    if (state.inputerVisible) {
      inputer.append();
      inputer.focus();
    }
  }

  function removeInputer() {
    inputer.remove();
    inputer.blur();
  }

  function onWrite() {
    updater.setIsWriting(true);
    view.setCursor(true);
    config.onWrite?.();
    removeInputer();
  }

  function onWriteEnd() {
    config.onWriteEnd?.();
    view.setCursor(false);
    updater.setIsWriting(false);
    appendInputer();
  }

  return {
    container: view.getContainer(),
    ...typewiter,
    showInputer,
    hideInputer,
  }
}