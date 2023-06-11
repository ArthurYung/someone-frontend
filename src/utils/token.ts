const currentToken = {
  current: ""
}

export function getToken() {
  if (!currentToken.current) {
    currentToken.current = localStorage.getItem("TOKEN") || ""
  }

  return currentToken.current
}

export function setToken(token: string) {
  currentToken.current = token;
  localStorage.setItem("TOKEN", token);
}

export function clearToken() {
  localStorage.removeItem("TOKEN")
  currentToken.current = ""
}