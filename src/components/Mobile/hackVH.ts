import { isMobile } from "../ErrorPage/check";



export function hackVH () {
    if (!isMobile()) return;
    let watcher: number;
    const windowVH = window.innerHeight / 100;
    const styleNode = document.createElement('style');
    styleNode.setAttribute('type', 'text/css');
    styleNode.innerText = `:root{--vh:${windowVH}px}`;
    document.head.appendChild(styleNode);

    function resizeCallback() {
        window.clearTimeout(watcher);
        watcher = window.setTimeout(() => {
            const newVH = window.innerHeight / 100;
            styleNode.innerText = `:root{--vh:${newVH}px}`;
            // alert('resize');
        }, 300);
    }

    window.addEventListener('resize', resizeCallback);
}