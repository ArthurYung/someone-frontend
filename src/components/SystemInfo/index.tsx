import { SystemInfoPC } from "./pc";
import { SystemInfoMobile } from "./mobile";
import { PlatformRender } from "../Mobile/PlatformRender";

export const SystemInfo = PlatformRender(SystemInfoPC, SystemInfoMobile);