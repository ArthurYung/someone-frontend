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
import { useHammer } from "../../Mobile/useHammer";
import { checkCliboardData } from "./util";
import { clearAllPopup } from "../../Mobile/footerHelper";

export const CheckLoginMobile: FC<{ children: any }> = ({ children }) => {
  const { inputerStatus, userInfo, userLoginInfo, setUserInfo, updateUserEmail, updateUserPwd, changeInputerStatus } = useInputerState();
  const {
    handleUpdateUser,
    writePasswordAfterEmail,
    writeRegisterEmail,
    writeUserLoginEmail,
    writeRegisterPasswordAfterEmail,
    writeReigster,
    writeUserLogin,
    writeTokenLogin,
    writeTokenSetter,
    reloadUserInfo,
    getUserInfo,
    writeLoginPicker,
  } = useWriter(userLoginInfo, setUserInfo, changeInputerStatus, updateUserEmail, updateUserPwd, inputerStatus);
  
  const { write, hideInputer, clear } = useSomeoneEditor();

  const destoryEnterWatch = useSomeoneEnterWatch((val) => {

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

  const destoryBack = useHammer('swiperight', () => {
    if (inputerStatus.current === 'login') return;
    clear();
    clearAllPopup();
    writeLoginPicker();
  })

  

  useEffect(() => {
    hideInputer();
    write("身份确认中...").then(checkCliboardData).then(getUserInfo)
  }, []);

  useEffect(() => {
    if (userInfo) {
      destoryEnterWatch?.();
      destoryBack?.();
    }
  }, [userInfo])

  return (
    <UserInfoProvider value={{ userInfo: userInfo!, reloadUserInfo }}>
      {userInfo && children}
    </UserInfoProvider>
  );
};
