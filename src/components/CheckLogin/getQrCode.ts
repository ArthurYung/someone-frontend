import * as qrcode from './qrcodeTerminal';

function lineSpace(str: string) {
  return str ? `<style|letter-spacing:3px>[%${str}%]` : '';
}

export function generateQrcode(src: string) {
  return new Promise<string>((resolve) => {
    qrcode.generate(src, { small: true }, (str) => {
      resolve(str.split('\n').map(lineSpace).join('\n'));
    });
  });
}