import { SomeoneTypewriterConfig, createTypewriter } from "./typewriter";
import { SomeoneViewConfig, createSomeoneView } from "./view";

export type SomeoneEditorConfig = SomeoneViewConfig & Omit<SomeoneTypewriterConfig, 'view'>
export function createSomeoneEditor (config: SomeoneEditorConfig) {
  const view = createSomeoneView(config);
  const typewiter = createTypewriter({
    view: view.getContainer(),
    speed: config.speed || 100,
  });

  return {
    container: view.getContainer(),
    ...typewiter,
  }
}