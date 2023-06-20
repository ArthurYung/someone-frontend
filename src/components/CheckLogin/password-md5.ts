import md5 from 'js-md5';

const SLAT = "someone-api-login"

export function md5Password(password: string) {
  return md5(password + SLAT);
}