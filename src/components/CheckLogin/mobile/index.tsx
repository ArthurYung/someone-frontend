import { FC, useEffect } from "react";
import { useSomeoneEditor } from "../../SomeoneEditor/context";
import {
  useDocKeydownWatch,
  useSomeoneEnterWatch,
} from "../../SomeoneEditor/helper";
import { UserInfoProvider } from "../use-user";
import { LOGIN_SUFFIX, REFRESH_SUFFIX, REGISTER_SUFFIX, TOKEN_SUFFIX, USER_SUFFIX } from "./constants";
import { useInputerState } from "./hooks/useInputerState";
import { useWriter } from "./hooks/useWriter";

export const CheckLoginMobile: FC<{ children: any }> = ({ children }) => {
  const { inputerStatus, userInfo, userLoginInfo, setUserInfo, updateUserEmail, updateUserPwd, changeInputerStatus } = useInputerState();
  const {
    handleUpdateUser,
    writeRefresh,
    writePasswordAfterEmail,
    writeRegisterEmail,
    writeUserLoginEmail,
    writeRegisterPasswordAfterEmail,
    writeReigster,
    writeUserLogin,
    writeWechatLogin,
    writeTokenLogin,
    writeTokenSetter,
    reloadUserInfo,
    getUserInfo,
    writeLoginPicker,
  } = useWriter(userLoginInfo, setUserInfo, changeInputerStatus, updateUserEmail, updateUserPwd, inputerStatus);
  
  const { write, asyncWrite, clear, hideInputer, currentOption, clearOptions } = useSomeoneEditor();

  const destoryEnterWatch = useSomeoneEnterWatch((val) => {
    console.log('on checklogin keydown')
    if (inputerStatus.current === "username") {
      if (!/^[\u4e00-\u9fa5a-zA-Z]{2,20}$/.test(val)) {
        write("系统识别失败，仅支持2-20个中文/英文字母组成\n");
        return;
      }

      hideInputer();
      write("正在设置中...\n");
      handleUpdateUser(val)
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

    if (inputerStatus.current === "register-email") {
      writeRegisterPasswordAfterEmail(val);
      return;
    }

    if (inputerStatus.current === "register-password") {
      writeReigster(val);
      return;
    }

    if (inputerStatus.current === "set-token") {
      writeTokenSetter(val);
      return;
    }
  });

  const destoryBackWatcher = useDocKeydownWatch('d', () => {
    if (inputerStatus.current !== 'login') {
      clear();
      hideInputer();
      writeLoginPicker();
      return true;
    }
  }, ['ctrl'])

  const destorySpaceWatcher = useDocKeydownWatch(' ', () => {
    const val = currentOption();
    if (inputerStatus.current !== 'login' || !val) return;

    if (val === TOKEN_SUFFIX) {
      asyncWrite('\n\n');
      writeTokenLogin();
      clearOptions();
      return;
    }
  
    if (val === LOGIN_SUFFIX) {
      asyncWrite('\n\n');
      writeWechatLogin();
      clearOptions();
      return;
    }

    if (val === USER_SUFFIX) {
      asyncWrite('\n\n');
      writeUserLoginEmail();
      clearOptions();
      return;
    }

    if (val === REGISTER_SUFFIX) {
      asyncWrite('\n\n');
      writeRegisterEmail();
      clearOptions();
      return;
    }
  })

  useEffect(() => {
    write("身份确认中...");
    getUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo) {
      destoryEnterWatch?.();
      destoryBackWatcher?.();
      destorySpaceWatcher?.();
    }
  }, [userInfo])

  return (
    <UserInfoProvider value={{ userInfo: userInfo!, reloadUserInfo }}>
      {userInfo && children}
    </UserInfoProvider>
  );
};
