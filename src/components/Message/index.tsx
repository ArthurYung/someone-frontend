import { FC, useEffect } from "react";
import { useUserInfo } from "../CheckLogin/use-user";
import { Helpers, SomeoneHelper } from "./Helper";
import { Links } from "./Links";
import { useSomeoneEditor } from "../SomeoneEditor/context";
import "./style.scss";
import { useConfigUpdate, useWrites } from "./hooks";

export const MessageContainer: FC = () => {
  const { clearView, write, updateConfig, showInputer } = useSomeoneEditor();
  const { user_name, msg_count, is_vip } = useUserInfo();
  const { writeLimit } = useWrites();
  useConfigUpdate();
  useEffect(() => {
    if (!msg_count && !is_vip) {
      showInputer();
      writeLimit();
      return;
    }

    showInputer();
    clearView();
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
