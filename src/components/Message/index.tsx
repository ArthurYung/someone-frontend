import { FC, useEffect } from "react";
import { useUserInfo } from "../CheckLogin/use-user";
import { Helpers, SomeoneHelper } from "./Helper";
import { Links } from "./Links";
import { useSomeoneEditor } from "../SomeoneEditor/context";
import { useConfigUpdate, useWrites } from "./hooks";
import { someoneSaid } from "../SomeoneEditor/helper";
import { getTimePeriod } from "../../utils/date";
import "./style.scss";

export const MessageContainer: FC = () => {
  const { clearView, write, showInputer } = useSomeoneEditor();
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

    write(someoneSaid())
    write(`${getTimePeriod()}好，${user_name}😊`)
    writeUserName(true);
  }, []);

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
