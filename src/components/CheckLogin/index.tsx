import { FC } from 'react';
import { useSomeoneEditor } from '../SomeoneEditor/context';
import qrcode from 'qrcode-terminal';

function space() {
  return `<style|color: transparent; text-shadow: none>[%█%]`
}

function generateQrcode() {
  return new Promise<string>((resolve) => {
    qrcode.generate('https://www.baidu.com', {small: true}, (str) => {
      resolve(str.replace(/ /g, space()))
    });
  })
}

export const CheckLogin: FC<{ children: any }> = ({ children }) => {
  const { write, asyncWrite, showInputer } = useSomeoneEditor();

  write(`
尚未登陆 请扫描下方二维码完成登录
`, 0);

  // write(generateQrcode, 2000);

  showInputer();

  return children;
}

