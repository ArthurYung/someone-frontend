import { FC } from "react";
import './style.scss';
import { isMobile } from "../ErrorPage/check";

export const LayoutMain: FC<{ children: any }> = ({children}) => {
  return  <main className={"layout-main" + isMobile() ? ' mobile' : ''}>
      { children }
    </main>
}