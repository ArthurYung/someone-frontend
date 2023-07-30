import { createRef, forwardRef, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useVisibleAnimate } from './useAnimate';
import { registeDestory } from './footerHelper';
import './Footer.scss';

const cls = 'mobile-footer';

interface FooterRadioMethods {
  remove: () => Promise<void>;
}

function stop(e: TouchEvent) {
  e.preventDefault();
}

function scrollEditorViewToEnd() {
  const editorView = document.querySelector('.someone-editor') as HTMLElement;
  if (!editorView) return;
  const top = editorView.scrollHeight + editorView.offsetHeight;
  editorView.scrollTo({ left: 0, top });
}

const useInputerFoucs = () => {
  const [isFocus, setIsFocus] = useState(false);

  function focus() {
    setIsFocus(true);
    scrollEditorViewToEnd();
    document.body.addEventListener('touchmove', stop, {
      passive: false,
    });
  }

  function blur() {
    setIsFocus(false);
    document.body.removeEventListener('touchmove', stop);
  }

  useEffect(() => blur, []);

  useEffect(() => {
    const editorView = document.querySelector('.someone-editor') as HTMLElement;
  
    function resizeClientHeight() {
      if (editorView.offsetHeight +  editorView.getBoundingClientRect().top < 30) {
        editorView.style.transform = `translate3d(0, ${-editorView.getBoundingClientRect().top}px, 0)`
      } else {
        editorView.style.transform = ''
      }
    }

    window.visualViewport?.addEventListener('resize', resizeClientHeight);
    return () => window.visualViewport?.removeEventListener('resize', resizeClientHeight);
  }, [])

  return {
    focus,
    blur,
    isFocus,
  };
};

export const FooterInputer = forwardRef<
  FooterRadioMethods,
  {
    onSubmit: (val: string) => boolean | void;
    placeholder: string;
  }
>(({ onSubmit, placeholder }, ref) => {
  const [val, updateVal] = useState('');
  const { visibleState } = useVisibleAnimate(ref);
  const { focus, blur, isFocus } = useInputerFoucs();
  function submitInputer() {
    if (!val.trim()) return;
    onSubmit(val) || updateVal('');
  }

  return (
    <div className={cls}>
      <div className={`${cls}--inner ${visibleState}`}>
        <form action="javascript:void(0)" onSubmit={(e) => e.preventDefault()} className={`${cls}--inputer-target  ${isFocus ? 'focus' : ''}`}>
          <input
            placeholder={placeholder}
            value={val}
            onChange={(e) => updateVal(e.target.value)}
            type="text"
            className={`${cls}--inputer`}
            onFocus={focus}
            onBlur={blur}
            onKeyDown={(e) => e.key === 'Enter' && submitInputer()}
          />
        </form>
        <div
          className={`${cls}--item submit`}
          onClick={submitInputer}
        >
          ↑
        </div>
      </div>
    </div>
  );
});

export const CreateFooterInputer = (config: {
  onSubmit: (val: string) => boolean | void;
  placeholder?: string;
}) => {
  const el = document.createElement('div');
  const root = createRoot(el);
  const ref = createRef<FooterRadioMethods>();

  document.body.appendChild(el);
  root.render(
    <FooterInputer
      ref={ref}
      placeholder={config.placeholder || '请输入'}
      onSubmit={config.onSubmit}
    />
  );

  return {
    destory: registeDestory(() => {
      ref.current?.remove().then(() => {
        root.unmount();
      });
    }),
  };
};
