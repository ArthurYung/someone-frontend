import {
  importantWrite,
  linkWrite,
  mdCodeWrite,
} from '../components/SomeoneEditor/helper';

enum Tokens {
  CODE = '`',
  BOLD = '*',
  LINK = '[',
}

const TOKEN_END_MAPTER = {
  [Tokens.CODE]: '`',
  [Tokens.BOLD]: '*',
  [Tokens.LINK]: ')',
};

const TOKEN_PARSER_MAP = {
  [Tokens.CODE]: (text: string) => {
    const res = /^`([^`]+)`$/.exec(text);
    return res ? mdCodeWrite(res[1]) : '';
  },
  [Tokens.BOLD]: (text: string) => {
    const res = /^\*\*(.+?)\*\*$/.exec(text);
    return res ? importantWrite(res[1]) : '';
  },
  [Tokens.LINK]: (text: string) => {
    const res = /^\[(.+?)\]\(([a-zA-Z.://?#%&]+)\)$/.exec(text);
    return res ? linkWrite(res[1], res[2]) : '';
  },
};

function parseToken(text: string, type: Tokens) {
  return TOKEN_PARSER_MAP[type](text);
}

export function parseMessage(text: string) {
  let res = '';
  let matcher = '';
  let matchType: Tokens | null = null;
  let matchEnd = '';

  for (let i = 0; i < text.length; i++) {
    // 换行终止符
    if (text[i] === '\n') {
        res += matcher;
        res += text[i];
        matcher = '';
        matchEnd = '';
        matchType = null;
        continue;
    }

    if (text[i] === matchEnd) {
      matcher += text[i];
      const parsed = parseToken(matcher, matchType!);
      if (parsed) {
        res += parsed;
        matcher = '';
        matchEnd = '';
        matchType = null;
      }
      continue;
    }

    if (!matchType && TOKEN_END_MAPTER[text[i] as Tokens]) {
      matchType = text[i] as Tokens;
      matcher += matchType;
      matchEnd = TOKEN_END_MAPTER[matchType];
      continue;
    }

    if (matchType) {
        matcher += text[i];
        continue;
    }

    res += text[i];
  }

  return {
    res,
    unmatched: matcher,
  }
}
