import { useRef, useState } from "react";
import { UserInfo } from "../../../api/user";

export type InputerStatus = "login" | "email" | "password" | "username" | "qrcode" | "none" | "register-email" | "register-password"

export const useInputerState = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const inputerStatus = useRef<InputerStatus>("none");
  const userLoginInfo = useRef({
    email: "",
    password: "",
  });

  function changeInputerStatus(type: InputerStatus) {
    inputerStatus.current = type;
  }

  function updateUserEmail(email: string) {
    userLoginInfo.current.email = email;
  }

  function updateUserPwd(pwd: string) {
    userLoginInfo.current.password = pwd;
  }

  return {
    userInfo,
    setUserInfo,
    inputerStatus,
    userLoginInfo,
    changeInputerStatus,
    updateUserEmail,
    updateUserPwd,
  }
}

export type UserLoginInfo = ReturnType<typeof useInputerState>['userLoginInfo'];