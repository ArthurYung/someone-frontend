import { createContext, useContext } from "react";

export type ErrorPageInfo = {
  message: string,
  info: string[]
}

export const ErrorContext = createContext<{
  error: ErrorPageInfo | null,
  setError: (info: ErrorPageInfo) => void;
}>({
  error: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setError: () => {},
})

export const useErorContext = () => useContext(ErrorContext);
