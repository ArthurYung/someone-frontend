import { useEffect } from "react";
import { useSomeoneEditor } from "../SomeoneEditor/context";
import { SomeoneHelper } from "./Helper";
import { useUserInfo } from "../CheckLogin/use-user";
import {
  codeWrite,
  linkWrite,
  primaryWrite,
  someoneSaid,
  successWrite,
  useSomeoneEnterWatch,
} from "../SomeoneEditor/helper";
import { generateQrcode } from "../CheckLogin/getQrCode";
import { SURVEY_URL, TXC_URL } from "./Links";

export const useConfigUpdate = () => {
  const { updateConfig } = useSomeoneEditor();
  useEffect(() => {
    updateConfig({
      suffixs: [
        SomeoneHelper.HELPER,
        SomeoneHelper.INFO,
        SomeoneHelper.CONACT,
        SomeoneHelper.SURVEY,
        SomeoneHelper.FEEDBACK,
        SomeoneHelper.QUIT,
      ],
    });
  }, []);
};

export const useWrites = () => {
  const { write, asyncWrite, hideInputer } = useSomeoneEditor();
  const { user_name, id, send_count, msg_count, is_vip } = useUserInfo();

  function writeUserName(inBreak = false) {
    asyncWrite(`${inBreak ? "\n" : ""}${user_name}: `);
  }
  function writeLimit() {
    asyncWrite("\n");
    asyncWrite(someoneSaid());
    write(`Sorry ${user_name}，我实在太累了，这周的相处就到这吧，下周见...\n`);
    asyncWrite(someoneSaid());
    write(
      `有时间的话可以输入${codeWrite(
        SomeoneHelper.SURVEY
      )}参与调研或者输入${codeWrite(
        SomeoneHelper.FEEDBACK
      )}提建议或反馈，可能会更快见面哦！`
    );
    writeUserName(true)
  }

  function writeHelp() {
    write(`\n${primaryWrite("Someone")}是一个模拟私人Chat机器人对话的免费体验网站，作者: ${linkWrite('Bruceouyang', 'https://bruceau.com')}\n`)
    write(`由于俺财力有限，每周可在Someone体验${primaryWrite("10轮")}对话服务\n`)
    write(`
内置指令详解：
  - ${codeWrite(SomeoneHelper.HELPER)} -- 查看帮助文档
  - ${codeWrite(SomeoneHelper.INFO)} -- 可查看对话资源使用详情
  - ${codeWrite(SomeoneHelper.CONACT)} -- 查看本站作者联系方式
  - ${codeWrite(SomeoneHelper.SURVEY)} -- 参与问卷调研，填写后将由机会获得额外对话体验次数
  - ${codeWrite(SomeoneHelper.FEEDBACK)} -- 参与提建议或反馈，填写后将由机会获得额外对话体验次数
  - ${codeWrite(SomeoneHelper.QUIT)} -- 退出当前用户登录状态
`)
writeUserName(true);
  }

  function writeInfo() {
    write(`
    用户ID: ${id}
    用户昵称: ${user_name}
    已对话: ${send_count}
    剩余: ${msg_count}
`)
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
    hideInputer()
    write(`Bye~`)
    setTimeout(() => {
      window.location.reload();
    }, 1000)
  }

  useSomeoneEnterWatch((value) => {
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

    if (!is_vip && !msg_count) {
      writeLimit();
      return;
    }
    
  });

  return {
    writeLimit,
    writeHelp,
  };
};
