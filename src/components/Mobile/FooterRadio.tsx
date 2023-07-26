import { createRef, forwardRef } from "react";
import { createRoot } from "react-dom/client";
import { useVisibleAnimate } from "./useAnimate";
import './Footer.scss';

const cls = "mobile-footer";

interface FooterRadioMethods {
  remove: () => Promise<void>;
}

export const FooterRadio = forwardRef<
FooterRadioMethods,
  {
    options: string[];
    onClick: (key: string) => void;
  }
>(({ options, onClick }, ref) => {
  const { visibleState } = useVisibleAnimate(ref);


  return (
    <div className={cls}>
      <div className={`${cls}--inner ${visibleState}`}>
        {options.map((item) => (
          <div
            key={item}
            className={`${cls}--item`}
            onClick={() => onClick(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
});

export const CreateFooterRadio = (config: {
  options: string[],
  onClick: (key: string) => void;
}) => {
  const el = document.createElement('div')
  const root = createRoot(el);
  const ref = createRef<FooterRadioMethods>();

  document.body.appendChild(el);
  root.render(<FooterRadio ref={ref} options={config.options} onClick={config.onClick}/>);

  return {
    destory: () => {
      ref.current?.remove().then(() => {
        root.unmount();
      })
    }
  }
}