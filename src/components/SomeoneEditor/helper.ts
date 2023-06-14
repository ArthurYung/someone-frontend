import { useContext, useEffect, useRef } from "react"
import { SomeoneEditorContext } from "./context"

export function successWrite(text: string) {
  return `<class|succes-write>[%${text}%]`
}

export function primaryWrite(text: string) {
  return `<class|primary-write>[%${text}%]`
}

export function codeWrite(text: string) {
  return `<class|code-write>[%${text}%]`
}

export function linkWrite(link: string, href?: string) {
  return `<link|${href || link}>[%${link}%]`
}

export function errorWrite(text: string) {
  return `<class|error-write>[%${text}%]`
}

export function importantWrite(text: string) {
  return `<class|important-write>[%${text}%]`
}

export function placeholderWrite(text: string) {
  return `<class|placeholder-write>[%${text}%]`
}

export function someoneSaid() {
  return `<class|someone>[%someone: %]`
}

export function userSaid(text: string) {
  return `<class|user>[%${text}: %]`
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
    console.log('bind input')
    const inputCallback = (val: string) => {
      console.log('input callbak', callbackRef.current)
      return callbackRef.current?.(val);
    }
    return setEnterCallback(inputCallback);
  }, [])

  callbackRef.current = callback;
}