import { CheckLoginPC } from "./pc";
import { PlatformRender } from "../Mobile/PlatformRender";
import { CheckLoginMobile } from "./mobile";
import './style.scss'

export const CheckLogin = PlatformRender(CheckLoginPC, CheckLoginMobile);