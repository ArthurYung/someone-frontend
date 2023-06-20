import { FC, useEffect, useRef, useState } from "react";
import { useSomeoneEditor } from "../SomeoneEditor/context";
import { UserInfo, fetchUserInfo, updateUserName } from "../../api/user";
import {
  codeWrite,
  errorWrite,
  importantWrite,
  placeholderWrite,
  primaryWrite,
  successWrite,
  useSomeoneEnterWatch,
} from "../SomeoneEditor/helper";
import { checkCode, checkEmail, createCode, registerUser, userLogin } from "../../api/login";
import { setToken } from "../../utils/token";
import { UserInfoProvider } from "./use-user";
import "./style.scss";
import { generateQrcode } from "./getQrCode";

const MAX_LOOP_COUNT = 60;
const REFRESH_SUFFIX = "/refresh";
const LOGIN_SUFFIX = "/login";
const USER_SUFFIX = "/user";
const REGISTER_SUFFIX = "/register";
const TIMEOUT_ERROR_TOKEN = "TIMEOUT";
const WECHAT_QR_LINK = "http://weixin.qq.com/r/uCpCWujEK7VUraw593_q";

const useLoginCode = () => {
  const loopRef = useRef({ code: "", timeout: 0, loopCount: 0 });
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
  const inputerStatus = useRef<
    "login" | "email" | "password" | "username" | "qrcode" | "none" | "register-email" | "register-password"
  >("none");
  const userLoginInfo = useRef({
    email: "",
    password: "",
  });
  const { write, asyncWrite, showInputer, hideInputer, updateConfig } =
    useSomeoneEditor();
  const createLooper = useLoginCode();

  function writeRegisterEmail() {
    showInputer();
    write("请输入邮箱账号，并按回车确认\n");
    inputerStatus.current = "register-email";
  }

  async function writeRegisterPasswordAfterEmail(email: string) {
    hideInputer();
    write("\n");
    const { data, error } = await checkEmail(email);
    if (error) {
      write(errorWrite(error.message));
      return;
    }

    if (!data.status) {
      write(errorWrite("该邮箱已被注册"));
      writeRegisterEmail();
      return;
    }

    showInputer();
    write("请输入密码，并按回车确认\n");
    userLoginInfo.current.email = email;
    inputerStatus.current = "register-password";
  }

  async function writeReigster(password: string) {
    hideInputer();
    write("\n正在生成Someone...");
    userLoginInfo.current.password = password;
    const { data, error } = await registerUser(userLoginInfo.current)
    if (error) {
      write(`\n${errorWrite(error.message)}`);
      writeRegisterEmail();
      return;
    }

    write("\n正在等待验证邮箱...")

    try {
      const token = await createLooper(data.auth_code);

      setToken(token);
    } catch (e: any) {
      if (e.message === TIMEOUT_ERROR_TOKEN) {
        asyncWrite(
          "\n" +
          placeholderWrite("请查看邮箱并点击验证链接后重新登录") +
            "\n"
        );
      }
      return;
    }

    const { data: userInfo, error: userError } = await fetchUserInfo();

    if (userError) {
      write(`错误代码 - ${userError.code} - ${errorWrite(userError.message)}`);

      return;
    }

    writeSuccessInfo(userInfo.info);
  } 


  function writeUserLoginEmail() {
    showInputer();
    asyncWrite("\n正在准备身份验证指引...\n\n", 500);
    write("请输入邮箱账号，并按回车确认\n");
    inputerStatus.current = "email";
  }

  async function writePasswordAfterEmail(email: string) {
    // hideInputer();
    // write("\n");
    // const { data, error } = await checkEmail(email);
    // if (error) {
    //   write(errorWrite(error.message));
    //   return;
    // }

    // if (!data.status) {
    //   write(errorWrite("该邮箱已被注册"));
    //   writeUserLoginEmail();
    //   return;
    // }

    showInputer();
    write("\n请输入密码，并按回车确认\n");
    userLoginInfo.current.email = email;
    inputerStatus.current = "password";
  }

  async function writeUserLogin(password: string) {
    hideInputer();
    write("\n正在验证...");
    userLoginInfo.current.password = password;
    const { data, error } = await userLogin(userLoginInfo.current);
    if (error) {
      write(errorWrite(error.message));
      writeUserLoginEmail();
      return;
    }

    setToken(data.token);
    const { data: userInfo, error: userError } = await fetchUserInfo();

    if (userError) {
      write(errorWrite("用户数据获取失败，请刷新重试"));
      hideInputer();
      return;
    }

    writeSuccessInfo(userInfo.info);
  }

  async function writeWechatLogin() {
    asyncWrite("\n正在准备身份验证指引...\n\n", 500);
    const { data, error } = await createCode();
    if (error) {
      write(`错误代码 - ${error.code} - ${errorWrite(error.message)}`);
      return;
    }

    write(
      `1.请搜索微信公众号 - ${importantWrite(
        "“Someone AI”"
      )} 或微信扫描下方二维码关注：\n`
    );
    write(() => generateQrcode(WECHAT_QR_LINK));
    write(
      `\n2.请在公众号对话界面输入验证凭据(不区分大小写) - ${codeWrite(
        data.auth_code
      )}\n`
    )
      .then(() => createLooper(data.auth_code))
      .then((token) => {
        setToken(token);
        return fetchUserInfo();
      })
      .then(({ data, error }) => {
        if (error) {
          write(errorWrite("用户数据获取失败，请刷新重试"));
          hideInputer();
          return;
        }

        writeSuccessInfo(data.info);
      })
      .catch((error) => {
        if (error.message === TIMEOUT_ERROR_TOKEN) {
          asyncWrite(
            placeholderWrite(
              `验证凭据已失效，在下方输入${REFRESH_SUFFIX}后输入回车可刷新凭据`
            ) + "\n"
          );
          updateConfig({
            suffixs: [REFRESH_SUFFIX],
          });
          showInputer();
          inputerStatus.current = "qrcode";
        } else {
          write(`错误代码 - ${error.code} - ${errorWrite(error.message)}`);
        }
      });
  }

  async function writeRefresh() {
    hideInputer();
    const { data, error } = await createCode();
    if (error) {
      write(`\n刷新失败. - ${error.code} - ${errorWrite(error.message)}`);
      return;
    }

    if (!data?.auth_code) return;
    await write(
      `\n请在公众号对话界面输入验证凭据 - ${codeWrite(data.auth_code)}\n`
    );

    try {
      const token = await createLooper(data.auth_code);

      setToken(token);
    } catch (e: any) {
      if (e.message === TIMEOUT_ERROR_TOKEN) {
        asyncWrite(
          placeholderWrite("验证凭据已失效，请输入/refresh后回车刷新凭据") +
            "\n"
        );
        showInputer();
      }
      return;
    }

    const { data: userInfo, error: userError } = await fetchUserInfo();

    if (userError) {
      write(`错误代码 - ${userError.code} - ${errorWrite(userError.message)}`);

      return;
    }

    writeSuccessInfo(userInfo.info);
  }

  function welecomUserWrite(userInfo: UserInfo) {
    write("\n对话系统已开启 - ", 500);
    write(primaryWrite("Welecome! ")).then(() => {
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
    write("\n你好Master，我该怎么称呼你呢？\n");
    write("你可以在下方输入你想要设置的昵称，然后回车保存\n");
    inputerStatus.current = "username";
  }

  async function getUserInfo() {
    const { data, error } = await fetchUserInfo();
    if (error) {
      showInputer();
      asyncWrite(`\n获取身份信息失败 - ${error.message}`);
      write("\n\n");
      write(`请重新选择身份验证方式：
- 输入${codeWrite(LOGIN_SUFFIX)} - 免注册模式，使用微信订阅号验证码授权
- 输入${codeWrite(USER_SUFFIX)} - 邮箱验证模式，将使用您在Someone的账号授权
- 输入${codeWrite(REGISTER_SUFFIX)} - 立即注册你的Someone邮箱账号
`);
      updateConfig({
        suffixs: [LOGIN_SUFFIX, USER_SUFFIX, REGISTER_SUFFIX],
      });
      inputerStatus.current = "login";
      return;
    }

    writeSuccessInfo(data.info);
  }

  async function handleUpdateUser(userName: string) {
    const { error } = await updateUserName({ user_name: userName });
    if (error) {
      write("更新失败，请刷新重试...\n");
      write(errorWrite(`${error.code} - ${error.message}\n`));
      hideInputer();
      return;
    }

    const { data, error: userError } = await fetchUserInfo();
    if (userError) {
      write("获取用户信息失败，请刷新重试...");
      write(errorWrite(`${userError.code} - ${userError.message}\n`));
      hideInputer();
      return;
    }

    return data;
  }

  async function reloadUserInfo() {
    const res = await fetchUserInfo();
    if (res.error) {
      write(`${res.error.message}\n`);
      hideInputer();
    } else {
      setUserInfo(res.data.info);
    }
    return res;
  }

  useSomeoneEnterWatch((val) => {
    if (userInfo) return;

    if (inputerStatus.current === "username") {
      if (!/^[\u4e00-\u9fa5a-zA-Z]{2,20}$/.test(val)) {
        write("系统识别失败，仅支持2-20个中文/英文字母组成\n");
        return;
      }

      hideInputer();
      write("正在设置中...\n");
      handleUpdateUser(val).then((userInfo) => {
        if (userInfo) {
          welecomUserWrite(userInfo.info);
        }
      });
      return;
    }

    // 刷新code
    if (inputerStatus.current === "qrcode" && val === REFRESH_SUFFIX) {
      writeRefresh();
      return;
    }

    if (inputerStatus.current === "email") {
      writePasswordAfterEmail(val);
      return;
    }

    if (inputerStatus.current === "password") {
      writeUserLogin(val);
      return;
    }

    if (inputerStatus.current === "login" && val === LOGIN_SUFFIX) {
      writeWechatLogin();
      return;
    }

    if (inputerStatus.current === "login" && val === USER_SUFFIX) {
      writeUserLoginEmail();
      return;
    }

    if (inputerStatus.current ==="login" && val === REGISTER_SUFFIX) {
      writeRegisterEmail();
      return;
    }

    if (inputerStatus.current === "register-email") {
      writeRegisterPasswordAfterEmail(val);
      return;
    }

    if (inputerStatus.current === "register-password") {
      writeReigster(val);
      return;
    }
  });

  useEffect(() => {
    write("身份确认中...");
    getUserInfo();
  }, []);

  return (
    <UserInfoProvider value={{ userInfo: userInfo!, reloadUserInfo }}>
      {userInfo && children}
    </UserInfoProvider>
  );
};
