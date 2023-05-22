export enum TextTokenType {
  DEFAULT = '',
  STYLE = 'style',
  CLASS = 'class',
  BREAK = 'break',
}

export const END_TOKEN = ']';
export const START_TOKEN = '<';
export const BREAK_TOKEN = '\n';

function applyStyleNode(style: string, node: HTMLSpanElement) {
  node.style.cssText = style;
}

function applyClassNode(className: string, node: HTMLSpanElement) {
  node.className = className;
}

function applyTextNode(text: string, node: HTMLSpanElement) {
  node.innerText = text;
}

function getTextNode(text: string, type: TextTokenType, token: string) {
  if (type === TextTokenType.DEFAULT) {
    return document.createTextNode(text);
  }


  const node = document.createElement('span');
  type === TextTokenType.CLASS && applyClassNode(token, node);
  type === TextTokenType.STYLE && applyStyleNode(token, node);
  applyTextNode(text, node);

  return node;
}

export function createTextToken(text: string, type = TextTokenType.DEFAULT, token = '') {

  const textToken = {
    text,
    type,
    token,
    node: getTextNode(text, type, token),
  }

  return textToken;
}

export function matchTextToken(text: string) {
  return text.match(/^\<(style|class)\|(.+?)\>\[(.+?)\]/)
}

export type TextToken = ReturnType<typeof createTextToken>;