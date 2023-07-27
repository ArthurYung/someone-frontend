import html2canvas from 'html2canvas';
import { matchUUID } from '../../../utils/uuid';
import { setToken } from '../../../utils/token';

export function createMobileQrImage() {
  const graphRoot = document.querySelector('.qrcode-cover') as HTMLElement;
  if (!graphRoot) return;

  document.querySelectorAll('.qrcode').forEach((node) => {
    graphRoot.appendChild(node);
  });

  setTimeout(async () => {
    const canvas = await html2canvas(graphRoot as HTMLElement, {
      backgroundColor: null,
    });

    const img = new Image();
    img.src = canvas.toDataURL();
    img.style.height = canvas.style.height;
    graphRoot.innerHTML = '';
    graphRoot.appendChild(img);
  }, 34);
}

export async function checkCliboardData() {
  try {
    // const allowClibard = confirm('请求访问剪切板内容')
    const res = await navigator.clipboard.readText();
    const safeToken = matchUUID(res);
    console.log('readtext: ', res)
    if (safeToken) setToken(safeToken);
  } catch(e) {
    console.log('fetch err:', e);
    //
  }
}