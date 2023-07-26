import { createRef, forwardRef, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { useWindowSize } from 'react-use';
import { useVisibleAnimate } from "./useAnimate";
import './Footer.scss';

const cls = "mobile-footer";


interface FooterRadioMethods {
  remove: () => Promise<void>;
}

function stop(e: TouchEvent) {
    e.preventDefault();
}

const useInputerFoucs = () => {
    const [isFocus, setIsFocus] = useState(false);

    function focus() {
        setIsFocus(true);
        document.body.addEventListener('touchmove', stop, {
            passive: false,
        });
    }

    function blur() {
        setIsFocus(false)
        document.body.removeEventListener('touchmove', stop);
    }

    useEffect(() => blur,[]);

    return {
        focus, blur, isFocus
    }
}

export const FooterInputer = forwardRef<
FooterRadioMethods,
  {
    onSubmit: (val: string) => void;
    placeholder: string,
  }
>(({ onSubmit, placeholder }, ref) => {
  const [val, updateVal] = useState('');
  const { visibleState } = useVisibleAnimate(ref);
  const { focus, blur, isFocus } = useInputerFoucs();
  return (
    <div className={cls}>
        <div className={`${cls}--inner ${visibleState}`}>
            <input placeholder={placeholder} value={val} onChange={e => updateVal(e.target.value)} type="text" className={`${cls}--inputer ${isFocus ? 'focus' : ''}`} onFocus={focus} onBlur={blur} />
            <div className={`${cls}--item submit`} onClick={() => {
              onSubmit(val);
              updateVal('');
            }}>↑</div>
        </div>
    </div>
  );
});

export const CreateFooterInputer = (config: {
  onSubmit: (val: string) => void;
  placeholder?: string
}) => {
  const el = document.createElement('div')
  const root = createRoot(el);
  const ref = createRef<FooterRadioMethods>();

  document.body.appendChild(el);
  root.render(<FooterInputer ref={ref} placeholder={config.placeholder || '请输入'} onSubmit={config.onSubmit}/>);

  return {
    destory: () => {
      ref.current?.remove().then(() => {
        root.unmount();
      })
    }
  }
}