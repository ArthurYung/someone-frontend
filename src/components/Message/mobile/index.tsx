import { FC, useEffect } from "react";
import { useUserInfo } from "../../CheckLogin/use-user";
import { useSomeoneBaseEditor, useSomeoneEditor } from "../../SomeoneEditor/context";
import { useWrites } from "./hooks";
import { someoneSaid } from "../../SomeoneEditor/helper";
import { getTimePeriod } from "../../../utils/date";
import { historyDB } from "../../../utils/indexDB";
import "./style.scss";

export const MessageContainerMobile: FC = () => {
  const { clearView, write, asyncWrite } = useSomeoneEditor();
  const { setMessageMode } = useSomeoneBaseEditor();
  const { userInfo } = useUserInfo();
  const { msg_count, is_vip, user_name } = userInfo;
  const { writeLimit, writeUserName, writeHistorys } = useWrites();

  function checkMessageCount() {
    if (!msg_count && !is_vip) {
      writeLimit();
      return false;
    }

    return true;
  }

  function initWelecome() {
    asyncWrite(someoneSaid())
    write(`\n${getTimePeriod()}好，${user_name}😊`, 300)
    writeUserName(true);
  }

  async function initHistorys() {
    const prevUserInfo = await historyDB.userInfo.toCollection().first();
    if (!prevUserInfo) {
      await historyDB.userInfo.add(userInfo);
      return;
    }

    if (prevUserInfo.id !== userInfo.id) {
      await Promise.all([historyDB.messages.clear(), historyDB.userInfo.clear()]);
      await historyDB.userInfo.add(userInfo);
      return;
    }
  
    const historys = await historyDB.messages.toArray();
    writeHistorys(historys);
  }

  async function initPageData() {
    await initHistorys();
    checkMessageCount() && initWelecome();
  }

  useEffect(() => {
    clearView();
    initPageData();
  }, []);

  useEffect(() => {
    setMessageMode(true);
  }, [])

  return null;
};
