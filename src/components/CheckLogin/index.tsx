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
  const { write, asyncWrite, showInputer, updateConfig } = useSomeoneEditor();

  write(`
尚未登陆 请扫描下方二维码完成登录
`, 0).then(() => {
  console.log('no test')
})

write(`
尚未登陆 请扫描下方二维码完成登录
尚未登陆 请扫描下方二维码完成登录
`, 0).then(() => {
  console.log('no test')
})

  write(generateQrcode, 20000).then(() => {
    console.log('test');
  })

  showInputer();

  updateConfig({
    suffixs: ['/test', '/teppd']
  })

  return children;
}

