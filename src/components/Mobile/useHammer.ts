import { useEffect, useRef } from "react"
import { createHammerWatch } from "../../utils/hammer";

export const useHammer = (event: string, callback: (e: HammerInput) => void) => {
  const callbackRef = useRef(callback);
  const hammerDestory = useRef<() => void>();
  callbackRef.current = callback;
  useEffect(() => {
    hammerDestory.current = createHammerWatch(event, (e) => {
      callbackRef.current?.(e)
    });
    return hammerDestory.current;
  }, []);

  return hammerDestory.current;
}