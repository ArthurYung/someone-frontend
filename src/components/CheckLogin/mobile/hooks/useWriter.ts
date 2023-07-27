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
import { createMobileQrImage } from "../util";
import { CreateFooterInputer } from "../../../Mobile/FooterInputer";

export const useWriter = (
  userLoginInfo: UserLoginInfo,
  setUserInfo: (userInfo: UserInfo) => void,
  changeInputerStatus: (status: InputerStatus) => void,
  updateUserEmail: (email: string) => void,
  updateUserPwd: (pwd: string) => void,
  inputerStatus: RefObject<InputerStatus>,
) => {
  const createLooper = useLoginCode();
  const { write, asyncWrite, showInputer, hideInputer, updateConfig, clear, hideCursor } =
    useSomeoneEditor();

  async function writeRegisterEmail() {
    write(`\n正在准备身份注册指引...\n(${codeWrite('→ 向右滑动屏幕')}可切换登录方式)\n\n`);
    await write("请在底部输入邮箱账号，并点击右侧按钮提交\n");
    changeInputerStatus("register-email");
    hideCursor();
    const FooterInputer = CreateFooterInputer({
      placeholder: '请输入您的邮箱',
      onSubmit(val) {
        if (!emailTest(val)) {
          write("\n");
          write(errorWrite("请输入正确的邮箱地址"));
          write("\n", 500).then(hideCursor)
          return;
        }
    
        writeRegisterPasswordAfterEmail(val);
        FooterInputer.destory();
      }
    });
  }

  async function writeRegisterPasswordAfterEmail(email: string) {
    const { data, error } = await checkEmail(email);
    if (error) {
      write(errorWrite(error.message));
      return;
    }

    if (!data.status) {
      write("\n");
      write(errorWrite("该邮箱已被注册"));
      write("\n");
      writeRegisterEmail();
      return;
    }

    await write("\n请在底部输入密码，并点击右侧按钮提交\n");
    updateUserEmail(email);
    changeInputerStatus("register-password");
    hideCursor();
    const FooterInputer = CreateFooterInputer({
      placeholder: '请输入您的密码',
      onSubmit(val) {
        writeReigster(val);
        FooterInputer.destory();
      }
    });
  }

  async function writeReigster(password: string) {
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

  async function writeUserLoginEmail() {
    write(`\n正在准备邮箱验证指引...\n(${codeWrite('→ 向右滑动屏幕')}可切换登录方式)\n\n`);
    await write("请在底部输入邮箱账号，并点击右侧按钮提交\n");
    changeInputerStatus("email");
    hideCursor();
    const FooterInputer = CreateFooterInputer({
      placeholder: '请输入您的邮箱',
      onSubmit(val) {
        writePasswordAfterEmail(val);
        FooterInputer.destory();
      }
    });
  }

  async function writePasswordAfterEmail(email: string) {
    write("\n");
    if (!emailTest(email)) {
      write(errorWrite("请输入正确的邮箱地址"));
      await changeInputerStatus("email");
      hideCursor();
      const FooterInputer = CreateFooterInputer({
        placeholder: '请输入您的邮箱',
        onSubmit(val) {
          writePasswordAfterEmail(val);
          FooterInputer.destory();
        }
      });
      return;
    }

    write("\n请在底部输入密码，并点击右侧按钮提交\n");
    updateUserEmail(email);
    await changeInputerStatus("password");
    hideCursor();
    const FooterInputer = CreateFooterInputer({
      placeholder: '请输入您的密码',
      onSubmit(val) {
        writeUserLogin(val);
        FooterInputer.destory();
      }
    });
  }

  async function writeUserLogin(password: string) {
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


  async function writeTokenLogin() {
    write(`\n正在准备授权码获取指引...`);
    write(`\n授权码被重置前永久生效，请妥善保管...`, 500)
    
    write(`\n(${codeWrite('→ 向右滑动屏幕')}可切换登录方式)\n\n`);

    write(
      `1.长按保存下方二维码，前往${importantWrite('"微信扫一扫"')}，关注公众号${importantWrite("“Someone AI”")}\n`);
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
    await write(`3.将授权码粘贴至底部输入框内，并点击右侧按钮提交\n`)
    hideCursor();
    changeInputerStatus('set-token');
    const FooterInputer = CreateFooterInputer({
      placeholder: '请输入您的授权码',
      onSubmit(val) {
        writeTokenSetter(val);
        FooterInputer.destory();
      }
    });
  }

  async function writeTokenSetter(val: string) {
    const safeToken = matchUUID(val);
    if (!safeToken) {
      write(`\n${errorWrite('授权码格式错误\n\n')}`)
      await write(`请重新输入您的授权码，并点击右侧按钮提交\n`, 500);
      hideCursor();
      const FooterInputer = CreateFooterInputer({
        placeholder: '请输入您的授权码',
        onSubmit(val) {
          writeTokenSetter(val);
          FooterInputer.destory();
        }
      });
      return;
    }

    setToken(safeToken);
    const { data, error } = await fetchUserInfo();

    if (error) {
      write(`\n错误代码 - ${error.code} - ${errorWrite(error.message)}\n`);
      await write(`请重新输入您的授权码，并点击右侧按钮提交\n`, 500);
      hideCursor();
      const FooterInputer = CreateFooterInputer({
        placeholder: '请输入您的授权码',
        onSubmit(val) {
          writeTokenSetter(val);
          FooterInputer.destory()
        }
      });
      return;
    }

    writeSuccessInfo(data.info);
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

  async function writeSuccessInfo(userInfo: UserInfo) {
    if (userInfo.user_name) {
      asyncWrite(`\n\n`);
      welecomUserWrite(userInfo);
      return;
    }

    write("\n你好Master，我该怎么称呼你呢？\n");
    await write("请输入你想要设置的昵称，并点击右侧按钮提交\n");
    changeInputerStatus("username");
    const FooterInputer = CreateFooterInputer({
      placeholder: '请输入您的昵称',
      onSubmit(val) {
        handleUpdateUser(val);
        FooterInputer.destory();
      }
    });
  }

  function writeLoginPicker() {
    write("\n\n");
    write(`Somone支持以下登录方式:

${importantWrite('[A]')} 使用微信订阅号生成永久授权码 ${tipsTextWrite('推荐')}

${importantWrite('[B]')} 使用您在Someone的邮箱账号授权

${successWrite('[C]')} 注册你的Someone邮箱账号

`)

    write('请选择你想要的登录方式，并点击底部对应字母').then(() => {
      const footerRadio = CreateFooterRadio({
        options: ['A', 'B', "C"],
        onClick: (key: string) => {
          write('\n\n');
          footerRadio.destory();
          key === 'A' && writeTokenLogin();
          key === 'B' && writeUserLoginEmail();
          key === 'C' && writeRegisterEmail();
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
      write("更新失败，请重新选择登录方式...\n");
      await write(errorWrite(`${error.code} - ${error.message}\n`));
      return;
    }

    const { data, error: userError } = await fetchUserInfo();
    if (userError) {
      write("获取用户信息失败，请重新选择登录方式...");
      write(errorWrite(`${userError.code} - ${userError.message}\n`));
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
    writeRegisterEmail,
    registerUser,
    reloadUserInfo,
    handleUpdateUser,
    getUserInfo,
    writeUserLogin,
    writeRegisterPasswordAfterEmail,
    writeUserLoginEmail,
    writeReigster,
    writeLoginPicker,
    writeTokenLogin,
    writeTokenSetter,
  };
};
