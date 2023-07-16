import { FC, useEffect } from "react";
import { useUserInfo } from "../CheckLogin/use-user";
import { Helpers, SomeoneHelper } from "./Helper";
import { Links } from "./Links";
import { useSomeoneBaseEditor, useSomeoneEditor } from "../SomeoneEditor/context";
import { useConfigUpdate, useWrites } from "./hooks";
import { someoneSaid } from "../SomeoneEditor/helper";
import { getTimePeriod } from "../../utils/date";
import "./style.scss";
import { historyDB } from "../../utils/indexDB";

export const MessageContainer: FC = () => {
  const { clearView, write, asyncWrite, showInputer } = useSomeoneEditor();
  const { setMessageMode } = useSomeoneBaseEditor();
  const { userInfo } = useUserInfo();
  const { msg_count, is_vip, user_name } = userInfo;
  const { writeLimit, writeUserName, writeHistorys } = useWrites();

  function checkMessageCount() {
    if (!msg_count && !is_vip) {
      showInputer();
      writeLimit();
      return false;
    }

    return true;
  }

  function initWelecome() {
    asyncWrite(someoneSaid())
    write(`${getTimePeriod()}好，${user_name}😊`, 300)
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

  useConfigUpdate();
  useEffect(() => {
    showInputer();
    clearView();
    initPageData();
  }, []);

  useEffect(() => {
    setMessageMode(true);
  }, [])

  return (
    <footer className="layout-footer">
      <Helpers />
      <div className="footer-logo">
        <svg
          viewBox="0 0 140 140"
          xmlns="http://www.w3.org/2000/svg"
          className="footer-logo-icon"
        >
          <use href="#someone-icon" />
        </svg>
      </div>
      <Links />
    </footer>
  );
};
