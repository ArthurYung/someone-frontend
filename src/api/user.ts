import { getJSON } from "./request";

export interface UserInfo {
  // UserName string `json:"user_name"`
	// UserId   int    `json:"id"`
	// MsgCount int    `json:"msg_count"`
  user_name: string;
  id: number;
  msg_count: number;
}

export const fetchUserInfo = () => getJSON<{}, { info: UserInfo }>({
  url: '/info'
})
