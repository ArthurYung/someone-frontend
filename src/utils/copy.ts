import { historyDB } from "./indexDB";

let currentId = 1;
export const getCopyId = () => {
  return `${currentId++}`;
};

export const copyTextById = async (id: string) => {
  if (id.startsWith("a")) {
    const messages = await historyDB.messages.toArray();
    const index = parseInt(id.replace("a", ""));
    const message = messages[index - 1];
    if (!message?.content) {
      return -1;
    }

    return navigator.clipboard
      .writeText(message.content)
      .then(() => 0)
      .catch(() => 1);
  }
  const copyRoot = document.querySelector(`.copy-id-${id}`);
  if (!copyRoot) {
    return -1;
  }

  // 从root开始查找所有data-block的元素内容

  let text = "";
  let copyEl = copyRoot.nextElementSibling;
  while (copyEl) {
    if (!(copyEl as HTMLElement)?.dataset?.block) {
      break;
    }

    if (text) {
      text += "\n";
    }

    text += (copyEl as HTMLElement).innerText;
    copyEl = copyEl.nextElementSibling;
  }

  if (!text) {
    return 2;
  }

  // 复制到剪贴板
  return navigator.clipboard
    .writeText(text)
    .then(() => 0)
    .catch(() => 1);
};
