import { ComponentType, FC } from "react";
import { isMobile } from "../ErrorPage/check";

const isMobilePlatform = isMobile();

export const PlatformRender =
  (PC: ComponentType<any>, Mobile: ComponentType<any>): FC<{ children: any }> =>
  ({ children }) =>
    isMobilePlatform ? <Mobile>{children}</Mobile> : <PC>{children}</PC>;
