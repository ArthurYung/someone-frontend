import { BREAK_TOKEN, END_TOKEN, START_TOKEN, TextTokenType, matchTextToken } from "./token";

/**
 * 简单状态机 
 */
export function createSampleAutoMation(text: string) {
  let walk = 0;
  let char: string;
  let tokenType = TextTokenType.DEFAULT;
  let tokenContent = '';
  let currentToken: RegExpMatchArray | null;

  function next() {
    return (char = text.charAt(walk++));
  }

  function jump(length: number) {
    walk += length;
  }

  function clearToken() {
    if (char === END_TOKEN && tokenType !== TextTokenType.DEFAULT) {
      setToken(TextTokenType.DEFAULT, '');
      next()
    }
  }

  function isBreak() {
    return char === BREAK_TOKEN;
  }

  function subText() {
    return text.substring(walk - 1);
  }

  function matchToken() {
    if (tokenType === TextTokenType.DEFAULT && char === START_TOKEN) {
      if ((currentToken = matchTextToken(subText()))) {
        setToken(currentToken[1] as TextTokenType, currentToken[2]);
        jump( tokenType.length + tokenContent.length + 3)
        next();
      }
    }
  }

  function setToken(type: TextTokenType, token: string) {
    tokenContent = token;
    tokenType = type;
  }

  function getToken() {
    return tokenType;
  }

  function getContent() {
    return tokenContent;
  }

  function getChar() {
    return char;
  }

  return {
    next,
    getChar,
    getToken,
    getContent,
    matchToken,
    clearToken,
    jump,
    setToken,
    isBreak,
  }
}