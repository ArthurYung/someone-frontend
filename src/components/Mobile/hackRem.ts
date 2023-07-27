import { isMobile } from "../ErrorPage/check";

(function hackRem() {
    if (!isMobile()) return;
    const baseSize = document.body.offsetWidth / 390 || 1;
    const styleNode = document.createElement('style');
    styleNode.type = "text/css";
    styleNode.innerText = `:root{font-size: ${baseSize}px}`
    document.head.appendChild(styleNode);
})()

