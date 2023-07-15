import { FC, useEffect } from "react";
import { useSomeoneEditor } from "../SomeoneEditor/context";
import {
  useDocKeydownWatch,
  useSomeoneEnterWatch,
} from "../SomeoneEditor/helper";
import { UserInfoProvider } from "./use-user";
import { LOGIN_SUFFIX, REFRESH_SUFFIX, REGISTER_SUFFIX, USER_SUFFIX } from "./constants";
import { useInputerState } from "./hooks/useInputerState";
import { useWriter } from "./hooks/useWriter";
import "./style.scss";

export const CheckLogin: FC<{ children: any }> = ({ children }) => {
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
    reloadUserInfo,
    getUserInfo,
    writeLoginPicker,
  } = useWriter(userLoginInfo, setUserInfo, changeInputerStatus, updateUserEmail, updateUserPwd);
  
  const { write,  hideInputer } = useSomeoneEditor();

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

  const destoryBackWatcher = useDocKeydownWatch('d', () => {
    console.log('on back d', inputerStatus.current)
    if (inputerStatus.current !== 'login') {
      hideInputer();
      writeLoginPicker();
      return true;
    }
  }, ['ctrl'])

  useEffect(() => {
    write("身份确认中...");
    getUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo) {
      destoryEnterWatch?.();
      destoryBackWatcher?.();
    }
  }, [userInfo])

  return (
    <UserInfoProvider value={{ userInfo: userInfo!, reloadUserInfo }}>
      {userInfo && children}
    </UserInfoProvider>
  );
};
