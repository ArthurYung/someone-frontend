import { FC, useEffect } from "react";
import { useUserInfo } from "../CheckLogin/use-user";
import { Helpers, SomeoneHelper } from "./Helper";
import { Links } from "./Links";
import { useSomeoneBaseEditor, useSomeoneEditor } from "../SomeoneEditor/context";
import { useConfigUpdate, useWrites } from "./hooks";
import { someoneSaid } from "../SomeoneEditor/helper";
import { getTimePeriod } from "../../utils/date";
import "./style.scss";

export const MessageContainer: FC = () => {
  const { clearView, write, asyncWrite, showInputer } = useSomeoneEditor();
  const { setMessageMode } = useSomeoneBaseEditor();
  const { msg_count, is_vip, user_name } = useUserInfo().userInfo;
  const { writeLimit, writeUserName } = useWrites();
  useConfigUpdate();
  useEffect(() => {
    if (!msg_count && !is_vip) {
      showInputer();
      writeLimit();
      return;
    }

    showInputer();
    clearView();

    asyncWrite(someoneSaid())
    write(`${getTimePeriod()}好，${user_name}😊`)
    writeUserName(true);
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
