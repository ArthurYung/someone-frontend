import { useCallback, useContext, useEffect, useRef } from "react";
import { SomeoneEditorContext } from "./context";
import { KeydownCMD, watchDocKeydown } from "./core/docKeydown";
import { getCopyId } from "../../utils/copy";

export function optionWrite(id: string) {
  return `<option|${id}>[% %]`;
}

export function successWrite(text: string) {
  return `<class|succes-write>[%${text}%]`;
}

export function primaryWrite(text: string) {
  return `<class|primary-write>[%${text}%]`;
}

export function codeWrite(text: string) {
  return `<class|code-write>[%"${text}"%]`;
}

export function mdCodeWrite(text: string) {
  return `<class|code-write md>[%${text}%]`;
}

export function linkWrite(link: string, href?: string) {
  return `<link|${href || link}>[%${link}%]`;
}

export function codePreRootWrite(type = "code") {
  const copyId = getCopyId();
  return `<class|code-pre copy-id-${copyId}>[%🧩 <${type}> | /copy ${copyId} |%]`;
}

export function thinkRootWrite() {
  return `<block|think-header>[%💭 思考...%]`;
}

export function thinkLineWrite(text: string) {
  return `<block|think>[%${text}%]`;
}

export function codePreLineWrite(text: string) {
  return `<block|code-inline>[%${text}%]`;
}

export function errorWrite(text: string) {
  return `<class|error-write>[%${text}%]`;
}

export function importantWrite(text: string) {
  return `<class|important-write>[%${text}%]`;
}

export function inputCodeWrite(text: string) {
  return `<class|input-code-write>[%${text}%]`;
}

export function placeholderWrite(text: string) {
  return `<class|placeholder-write>[%${text}%]`;
}

export function historyPlaceholderWrite(text: string) {
  return `<class|placeholder-write history>[%${text}%]`;
}

export function tipsWrite(text: string) {
  return `<class|tips-dot-write>[% * %]${tipsTextWrite(text)}`;
}

export function tipsTextWrite(text: string) {
  return `<class|tips-text-write>[% ${text} %]`;
}

export function hiddenImageWrite(src: string) {
  return `<image|hidden-image-write>[%${src}%]`;
}

export function someoneSaid() {
  return `<class|someone>[%[someone]%]`;
}

export function userSaid(text: string) {
  return `<class|user>[%[${text}]%]`;
}

export function copyGuideWrite(id: string) {
  return `<class|copy-guide>[%| /copy ${id} |%]`;
}

export function useSomeoneInputerWatch(
  callback: (val: string) => void | boolean,
) {
  const { setInputCallback } = useContext(SomeoneEditorContext);
  const callbackRef = useRef<(val: string) => void | boolean>(callback);
  const inputCallbackDestory = useRef<() => void>();
  useEffect(() => {
    const inputCallback = (val: string) => {
      return callbackRef.current?.(val);
    };

    inputCallbackDestory.current = setInputCallback(inputCallback);
    return inputCallbackDestory.current;
  }, []);

  callbackRef.current = callback;
  return inputCallbackDestory.current;
}

export function useSomeoneEnterWatch(
  callback: (val: string) => void | boolean,
) {
  const { setEnterCallback } = useContext(SomeoneEditorContext);
  const callbackRef = useRef<(val: string) => void | boolean>(callback);
  const enterCallbackDestory = useRef<() => void>();
  useEffect(() => {
    const inputCallback = (val: string) => {
      return callbackRef.current?.(val);
    };

    enterCallbackDestory.current = setEnterCallback(inputCallback);
    return enterCallbackDestory.current;
  }, []);

  callbackRef.current = callback;

  return enterCallbackDestory.current;
}

export function useDocKeydownWatch(
  key: string,
  fn: () => boolean | void,
  cmds?: KeydownCMD[],
) {
  const callbackRef = useRef<() => boolean | void>(fn);
  const dockeydownDestoryRef = useRef<() => boolean>();

  useEffect(() => {
    dockeydownDestoryRef.current = watchDocKeydown(
      key,
      () => callbackRef.current(),
      cmds,
    );
    return () => {
      dockeydownDestoryRef.current?.();
    };
  }, []);
  return dockeydownDestoryRef.current;
}
