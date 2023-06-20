import md5 from 'js-md5';

const SLAT = "someone-api-login"

export function md5Password(password: string) {
  return md5(password + SLAT);
}

export function emailTest(email: string) {
  return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(email);
}