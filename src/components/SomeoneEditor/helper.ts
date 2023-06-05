import { useContext, useEffect, useRef } from "react"
import { SomeoneEditorContext } from "./context"

export function successWrite(text: string) {
  return `<class|succes-write>[%${text}%]`
}

export function primaryWrite(text: string) {
  return `<class|primary-write>[%${text}%]`
}

export function errorWrite(text: string) {
  return `<class|error-write>[%${text}%]`
}

export function importantWrite(text: string) {
  return `<class|important-write>[%${text}%]`
}

export function useSomeoneInputerWatch(callback: (val: string) => void | boolean) {
  const { setInputCallback } = useContext(SomeoneEditorContext);
  const callbackRef = useRef<(val: string) => (void|boolean)>(callback);
  useEffect(() => {
    const inputCallback = (val: string) => {
      return callbackRef.current?.(val);
    }
    return setInputCallback(inputCallback);
  }, [])

  callbackRef.current = callback;
}

export function useSomeoneEnterWatch(callback: (val: string) => void | boolean) {
  const { setEnterCallback } = useContext(SomeoneEditorContext);
  const callbackRef = useRef<(val: string) => (void|boolean)>(callback);
  useEffect(() => {
    const inputCallback = (val: string) => {
      return callbackRef.current?.(val);
    }
    return setEnterCallback(inputCallback);
  }, [])

  callbackRef.current = callback;
}