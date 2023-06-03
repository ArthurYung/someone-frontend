import {
  SomeoneViewConfig,
  SomeoneTypewriterPropsConfig,
  SomeoneInputerPropsConfig,
  SomeoneInputerStaticConfig,
  SomeoneTypewriterStaticConfig,
  EditorState,
} from "./types";

export type SomeoneEditorConfigProps = SomeoneViewConfig &
  SomeoneInputerPropsConfig &
  SomeoneTypewriterPropsConfig;

export type SomeoneEditorConfigState = SomeoneEditorConfigProps &
  SomeoneInputerStaticConfig &
  SomeoneTypewriterStaticConfig &
  EditorState;

export type SomeoneEditorConfig = ReturnType<typeof createSomeoneConfig>;

export function createSomeoneConfig(initConfig: SomeoneEditorConfigProps) {
  const configRef = {
    value: {
      ...initConfig,
      inputerVisible: false,
      isWriting: false,
    } as SomeoneEditorConfigState,
  };

  function getConfig(): SomeoneEditorConfigState {
    return configRef.value;
  }

  function get<T extends keyof SomeoneEditorConfigState>(
    key: T
  ): SomeoneEditorConfigState[T] {
    return configRef.value[key];
  }

  function set<T extends keyof SomeoneEditorConfigState>(
    key: T,
    value: SomeoneEditorConfigState[T]
  ) {
    configRef.value[key] = value;
  }

  function setConfig(config: Partial<SomeoneEditorConfigState>) {
    Object.assign(configRef.value, config);
  }

  function emit<T extends keyof SomeoneEditorConfigState>(
    key: T,
    arg?: Required<SomeoneEditorConfigState>[T] extends (arg: infer X) => any
      ? X
      : undefined
  ) {
    const emitConfig = get(key);
    if (typeof emitConfig !== "function") {
      return;
    }

    emitConfig?.(arg as any);
  }

  return {
    get,
    set,
    getConfig,
    setConfig,
    emit,
  };
}
