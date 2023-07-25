import html2canvas from 'html2canvas';

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
    graphRoot.innerHTML = '';
    graphRoot.appendChild(img);
  }, 34);
}
