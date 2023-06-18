/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext } from "react";
import { SomeoneEditor } from "./core";

export const SomeoneEditorContext = createContext({
  editor: null as unknown as SomeoneEditor,
  isMounted: false,
  setEnterCallback: (() => () => {}) as (fn: (val: string) => any) => (() => void),
  setInputCallback: (() => () => {}) as (fn: (val: string) => any) => (() => void),
  setMessageMode: (val: boolean) => {},
});

export const useSomeoneEditor = () => useContext(SomeoneEditorContext).editor;
export const useSomeoneBaseEditor = () => useContext(SomeoneEditorContext);
export const SomeoneEditorProvider = SomeoneEditorContext.Provider;