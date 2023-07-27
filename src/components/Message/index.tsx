import { MessageContainerPC } from "./pc";
import { PlatformRender } from "../Mobile/PlatformRender";
import { MessageContainerMobile } from "./mobile";

export const MessageContainer = PlatformRender(MessageContainerPC, MessageContainerMobile);