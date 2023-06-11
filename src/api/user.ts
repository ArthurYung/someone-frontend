import { fetchData } from "./request";

export interface UserInfo {
  user_name: string;
  id: number;
  send_count: number;
  msg_count: number;
  is_vip: 0 | 1;
}

export const fetchUserInfo = () => fetchData<{}, { info: UserInfo }>({
  url: '/info'
})

export const updateUserName = (data:{ user_name: string }) => fetchData({
  url: '/info',
  data,
}, "POST")