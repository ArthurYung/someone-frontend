import { createContext, useContext } from "react";
import { UserInfo, fetchUserInfo } from "../../api/user";

const CONTEXT_INIT: UserInfo = {
  id: 0,
  user_name: "",
  send_count: 0,
  msg_count: 0,
  is_vip: 0,
};

const UserInfoContext = createContext({
  userInfo: CONTEXT_INIT,
  reloadUserInfo: () => ({} as ReturnType<typeof fetchUserInfo>),
});

export const UserInfoProvider = UserInfoContext.Provider;
export const useUserInfo = () => useContext(UserInfoContext)

