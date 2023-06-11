import { fetchData } from "./request";

interface LoginCode {
  auth_code: string;
}


export const createCode = () => fetchData<{}, LoginCode>({
  url: '/code',
})

interface CheckCode {
  token: string;
}

export const checkCode = (code: string) => fetchData<{}, CheckCode>({
  url: `/${code}/check`,
})