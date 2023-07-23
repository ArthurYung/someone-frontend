import { createRef, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { createRoot } from "react-dom/client";
import './FooterRadio.scss';

const cls = "mobile-footer-radio";

const DURATION_TIME = 80;
const ANMIATE_TIME = 300;

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
  const [renderOptions, setRenderOptions] = useState(
    options.map((item) => ({ key: item, visible: false }))
  );

  function showRadios() {
    for (let i = 0; i < renderOptions.length; i++) {
      setTimeout(() => {
        setRenderOptions((prev) => {
          prev[i] = {
            ...prev[i],
            visible: true,
          };

          return [...prev];
        });
      }, DURATION_TIME * i);
    }
  }

  function hideRadios() {
    return new Promise<void>((resolve) => {
      for (let i = 0; i < renderOptions.length; i++) {
        setTimeout(() => {
          setRenderOptions((prev) => {
            prev[i] = {
              ...prev[i],
              visible: false,
            };

            return [...prev];
          });

          if (!i) {
            setTimeout(resolve, ANMIATE_TIME);
          }
        }, DURATION_TIME * (renderOptions.length - 1 - i));
      }
    });
  }

  useEffect(() => {
    setTimeout(showRadios, 34)
  }, []);

  useImperativeHandle(ref, () => ({
    remove: hideRadios
  }))

  return (
    <div className={cls}>
      {renderOptions.map((item) => (
        <div
          key={item.key}
          className={`${cls}--item ${item.visible ? "visible" : ""}`}
          onClick={() => onClick(item.key)}
        >
          {item.key}
        </div>
      ))}
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