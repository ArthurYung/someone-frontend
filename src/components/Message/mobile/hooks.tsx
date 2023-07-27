import { useEffect, useRef, useState } from "react";
import { useSomeoneEditor } from "../../SomeoneEditor/context";
import { SomeoneHelper } from "../pc/Helper";
import { useUserInfo } from "../../CheckLogin/use-user";
import {
  codeWrite,
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
import { SURVEY_URL, TXC_URL } from "../pc/Links";
import { clearToken } from "../../../utils/token";
import { MessageInfo, sendMessage } from "../../../api/message";
import { MessageDBRow, historyDB } from "../../../utils/indexDB";
import { parseMessage } from "../../../utils/parser";
import { CreateFooterInputer } from "../../Mobile/FooterInputer";



const useBatchWriterCreator = (timeout = 300) => {
  const writers = useRef<{ text: string, looper: number }[]>([]);

  function createBatchWriter(callback: (text: string) => void) {
    const writer = {
      text: '',
      looper: 0,
    }

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
        }, timeout)
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
    }
  }

  useEffect(() => () => {
    writers.current.forEach(item => window.clearTimeout(item.looper))
  }, [])

  return createBatchWriter;
}

export const useWrites = () => {
  const { write, asyncWrite, clear, isWriting } = useSomeoneEditor();
  const { userInfo, reloadUserInfo } = useUserInfo();
  const { user_name, msg_count, is_vip } = userInfo;
  const history = useRef<MessageInfo[]>([]);
  const createBatchWather = useBatchWriterCreator(100);

  function writeUserName(inBreak = false) {
    asyncWrite(`${inBreak ? "\n" : ""}${userSaid(user_name)}\n`);
  }

  function writeSumeoneName() {
    asyncWrite(someoneSaid() + '\n');
  }

  async function writeLimit() {
    asyncWrite("\n");
    writeSumeoneName();
    write(`Sorry ${user_name}，我实在太累了，这周的相处就到这吧，下周见...\n`);
    writeSumeoneName();
    write(
      `有时间的话可以输入${codeWrite(
        SomeoneHelper.SURVEY
      )}参与调研或者输入${codeWrite(
        SomeoneHelper.FEEDBACK
      )}提建议或反馈，可能会更快见面哦！`
    );
    writeUserName(true);
  }

  function writeHelp() {
    write(`\n${primaryWrite("Someone")}是一个模拟私人Chat机器人对话的免费体验网站，作者: ${linkWrite('Bruceouyang', 'https://bruceau.com')}\n`)
    write(`由于俺财力有限，每周可在Someone体验${primaryWrite("10轮")}对话服务\n`)
    write(`
内置指令详解：

  - ${codeWrite(SomeoneHelper.HELPER)} -- 查看帮助文档

  - ${codeWrite(SomeoneHelper.INFO)} -- 可查看对话资源使用详情

  - ${codeWrite(SomeoneHelper.CONACT)} -- 查看本站作者联系方式

  - ${codeWrite(SomeoneHelper.CLEAR)} -- 清空当前对话内容以及本地历史数据

  - ${codeWrite(SomeoneHelper.SURVEY)} -- 参与问卷调研，填写后将由机会获得额外对话体验次数

  - ${codeWrite(SomeoneHelper.FEEDBACK)} -- 参与提建议或反馈，填写后将由机会获得额外对话体验次数

  - ${codeWrite(SomeoneHelper.QUIT)} -- 退出当前用户登录状态
`)
writeUserName(true);
  }

  function writeInfo() {
    write(async () => {
      const { data, error } = await reloadUserInfo();
      if (error) return '';
      return `
    用户ID: ${data.info.id}
    用户昵称: ${data.info.user_name}
    已对话: ${data.info.send_count}
    剩余: ${data.info.msg_count}
`
    })
writeUserName(true)
  }

  function writeAuthor() {
    write(`您可以访问我的个人博客：${linkWrite('https://bruceau.com')}\n`)
    write('或扫描下方二维码添加微信：\n')
    write(() => generateQrcode('https://u.wechat.com/EHySPrTCSCR8cyItHvrnMtM'))
    writeUserName(true)
  }

  function writeSurvey() {
    write(`\nClick -> ${linkWrite(SURVEY_URL)} -> 有机会获取额外体验次数\n`)
    writeUserName(true)
  }

  function writeFeedback() {
    write(`\nClick -> ${linkWrite(TXC_URL)} -> 有机会获取额外体验次数\n`)
    writeUserName(true)
  }

  function writeQuit() {
    write(`Bye~`)
    setTimeout(() => {
      clearToken();
      window.location.reload();
    }, 1000)
  }

  function writeSendMessage(value: string) {
    let responseRole = '';
    let responseContent = '';
    const batchWriter = createBatchWather(write);
    const userSaidInfo = { role: 'user', content: value };
    history.current = history.current.slice(-3);
    history.current.push(userSaidInfo);
    historyDB.messages.add(userSaidInfo);
    writeSumeoneName();
    sendMessage({
      messages: history.current,
      onMessage: data => {
        if (data.delta.role) {
          responseRole = data.delta.role;
          return;
        }
        
        responseContent += data.delta.content || '';
        batchWriter.put(data.delta.content || '');
        batchWriter.run();
      }
    }).then(() => {
      if (!responseRole) return;
      const responseInfo = { role: responseRole, content: responseContent };
      history.current.push(responseInfo);
      historyDB.messages.add(responseInfo);
    }).catch((err) => {
      if (err.code === 3001) {
        reloadUserInfo();
        writeLimit();
        return;
      }

      if (err.code === 5006) {
        write(errorWrite('Ops! CPU要起火了! 让我冷静一下...\n'));
        return;
      }

      write(errorWrite(err.message));
    }).finally(() => {
      batchWriter.clear();
      writeUserName(true)
    })
  }

  function writeHistorys(messages: MessageDBRow[]) {
    if (!messages.length) return;
    asyncWrite(historyPlaceholderWrite('============= History ============') + '\n');
    messages.forEach(item => {
      if (item.role === 'user') {
        asyncWrite(`${userSaid(user_name)}\n${item.content}\n`, 100)
      } else {
        const { res, unmatched } = parseMessage(item.content)
        writeSumeoneName();
        asyncWrite(`${res}${unmatched}\n`, 100)
      }
    });
    asyncWrite(historyPlaceholderWrite('==================================') + '\n\n');
  }

  useEffect(() => {
    const inputer = CreateFooterInputer({
      onSubmit: (val) => {
        if (isWriting()) return true;

        const value = val.trim();
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
    
        if (!is_vip && !msg_count) {
          writeLimit();
          return;
        }
        
        if (!value) {
          writeUserName(true);
          return;
        }
        
        asyncWrite(value + '\n');
        writeSendMessage(value)
      }
    });

    return inputer.destory;
  }, []);


  return {
    writeLimit,
    writeHelp,
    writeUserName,
    writeHistorys,
  };
};
