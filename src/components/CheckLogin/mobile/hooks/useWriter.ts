import { RefObject } from "react";
import {
  checkEmail,
  createCode,
  registerUser,
  userLogin,
} from "../../../../api/login";
import { UserInfo, fetchUserInfo, updateUserName } from "../../../../api/user";
import { setToken } from "../../../../utils/token";
import { useSomeoneEditor } from "../../../SomeoneEditor/context";
import {
  codeWrite,
  errorWrite,
  hiddenImageWrite,
  importantWrite,
  inputCodeWrite,
  linkWrite,
  optionWrite,
  placeholderWrite,
  primaryWrite,
  successWrite,
  tipsTextWrite,
} from "../../../SomeoneEditor/helper";
import {
  LOGIN_SUFFIX,
  REFRESH_SUFFIX,
  REGISTER_SUFFIX,
  TIMEOUT_ERROR_TOKEN,
  TOKEN_SUFFIX,
  USER_SUFFIX,
  WECHAT_QR_LINK,
} from "../constants";
import { generateQrcode } from "../../getQrCode";
import { emailTest, md5Password } from "../../password-md5";
import { InputerStatus, UserLoginInfo } from "./useInputerState";
import { useLoginCode } from "./useLoginCode";
import { matchUUID } from "../../../../utils/uuid";
import { CreateFooterRadio } from "../../../Mobile/FooterRadio";
import html2canvas from "html2canvas";
import { createMobileQrImage } from "../util";

export const useWriter = (
  userLoginInfo: UserLoginInfo,
  setUserInfo: (userInfo: UserInfo) => void,
  changeInputerStatus: (status: InputerStatus) => void,
  updateUserEmail: (email: string) => void,
  updateUserPwd: (pwd: string) => void,
  inputerStatus: RefObject<InputerStatus>,
) => {
  const createLooper = useLoginCode();
  const { write, asyncWrite, showInputer, runOptions, hideInputer, updateConfig, clear } =
    useSomeoneEditor();

  function writeRegisterEmail() {
    showInputer();
    write(`\n正在准备身份注册指引...\n(${codeWrite('Ctrl + D')}可切换登录方式)\n\n`);
    write("请输入邮箱账号，并按回车确认\n");
    changeInputerStatus("register-email");
  }

  async function writeRegisterPasswordAfterEmail(email: string) {
    hideInputer();
    write("\n");
    if (!emailTest(email)) {
      write(errorWrite("请输入正确的邮箱地址"));
      write("\n", 500);
      writeRegisterEmail();
      return;
    }

    const { data, error } = await checkEmail(email);
    if (error) {
      write(errorWrite(error.message));
      return;
    }

    if (!data.status) {
      write(errorWrite("该邮箱已被注册"));
      write("\n");
      writeRegisterEmail();
      return;
    }

    showInputer();
    write("请输入密码，并按回车确认\n");
    updateUserEmail(email);
    changeInputerStatus("register-password");
  }

  async function writeReigster(password: string) {
    hideInputer();
    write("\n正在生成Someone...");
    updateUserPwd(md5Password(password));
    const { data, error } = await registerUser(userLoginInfo.current);
    if (error) {
      write(`\n${errorWrite(error.message)}`);
      writeRegisterEmail();
      return;
    }

    write("\n正在等待验证邮箱...");

    try {
      const token = await createLooper(data.auth_code);

      setToken(token);
    } catch (e: any) {
      if (e.message === TIMEOUT_ERROR_TOKEN) {
        asyncWrite(
          "\n" + placeholderWrite("请查看邮箱并点击验证链接后重新登录") + "\n"
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
    write(`\n正在准备邮箱验证指引...\n(${codeWrite('Ctrl + D')}可切换登录方式)\n\n`);
    write("请输入邮箱账号，并按回车确认\n");
    changeInputerStatus("email");
  }

  async function writePasswordAfterEmail(email: string) {
    showInputer();
    write("\n");
    if (!emailTest(email)) {
      write(errorWrite("请输入正确的邮箱地址"));
      write("\n\n请输入邮箱账号，并按回车确认\n", 500);
      changeInputerStatus("email");
      return;
    }

    write("\n请输入密码，并按回车确认\n");
    updateUserEmail(email);
    changeInputerStatus("password");
  }

  async function writeUserLogin(password: string) {
    hideInputer();
    write("\n正在验证...");
    updateUserPwd(md5Password(password));
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
    write(`\n正在准备公众号身份验证指引...\n(${codeWrite('Ctrl + D')}可切换登录方式)\n\n`, 500);
    hideInputer();
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
    write(() => {
      updateConfig({
        speed: 1,
      });
      return generateQrcode(WECHAT_QR_LINK);
    }).then(() => {
      updateConfig({
        speed: 13,
      });
      changeInputerStatus('wait-scan');
    });
    write(
      `\n\n2.请在公众号对话界面输入验证凭据(不区分大小写) - ${codeWrite(
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
          return;
        }

        writeSuccessInfo(data.info);
      })
      .catch((error) => {
        if (inputerStatus.current !== 'wait-scan') {
          return;
        }

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
          changeInputerStatus("qrcode");
        } else {
          write(`错误代码 - ${error.code} - ${errorWrite(error.message)}`);
        }
      });
  }


  async function writeTokenLogin() {
    showInputer();
    write(`\n正在准备授权码获取指引...`);
    write(`\n授权码被重置前永久生效，请妥善保管...`, 500)
    
    write(`\n(${codeWrite('→ 向右滑动屏幕')}可切换登录方式)\n\n`);

    write(
      `1.长按识别下方二维码并关注公众号${importantWrite("“Someone AI”")}\n\n`);
    // asyncWrite(hiddenImageWrite(QrCodeSrc));
    write(() => {
      updateConfig({
        speed: 1,
      });
      return generateQrcode(WECHAT_QR_LINK);
    }).then(() => {
      updateConfig({
        speed: 13,
      });
      changeInputerStatus('wait-scan');
    });
    write('<class|qrcode-cover>[% %]').then(createMobileQrImage)
    write(`\n2.在公众号对话界面输入${codeWrite('授权码')}重置并获取您的永久授权码\n\n`)
    write(`3.请在下方输入您的授权码，并按回车键确认：\n`)
    await write(`* 可以复制公众号返回的整段文本，输入区会自动提取授权码\n* 手机授权码复制困难？试试${linkWrite('ox.bruceau.com', 'https://ox.bruceau.com')}从手机粘贴到电脑\n`)
    changeInputerStatus('set-token');
  }

  async function writeTokenSetter(val: string) {
    const safeToken = matchUUID(val);
    if (!safeToken) {
      write(`\n${errorWrite('授权码格式错误\n\n')}`)
      write(`请在下方输入您的授权码，并按回车键确认：\n`, 500)
      return;
    }

    setToken(safeToken);
    const { data, error } = await fetchUserInfo();

    if (error) {
      write(`\n错误代码 - ${error.code} - ${errorWrite(error.message)}\n`);
      write(`请在下方输入您的授权码，并按回车键确认：\n`, 500)
      return;
    }

    writeSuccessInfo(data.info);
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
        clear();
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
    changeInputerStatus("username");
  }

  function writeLoginPicker() {
    write("\n\n");
    write(`Somone支持以下登录方式:

${importantWrite('[A]')} 使用微信订阅号生成永久授权码 ${tipsTextWrite('推荐')}

${importantWrite('[B]')} 使用微信订阅号验证码授权

${importantWrite('[C]')} 将使用您在Someone的邮箱账号授权

${successWrite('[D]')} 注册你的Someone邮箱账号

`)

    write('请选择你想要的登录方式，并点击底部对应字母').then(() => {
      const footerRadio = CreateFooterRadio({
        options: ['A', 'B', "C", "D"],
        onClick: (key: string) => {
          write('\n\n');
          footerRadio.destory();
          key === 'A' && writeTokenLogin();
          key === 'B' && writeWechatLogin();
          key === 'C' && writeUserLoginEmail();
          key === 'D' && writeRegisterEmail();
        }
      })
    })

    updateConfig({
      suffixs: [LOGIN_SUFFIX, USER_SUFFIX, REGISTER_SUFFIX],
    });
    changeInputerStatus("login");
  }

  async function getUserInfo() {
    const { data, error } = await fetchUserInfo();
    if (error) {
      asyncWrite(`\n获取身份信息失败 - ${error.message}`);
      writeLoginPicker();
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

    welecomUserWrite(data.info);
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

  return {
    welecomUserWrite,
    writePasswordAfterEmail,
    writeRefresh,
    writeRegisterEmail,
    registerUser,
    reloadUserInfo,
    handleUpdateUser,
    getUserInfo,
    writeWechatLogin,
    writeUserLogin,
    writeRegisterPasswordAfterEmail,
    writeUserLoginEmail,
    writeReigster,
    writeLoginPicker,
    writeTokenLogin,
    writeTokenSetter,
  };
};
