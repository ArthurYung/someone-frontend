import {
  codePreLineWrite,
  codePreRootWrite,
  importantWrite,
  linkWrite,
  mdCodeWrite,
  thinkLineWrite,
  thinkRootWrite,
} from '../components/SomeoneEditor/helper';

enum Tokens {
  CODE = '`',
  BOLD = '*',
  LINK = '[',
  TAG = '<',
}

enum LineTokens {
  CODE_PRE = '```',
  THINK = '<think>'
}

enum LineEndTokens {
  CODE_PRE = '```',
  THINK = '</think>'
}

const TOKEN_END_MAPTER = {
  [Tokens.CODE]: '`',
  [Tokens.BOLD]: '*',
  [Tokens.LINK]: ')',
  [Tokens.TAG]: '>'
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
    const res = /^\[([^[]+?)\]\(([a-zA-Z.://?#%&]+)\)$/.exec(text);
    return res ? linkWrite(res[1], res[2]) : '';
  },
  [Tokens.TAG]: (_: string) => '',
};

const LINE_START_PARSER_MAP = {
  [LineTokens.CODE_PRE]: (text: string) => {
    const res = /^```([a-zA-Z]+)?$/.exec(text);
    return res ? codePreRootWrite(res[1]) : '';
  },
  [LineTokens.THINK]: (text: string) => {
    if(/^<think>/.exec(text)) {
      return thinkRootWrite()
    }
    return '';
  }
}

interface lineParser {
  type: null | LineTokens,
  offset: number,
  end: LineEndTokens | null
  render: (text: string) => string
}

const LineParser: lineParser = {
  type: null,
  offset: 0,
  end: null,
  render: (text: string) => text
}

function parseLineStart(text: string) {
  if (LineParser.type) return '';
  let res = '';
  console.log('parser text :', text);
  if (res = LINE_START_PARSER_MAP[LineTokens.CODE_PRE](text)) {
    LineParser.type = LineTokens.CODE_PRE;
    LineParser.end = LineEndTokens.CODE_PRE;
    LineParser.offset = 0;
    LineParser.render = codePreLineWrite;
    return res;
  }

  if (res = LINE_START_PARSER_MAP[LineTokens.THINK](text)) {
    LineParser.type = LineTokens.THINK;
    LineParser.end = LineEndTokens.THINK;
    LineParser.offset = 0;
    LineParser.render = thinkLineWrite;
    return res;
  }

  return res
}

function parseLineEnd(text: string) {
  if (!LineParser.type) {
    return text;
  }

  if (text === LineParser.end) {
    LineParser.type = null;
    LineParser.offset = 0;
    return '';
  }

  LineParser.offset = 0;
  return LineParser.render(text || ' ');
}

function parseCodePrestart(text: string) {
  return parseLineStart(text) || parseLineEnd(text);
}

function parseToken(text: string, type: Tokens) {
  return TOKEN_PARSER_MAP[type]?.(text) || '';
}

export function parseMessage(text: string) {
  console.log('parse text', text);
  let res = '';
  let matcher = '';
  let matchType: Tokens | null = null;
  let matchEnd = '';
  for (let i = 0; i < text.length; i++) {
    // 换行终止符
    if (text[i] === '\n') {
        res += parseCodePrestart(matcher);
        res += text[i];
        matcher = '';
        matchEnd = '';
        matchType = null;
        continue;
    }

    if (LineParser.type) {
      matcher += text[i];
      LineParser.offset += 1;
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

    // 不同步的token
    if (matchType === Tokens.LINK && text[i] === Tokens.LINK) {
        res += matcher;
        matcher = matchType;
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
