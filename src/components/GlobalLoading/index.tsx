import { FC, useEffect, useState } from "react";

const MIN_SLEEP = 1000;

export const GlobalLoading: FC<{ children: any }> = ({ children }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const startTime = window.__START_TIME;
    const currTime = Date.now();
    console.log('START: ' + startTime);
    console.log('NOW: ' + currTime);
    const loadingSleep = Math.max(MIN_SLEEP - currTime + startTime, 0);
    setTimeout(() => {
      // document.getElementById('loading')?.remove();
      // setLoaded(true);
    }, loadingSleep)
  }, []);

  if (!loaded) return null;
  return children;
}
