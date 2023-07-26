import { useEffect, useImperativeHandle, useState } from "react";

export const useVisibleAnimate = (ref: any) => {
    const [visibleState, setVisibleState] = useState<'init' | 'before' | 'show' | 'before-hidden' | 'hidden'>('init')
    useEffect(() => {
      if (visibleState === 'init') {
          setTimeout(setVisibleState, 0, 'before');
          return;
      }
  
      if (visibleState === 'before') {
          setTimeout(setVisibleState, 0, 'show');
          return;
      }
  
      if (visibleState === 'before-hidden') {
          setTimeout(setVisibleState, 0, 'hidden');
      }
    }, [visibleState]);
  
    useImperativeHandle(ref, () => ({
      remove: () => {
          return new Promise((resolve) => {
              setVisibleState('before-hidden');
              setTimeout(resolve, 310);
          })
      }
    }));

    return {
        visibleState,
    }
}