import { useEffect, useRef, useState } from "react";
import { useSomeoneEditor } from "../../SomeoneEditor/context";
import { SomeoneHelper } from "./Helper";
import { useUserInfo } from "../../CheckLogin/use-user";
import {
  codeWrite,
  copyGuideWrite,
  errorWrite,
  historyPlaceholderWrite,
  linkWrite,
  placeholderWrite,
  primaryWrite,
  someoneSaid,
  successWrite,
  useSomeoneEnterWatch,
  userSaid,
} from "../../SomeoneEditor/helper";
import { generateQrcode } from "../../CheckLogin/getQrCode";
import { SURVEY_URL, TXC_URL } from "./Links";
import { clearToken } from "../../../utils/token";
import { MessageInfo, sendMessage } from "../../../api/message";
import { MessageDBRow, historyDB } from "../../../utils/indexDB";
import { parseMessage } from "../../../utils/parser";
import { copyTextById } from "../../../utils/copy";

const useBatchWriterCreator = (timeout = 300) => {
  const writers = useRef<{ text: string; looper: number }[]>([]);

  function createBatchWriter(callback: (text: string) => void) {
    const writer = {
      text: "",
      looper: 0,
    };

    writers.current.push(writer);

    function parseWrite(text: string) {
      const { res, unmatched } = parseMessage(text);
      res && callback(res);
      return unmatched;
    }

    function run() {
      if (!writer.looper) {
        writer.looper = window.setTimeout(() => {
          writer.text = parseWrite(writer.text);
          writer.looper = 0;
        }, timeout);
      }
    }

    function put(text: string) {
      writer.text += text;
    }

    function clear(force?: boolean) {
      clearTimeout(writer.looper);
      const index = writers.current.indexOf(writer);
      if (index > -1) {
        writers.current.splice(index, 1);
      }

      if (!force && writer.text) {
        const unmatched = parseWrite(writer.text);
        // 再执行一次未匹配的字符
        unmatched && callback(unmatched);
      }
    }

    return {
      run,
      put,
      clear,
    };
  }

  useEffect(
    () => () => {
      writers.current.forEach((item) => window.clearTimeout(item.looper));
    },
    [],
  );

  return createBatchWriter;
};

export const useConfigUpdate = () => {
  const { updateConfig } = useSomeoneEditor();
  useEffect(() => {
    updateConfig({
      suffixs: [
        SomeoneHelper.HELPER,
        SomeoneHelper.INFO,
        SomeoneHelper.CONACT,
        SomeoneHelper.SURVEY,
        SomeoneHelper.CLEAR,
        SomeoneHelper.FEEDBACK,
        SomeoneHelper.QUIT,
        SomeoneHelper.COPY,
      ],
    });
  }, []);
};

export const useWrites = () => {
  const { write, asyncWrite, hideInputer, showInputer, clear } =
    useSomeoneEditor();
  const { userInfo, reloadUserInfo } = useUserInfo();
  const { user_name, id, send_count, msg_count, is_vip } = userInfo;
  const history = useRef<MessageInfo[]>([]);
  const createBatchWather = useBatchWriterCreator(100);

  function writeUserName(inBreak = false) {
    asyncWrite(`${inBreak ? "\n" : ""}${userSaid(user_name)}`);
  }

  function writeLimit() {
    asyncWrite("\n");
    asyncWrite(someoneSaid());
    write(`Sorry ${user_name}，我实在太累了，这周的相处就到这吧，下周见...\n`);
    asyncWrite(someoneSaid());
    write(
      `有时间的话可以输入${codeWrite(
        SomeoneHelper.SURVEY,
      )}参与调研或者输入${codeWrite(
        SomeoneHelper.FEEDBACK,
      )}提建议或反馈，可能会更快见面哦！`,
    );
    writeUserName(true);
  }

  function writeHelp() {
    write(
      `\n${primaryWrite("Someone")}是一个模拟私人Chat机器人对话的免费体验网站，作者: ${linkWrite("Bruceouyang", "https://bruceau.com")}\n`,
    );
    write(
      `由于俺财力有限，每周可在Someone体验${primaryWrite("10轮")}对话服务\n`,
    );
    write(`
操作小Tips：

  * 输入内置指令时（以${codeWrite("/")}开头），可通过右键${codeWrite(" → ")}或${codeWrite("Tab")}键来智能补全指令。
    
  * 聊天过程中同时按住${codeWrite("Ctrl")} + ${codeWrite("D")}可以向下滚动内容。

  * 聊天过程中可以通过${codeWrite("Ctrl")} + ${codeWrite("U")}可以向上滚动内容。
  
  * 聊天过程中可以通过方向键${codeWrite(" ↑↓ ")}来切换历史输入文字。

  * 可使用${codeWrite("Shift + 回车")}键来执行换行符操作。

  * 如果想复制回答内容，可以按照回答结尾输入${codeWrite("/copy x")}指令来复制内容到剪切板。

  * 普通体验账号每周的对话有次数限制，可输入${codeWrite("/info")}指令来查看当前账号详情。

  * 更多操作内容可在验证身份成功后输入${codeWrite("/help")}查看操作帮助。

  * 可以点击地址栏右侧的小电脑安装Someone wep APP (PWA)来获得更好的使用体验。

`);
    write(`
内置指令详解：

  - ${codeWrite(SomeoneHelper.HELPER)} -- 查看帮助文档

  - ${codeWrite(SomeoneHelper.COPY + " {ID}")} -- 可以复制指定回答或代码块内容，例如"/copy 1"

  - ${codeWrite(SomeoneHelper.INFO)} -- 可查看对话资源使用详情

  - ${codeWrite(SomeoneHelper.CONACT)} -- 查看本站作者联系方式

  - ${codeWrite(SomeoneHelper.CLEAR)} -- 清空当前对话内容以及本地历史数据

  - ${codeWrite(SomeoneHelper.SURVEY)} -- 参与问卷调研，填写后将由机会获得额外对话体验次数

  - ${codeWrite(SomeoneHelper.FEEDBACK)} -- 参与提建议或反馈，填写后将由机会获得额外对话体验次数

  - ${codeWrite(SomeoneHelper.QUIT)} -- 退出当前用户登录状态
`);
    writeUserName(true);
  }

  function writeInfo() {
    write(async () => {
      const { data, error } = await reloadUserInfo();
      if (error) return "";
      return `
    用户ID: ${data.info.id}
    用户昵称: ${data.info.user_name}
    已对话: ${data.info.send_count}
    剩余: ${data.info.msg_count}
`;
    });
    writeUserName(true);
  }

  function writeAuthor() {
    write(`您可以访问我的个人博客：${linkWrite("https://bruceau.com")}\n`);
    write("或扫描下方二维码添加微信：\n");
    write(() => generateQrcode("https://u.wechat.com/EHySPrTCSCR8cyItHvrnMtM"));
    writeUserName(true);
  }

  function writeSurvey() {
    write(`\nClick -> ${linkWrite(SURVEY_URL)} -> 有机会获取额外体验次数\n`);
    writeUserName(true);
  }

  function writeFeedback() {
    write(`\nClick -> ${linkWrite(TXC_URL)} -> 有机会获取额外体验次数\n`);
    writeUserName(true);
  }

  function writeQuit() {
    hideInputer();
    write(`Bye~`);
    setTimeout(() => {
      clearToken();
      window.location.reload();
    }, 1000);
  }

  function writeSendMessage(value: string) {
    let responseRole = "";
    let responseContent = "";
    const batchWriter = createBatchWather(write);
    const userSaidInfo = { role: "user", content: value };
    history.current = history.current.slice(-3);
    history.current.push(userSaidInfo);
    historyDB.messages.add(userSaidInfo);
    hideInputer();
    asyncWrite(someoneSaid());
    sendMessage({
      messages: history.current,
      onMessage: (data) => {
        if (data.delta.role && !responseRole) {
          responseRole = data.delta.role;
        }

        responseContent += data.delta.content || "";
        batchWriter.put(data.delta.content || "");
        batchWriter.run();
      },
    })
      .then(() => {
        if (!responseRole) return;
        const responseInfo = { role: responseRole, content: responseContent };
        history.current.push(responseInfo);
        historyDB.messages.add(responseInfo);
        return historyDB.messages
          .count()
          .then((count) => {
            asyncWrite(`\n${copyGuideWrite(`a${count}`)}`);
          })
          .catch(() => {
            console.log("count error");
          });
      })
      .catch((err) => {
        if (err.code === 3001) {
          reloadUserInfo();
          writeLimit();
          return;
        }

        if (err.code === 5006) {
          write(errorWrite("Ops! CPU要起火了! 让我冷静一下...\n"));
          return;
        }

        write(errorWrite(err.message));
      })
      .finally(() => {
        batchWriter.clear();
        showInputer();
        writeUserName(true);
      });
  }

  function writeHistorys(messages: MessageDBRow[]) {
    if (!messages.length) return;
    asyncWrite(
      historyPlaceholderWrite(
        "======================== History =======================",
      ) + "\n",
    );
    messages.forEach((item, index) => {
      if (item.role === "user") {
        asyncWrite(`${userSaid(user_name)}${item.content}\n`, 100);
      } else {
        const { res, unmatched } = parseMessage(item.content);
        asyncWrite(`${someoneSaid()}${res}${unmatched}\n`, 100);
        asyncWrite(copyGuideWrite(`a${index + 1}`));
        asyncWrite("\n");
      }
    });
    asyncWrite(
      historyPlaceholderWrite(
        "========================================================",
      ) + "\n\n",
    );
  }

  useSomeoneEnterWatch((value) => {
    value = value.trim();
    if (value === SomeoneHelper.HELPER) {
      writeHelp();
      return;
    }

    if (value === SomeoneHelper.INFO) {
      writeInfo();
      return;
    }

    if (value === SomeoneHelper.CONACT) {
      writeAuthor();
      return;
    }

    if (value === SomeoneHelper.SURVEY) {
      writeSurvey();
      return;
    }

    if (value === SomeoneHelper.FEEDBACK) {
      writeFeedback();
      return;
    }

    if (value === SomeoneHelper.QUIT) {
      writeQuit();
      return;
    }

    if (value === SomeoneHelper.CLEAR) {
      clear();
      writeUserName();
      history.current = [];
      historyDB.messages.clear();
      return;
    }

    if (value.startsWith(SomeoneHelper.COPY)) {
      const copyId = value.replace(SomeoneHelper.COPY, "").trim();
      copyTextById(copyId).then((status) => {
        switch (status) {
          case 0:
            write(successWrite("✨ >>> Splendid! Copy Success! <<< ✨"));
            break;
          case 1:
            write(errorWrite("💥 >>> Alas! Copy Failed <<<"));
            break;
          case -1:
            write(errorWrite("💥 >>> Alas! Copy Empty <<<"));
            break;
          default:
            break;
        }
        writeUserName(true);
      });
      return;
    }

    if (!is_vip && !msg_count) {
      writeLimit();
      return;
    }

    if (!value) {
      writeUserName(true);
      return;
    }

    writeSendMessage(value);
  });

  return {
    writeLimit,
    writeHelp,
    writeUserName,
    writeHistorys,
  };
};
