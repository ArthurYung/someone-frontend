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

interface CheckEmail {
  status: boolean;
}
export const checkEmail = (email: string) => fetchData<{}, CheckEmail>({
  url: `/email`,
  data: {
    email
  }
})


interface CheckCode {
  token: string;
}
export const userLogin = (data: {
  email: string,
  password: string,
}) => fetchData<{
  email: string,
  password: string,
}, CheckCode>({
  url: '/user',
  data,
}, "POST")

export const registerUser = (data: {
  email: string,
  password: string,
}) => fetchData<{
  email: string,
  password: string,
}, LoginCode>({
  url: '/register',
  data,
}, "POST")