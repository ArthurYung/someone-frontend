import { SomeoneTypewriterConfig, createTypewriter } from "./typewriter";
import { SomeoneViewConfig, createSomeoneView } from "./view";
import './style.scss';

export type SomeoneEditorConfig = SomeoneViewConfig & Omit<SomeoneTypewriterConfig, 'view'>

export type SomeoneEditor = ReturnType<typeof createSomeoneEditor>;

export function createSomeoneEditor (config: SomeoneEditorConfig) {
  const view = createSomeoneView(config);
  const typewiter = createTypewriter({
    view: view.getContainer(),
    speed: config.speed || 100,
    onWrite,
    onWriteEnd,
  });

  view.startObserve();
  // view.setCursor(true);

  function onWrite() {
    view.setCursor(true);
    config.onWrite?.();
  }

  function onWriteEnd() {
    // view.setCursor(false);
    config.onWriteEnd?.();
  }

  return {
    container: view.getContainer(),
    ...typewiter,
  }
}