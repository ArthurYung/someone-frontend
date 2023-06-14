import { FC, useEffect, useRef, useState } from 'react';
import { useSomeoneEditor } from '../SomeoneEditor/context';
import { UserInfo, fetchUserInfo, updateUserName } from '../../api/user';
import {
  codeWrite,
  errorWrite,
  importantWrite,
  placeholderWrite,
  primaryWrite,
  successWrite,
  useSomeoneEnterWatch,
} from '../SomeoneEditor/helper';
import { checkCode, createCode } from '../../api/login';
import { setToken } from '../../utils/token';
import { UserInfoProvider } from './use-user';
import './style.scss';
import { generateQrcode } from './getQrCode';

const MAX_LOOP_COUNT = 60;
const REFRESH_SUFFIX = '/refresh';
const TIMEOUT_ERROR_TOKEN = 'TIMEOUT';
const WECHAT_QR_LINK = 'http://weixin.qq.com/r/uCpCWujEK7VUraw593_q';


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
          });
          return;
        }

        loopRef.current.loopCount += 1;
        loopRef.current.timeout = window.setTimeout(looper, 1000);
      }

      looper();
    });
  }

  useEffect(() => {
    window.clearTimeout(loopRef.current.timeout);
  }, []);

  return startLoop;
};

export const CheckLogin: FC<{ children: any }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [userNameSetting, setUserNameSetting] = useState(false);
  const {
    write,
    asyncWrite,
    showInputer,
    hideInputer,
    updateConfig,
  } = useSomeoneEditor();
  const createLooper = useLoginCode();

  async function writeWechatLogin() {
    asyncWrite('\n正在准备身份验证指引...\n\n', 500);
    const { data, error } = await createCode();
    if (error) {
      write(`错误代码 - ${error.code} - ${errorWrite(error.message)}`);
      return;
    }

    write(
      `1.请搜索微信公众号 - ${importantWrite(
        '“Someone AI”'
      )} 或微信扫描下方二维码关注：\n`
    );
    write(() => generateQrcode(WECHAT_QR_LINK));
    write(
      `\n2.请在公众号对话界面输入验证凭据(不区分大小写) - ${codeWrite(data.auth_code)}\n`
    )
      .then(() => createLooper(data.auth_code))
      .then((token) => {
        setToken(token);
        return fetchUserInfo();
      })
      .then(({ data, error }) => {
        if (error) {
          write(errorWrite('用户数据获取失败，请刷新重试'));
          hideInputer();
          return;
        }

        writeSuccessInfo(data.info);
      })
      .catch((error) => {
        if (error.message === TIMEOUT_ERROR_TOKEN) {
          asyncWrite(
            placeholderWrite('验证凭据已失效，输入/refresh刷新凭据') + '\n'
          );
          updateConfig({
            suffixs: [REFRESH_SUFFIX],
          });
          showInputer();
        } else {
          write(`错误代码 - ${error.code} - ${errorWrite(error.message)}`);
        }
      });
  }

  function welecomUserWrite(userInfo: UserInfo) {
    write('\n对话系统已开启 - ', 500)
    write(primaryWrite('Welecome! ')).then(() => {
      setTimeout(() => {
        // clear
        setUserInfo(userInfo);
      }, 1000);
    });
  }

  function writeSuccessInfo(userInfo: UserInfo) {
    if (userInfo.user_name) {
      asyncWrite(`\n\n`);
      welecomUserWrite(userInfo);
      return;
    }

    showInputer();
    write('\n你好Master，我该怎么称呼你呢？\n');
    write('你可以在下方输入你想要设置的昵称，然后回车保存\n')
    setUserNameSetting(true);
  }

  async function getUserInfo() {
    const { data, error } = await fetchUserInfo();
    if (error) {
      asyncWrite(`\n获取身份信息失败 - ${error.message}`);
      writeWechatLogin();
      return;
    }

    writeSuccessInfo(data.info)
  }

  async function handleUpdateUser(userName: string) {
    const { error } = await updateUserName({ user_name: userName });
    if (error) {
      write('更新失败，请刷新重试...\n')
      write(errorWrite(`${error.code} - ${error.message}\n`));
      hideInputer();
      return;
    }

    const { data, error: userError } = await fetchUserInfo();
    if (userError) {
      write('获取用户信息失败，请刷新重试...')
      write(errorWrite(`${userError.code} - ${userError.message}\n`));
      hideInputer();
      return;
    }

    return data;
  }

  async function reloadUserInfo() {
    const { data, error } = await fetchUserInfo();
    if (error) {
      write(`${error.message}\n`);
      hideInputer();
      return;
    }

    setUserInfo(data.info);
  }

  useSomeoneEnterWatch((val) => {
    if (userInfo) return;

    if (userNameSetting) {
      if (!/^[\u4e00-\u9fa5a-zA-Z]{2,20}$/.test(val)) {
        write('系统识别失败，仅支持2-20个中文/英文字母组成\n');
        return;
      }

      hideInputer();
      write('正在设置中...\n');
      handleUpdateUser(val).then((userInfo) => {
        if (userInfo) {
          welecomUserWrite(userInfo.info);
        }
      });
      return;
    }

    // 刷新code
    if (val === REFRESH_SUFFIX) {
      hideInputer();
      createCode()
        .then(({ data, error }) => {
          if (error) {
            write(`\n刷新失败. - ${error.code} - ${errorWrite(error.message)}`);
            return;
          }

          return data;
        })
        .then((data) => {
          if (!data?.auth_code) return;
          write(
            `\n请在公众号对话界面输入验证凭据 - ${codeWrite(
              data.auth_code
            )}\n`
          )
            .then(() => createLooper(data.auth_code))
            .then((token) => {
              setToken(token);
              return fetchUserInfo()
            })
            .then(({ data, error}) => {
              if (error) return Promise.reject(error);
              writeSuccessInfo(data.info);
            }) 
            .catch((error) => {
              if (error.message === TIMEOUT_ERROR_TOKEN) {
                asyncWrite(
                  placeholderWrite('验证凭据已失效，请输入/refresh后回车刷新凭据') +
                    '\n'
                );
                showInputer();
              } else {
                write(
                  `错误代码 - ${error.code} - ${errorWrite(error.message)}`
                );
              }
            });
        });

      return;
    }
  });

  useEffect(() => {
    write('身份确认中...');
    getUserInfo();
  }, []);

  return (
    <UserInfoProvider value={{userInfo: userInfo!, reloadUserInfo}}>
      {userInfo && children}
    </UserInfoProvider>
  );
};
