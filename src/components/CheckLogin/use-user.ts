import { createContext, useContext } from "react";
import { UserInfo } from "../../api/user";

const CONTEXT_INIT: UserInfo = {
  id: 0,
  user_name: "",
  send_count: 0,
  msg_count: 0,
  is_vip: 0,
};

const UserInfoContext = createContext(CONTEXT_INIT);

export const UserInfoProvider = UserInfoContext.Provider;
export const useUserInfo = () => useContext(UserInfoContext)

