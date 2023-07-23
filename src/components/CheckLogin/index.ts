import { CheckLoginPC } from "./pc";
import { PlatformRender } from "../Mobile/PlatformRender";
import { CheckLoginMobile } from "./mobile";

export const CheckLogin = PlatformRender(CheckLoginPC, CheckLoginMobile);