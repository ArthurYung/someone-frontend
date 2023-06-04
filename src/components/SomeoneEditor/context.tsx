import { createContext, useContext } from "react";
import { SomeoneEditor } from "./core";

export const SomeoneEditorContext = createContext({
  editor: null as unknown as SomeoneEditor,
  isMounted: false,
  setEnterCallback: (() => () => {}) as (fn: (val: string) => any) => (() => void),
  setInputCallback: (() => () => {}) as (fn: (val: string) => any) => (() => void),
});

export const useSomeoneEditor = () => useContext(SomeoneEditorContext).editor;
export const SomeoneEditorProvider = SomeoneEditorContext.Provider;