import { EditorGuidePC } from "./pc";
import { PlatformRender } from "../Mobile/PlatformRender";
import { EditorGuideMobile } from "./mobile";

export const EditorGuide = PlatformRender(EditorGuidePC, EditorGuideMobile);