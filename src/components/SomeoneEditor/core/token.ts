export enum TextTokenType {
  DEFAULT = '',
  STYLE = 'style',
  CLASS = 'class',
  BREAK = 'break',
  LINK = 'link',
  IMAGE = 'image',
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

type GetTokenNode<T> = T extends TextTokenType.LINK
  ? HTMLAnchorElement
  : T extends TextTokenType.IMAGE
  ? HTMLImageElement
  : HTMLSpanElement;

function isBlockToken(token: TextTokenType) {
  return token === TextTokenType.IMAGE;
}

function applyStyleNode(style: string, node: HTMLElement) {
  node.style.cssText = style;
}

function applyClassNode(className: string, node: HTMLElement) {
  node.className = className;
}

function applyOptionAttrbutes(id: string, node: HTMLElement) {
  node.className = 'someone-option';
  node.id = id;
}

function applyLinkAttributes(href: string, node: HTMLElement) {
  node.className = 'someone-link';
  node.setAttribute('href', href);
  node.setAttribute('target', '_blank');
}

function applyImageSrc(src: string, node: HTMLImageElement) {
  console.log(src);
  node.src = src;
}

function updateNodeContent(node: HTMLElement, text: string) {
  node.innerText = text;
  return;
}

function createTokenNode<T extends TextTokenType>(type: T): GetTokenNode<T> {
  if (type === TextTokenType.LINK) return document.createElement('a') as any;
  if (type === TextTokenType.IMAGE) return new Image() as any;
  return document.createElement('span') as any;
}


function getTextNode<T extends TextTokenType>(text: string, type: T, token: string) {
  // 文本节点特殊处理
  if (type === TextTokenType.DEFAULT) {
    return document.createTextNode(text);
  }

  const node = createTokenNode(type);

  type === TextTokenType.CLASS && applyClassNode(token, node);
  type === TextTokenType.STYLE && applyStyleNode(token, node);
  type === TextTokenType.LINK && applyLinkAttributes(token, node);
  type === TextTokenType.OPTION && applyOptionAttrbutes(token, node);
  type === TextTokenType.IMAGE && applyClassNode(token, node);

  !isBlockToken(type) && updateNodeContent(node, text);

  return node;
}

function updateImageContent(token: TextToken, text: string) {
  token.text += text;
}

function updateTextContent(token: TextToken, text: string) {
  token.node.textContent += text;
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
      if (type === TextTokenType.IMAGE) {
        updateImageContent(textToken, text);
        return;
      }

      updateTextContent(textToken, text);
    },
    end: () => {
      if (type === TextTokenType.IMAGE) {
        applyImageSrc(textToken.text, textToken.node as HTMLImageElement);
      }
    }
  };

  return textToken;
}

export function matchTextToken(text: string) {
  return text.match(
    /^<(style|class|link|option|image)\|(.+?)>\[%([\s\S]*?)%\]/
  );
}

export type TextToken = ReturnType<typeof createTextToken>;
