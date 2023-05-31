import { SomeoneTypewriterConfig, createTypewriter } from "./typewriter";
import { SomeoneViewConfig, createSomeoneView } from "./view";
import { SomeoneInputerConfig, createSomeoneInputer } from "./inputer";
import './style.scss';

export type SomeoneEditorConfig = SomeoneViewConfig & SomeoneInputerConfig & Omit<SomeoneTypewriterConfig, 'view'> 

export type SomeoneEditor = ReturnType<typeof createSomeoneEditor>;

export function createSomeoneEditor (config: SomeoneEditorConfig) {
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
    onInput: () => {
      view.scrollCallback();
      config.onInput?.()
    }
  }, view.getView());

  view.startObserve();

  function onWrite() {
    inputer.remove();
    view.setCursor(true);
    inputer.blur();
    config.onWrite?.();
  }

  function onWriteEnd() {
    config.onWriteEnd?.();
    view.setCursor(false);
    inputer.append();
    inputer.focus();
  }

  return {
    container: view.getContainer(),
    ...typewiter,
  }
}