export enum TextTokenType {
  DEFAULT = '',
  STYLE = 'style',
  CLASS = 'class',
  BREAK = 'break',
  LINK = 'link',
  BLOCK = 'block',
  OPTION = 'option',
}

export const END_TOKEN_BEGIN = '%';
export const END_TOKEN_CLOSE = ']';
export const START_TOKEN = '<';
export const BREAK_TOKEN = '\n';

export const SPACE_REG = /[ ,，。！·、]/;

export const SUFFIX_TOKEN = '/';

/**
 * Token Matcher Example: '<class|test>[%content%]'
 * Jump to content walk length: '<' + '|' + '>' + '[' + '%' = 5
 */
export const CONTENT_START_TOKEN_LENTH = 5;

function applyStyleNode(style: string, node: HTMLSpanElement) {
  node.style.cssText = style;
}

function applyClassNode(className: string, node: HTMLSpanElement) {
  node.className = className;
}

function applyOptionAttrbutes(id: string, node: HTMLSpanElement) {
  node.className = 'someone-option';
  node.id = id;
}

function applyLinkAttributes(href: string, node: HTMLSpanElement) {
  node.className = 'someone-link';
  node.setAttribute('href', href);
  node.setAttribute('target', '_blank');
}

function updateNodeContent(node: HTMLSpanElement, text: string) {
  node.innerText = text;
  return;
}

function createTokenNode(type: TextTokenType) {
  if (type === TextTokenType.BLOCK) return document.createElement('div');
  if (type === TextTokenType.LINK) return document.createElement('a');
  return document.createElement('span');
}

function getTextNode(text: string, type: TextTokenType, token: string) {
  if (type === TextTokenType.DEFAULT) {
    return document.createTextNode(text);
  }

  const node = createTokenNode(type);
  type === TextTokenType.CLASS && applyClassNode(token, node);
  type === TextTokenType.STYLE && applyStyleNode(token, node);
  type === TextTokenType.BLOCK &&
    applyStyleNode(`display:inline; ${token}`, node);
  type === TextTokenType.LINK && applyLinkAttributes(token, node);
  type === TextTokenType.OPTION && applyOptionAttrbutes(token, node);

  updateNodeContent(node, text);

  return node;
}

export function createTextToken(
  text: string,
  type = TextTokenType.DEFAULT,
  token = ''
) {
  const textToken = {
    text,
    type,
    token,
    node: getTextNode(text, type, token),
    appendText: (text: string) => {
      if (type !== TextTokenType.BLOCK) {
        textToken.node.textContent += text;
        return;
      }

      const latestText = textToken.node.lastChild;
      if (latestText?.nodeName === '#text') {
        latestText.textContent += text;
        return;
      }

      textToken.node.appendChild(document.createTextNode(text));
    },
  };

  return textToken;
}

export function matchTextToken(text: string) {
  return text.match(/^<(style|class|block|link|option)\|(.+?)>\[%([\s\S]*?)%\]/);
}

export type TextToken = ReturnType<typeof createTextToken>;
