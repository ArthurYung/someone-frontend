import { FC, useEffect, useRef, useState } from 'react';
import { useSomeoneEditor } from '../SomeoneEditor/context';
import qrcode from 'qrcode-terminal';
import { UserInfo, fetchUserInfo } from '../../api/user';
import { errorWrite, importantWrite, placeholderWrite, useSomeoneEnterWatch } from '../SomeoneEditor/helper';
import { checkCode, createCode } from '../../api/login';

const MAX_LOOP_COUNT = 10;
const REFRESH_SUFFIX = '/refresh';
const TIMEOUT_ERROR_TOKEN = 'TIMEOUT';

function space() {
  return `<style|color: transparent; text-shadow: none>[%█%]`
}

function generateQrcode() {
  return new Promise<string>((resolve) => {
    qrcode.generate('https://www.baidu.com', { small: true }, (str) => {
      resolve(str.replace(/ /g, space()))
    });
  })
}

const useLoginCode = () => {
  const loopRef = useRef({ code: '', timeout: 0, loopCount: 0 });
  function startLoop(code: string) {
    return new Promise<string>((resolve, reject) => {
      loopRef.current.code = code;
      loopRef.current.loopCount = 0;
      window.clearTimeout(loopRef.current.timeout);
      async function looper() {
        const { data, error } = await checkCode(code);
        if (error) {
          reject(error);
          return;
        }

        if (data.token) {
          resolve(data.token);
          return;
        }

        if (loopRef.current.loopCount > MAX_LOOP_COUNT) {
          reject({
            message: TIMEOUT_ERROR_TOKEN,
          })
        }

        loopRef.current.loopCount += 1;
        loopRef.current.timeout = window.setTimeout(looper, 1000);
      }

      looper();
    })
  }

  useEffect(() => {
    window.clearTimeout(loopRef.current.timeout);
  }, [])

  return startLoop
}

export const CheckLogin: FC<{ children: any }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const { write, asyncWrite, showInputer, hideInputer, updateConfig } = useSomeoneEditor();
  const createLooper = useLoginCode();

  async function writeWechatLogin() {
    asyncWrite('\n正在准备身份验证指引...\n\n', 500);
    const { data, error } = await createCode();
    if (error) {
      write(`错误代码 - ${error.code} - ${errorWrite(error.message)}`);
      return;
    }

    write(`1.请搜索微信公众号 - ${importantWrite("“Someone AI”")} 或微信扫描下方二维码关注：\n`)
    write(generateQrcode);
    write(`\n2.请在公众号对话界面输入验证凭据 - ${importantWrite(data.auth_code)}\n`)
      .then(() => createLooper(data.auth_code))
      .then((token) => {
        console.log(token)
      })
      .catch(error => {
        if (error.message === TIMEOUT_ERROR_TOKEN) {
          asyncWrite(placeholderWrite('验证凭据已失效，输入/refresh刷新凭据') + '\n');
          updateConfig({
            suffixs: [REFRESH_SUFFIX]
          })
          showInputer();
        } else {
          write(`错误代码 - ${error.code} - ${errorWrite(error.message)}`)
        }
      })
  }


  async function getUserInfo() {
    const { data, error } = await fetchUserInfo();
    if (error) {
      asyncWrite(`\n获取身份信息失败 - ${error.message}`);
      writeWechatLogin();
      return;
    }
    // console.log(res);
    write(generateQrcode)
    showInputer();
  }

  useSomeoneEnterWatch((val) => {
    if (userInfo || val !== REFRESH_SUFFIX) return;
    hideInputer();
    createCode().then(({ data, error }) => {
      if (error) {
        write(`\n刷新失败. - ${error.code} - ${errorWrite(error.message)}`);
        return;
      }

      return data
    })
    .then(data => {
      if (!data?.auth_code) return;
      write(`\n请在公众号对话界面输入验证凭据 - ${importantWrite(data.auth_code)}\n`)
      .then(() => createLooper(data.auth_code))
      .then((token) => {
        console.log(token)
      })
      .catch(error => {
        if (error.message === TIMEOUT_ERROR_TOKEN) {
          asyncWrite(placeholderWrite('验证凭据已失效，输入/refresh刷新凭据') + '\n');
          showInputer();
        } else {
          write(`错误代码 - ${error.code} - ${errorWrite(error.message)}`)
        }
      })
    })
  })

  useEffect(() => {
    write('\n身份确认中...');
    getUserInfo();
  }, [])


  return children;
}

