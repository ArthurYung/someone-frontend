import { FC } from "react";
import './style.scss';

export const LayoutMain: FC<{ children: any }> = ({children}) => {
  return  <main className="layout-main">
      { children }
    </main>
}