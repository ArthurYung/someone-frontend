import { getJSON } from "./request";

interface LoginCode {
  auth_code: string;
}


export const createCode = () => getJSON<{}, LoginCode>({
  url: '/code',
})

interface CheckCode {
  token: string;
}

export const checkCode = (code: string) => getJSON<{}, CheckCode>({
  url: `/${code}/check`,
})