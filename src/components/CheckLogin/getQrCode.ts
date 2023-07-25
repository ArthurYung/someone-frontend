import * as qrcode from './qrcodeTerminal';

function lineSpace(str: string, index: number) {
  return str ? `<block|qrcode line-${index}>[%${str}%]` : '';
}


export function generateQrcode(src: string) {
  return new Promise<string>((resolve) => {
    qrcode.generate(src, { small: true }, (str) => {
      resolve(str.split('\n').map(lineSpace).join(''));
    });
  });
}