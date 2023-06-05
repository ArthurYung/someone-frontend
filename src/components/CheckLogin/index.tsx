import { FC, useEffect } from 'react';
import { useSomeoneEditor } from '../SomeoneEditor/context';
import qrcode from 'qrcode-terminal';
import { fetchUserInfo } from '../../api/auth';

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

  async function getUserInfo() {
    const res =  await fetchUserInfo();
    console.log(res);
    showInputer();
  }

  useEffect(() => {
    getUserInfo();
  }, [])


  // updateConfig({
  //   suffixs: ['/test', '/teppd']
  // })

  return children;
}

