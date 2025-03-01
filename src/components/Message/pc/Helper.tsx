import { FC } from "react";

export enum SomeoneHelper {
  /** 查看帮助 */
  HELPER = "/help",
  /** 查看详情 */
  INFO = "/info",
  /** 联系作者 */
  CONACT = "/contact",
  /** 调研 */
  SURVEY = "/survey",
  /** 反馈、建议 */
  FEEDBACK = "/feedback",
  /** 清空历史记录 */
  CLEAR = "/clear",
  /** 登出 */
  QUIT = "/quit",
  /** 复制 */
  COPY = "/copy",
}

const Options = [
  {
    key: SomeoneHelper.HELPER,
    name: "帮助",
  },
  {
    key: `${SomeoneHelper.COPY} {ID}`,
    name: "复制代码",
  },
  {
    key: SomeoneHelper.INFO,
    name: "用户详情",
  },
  {
    key: SomeoneHelper.CONACT,
    name: "联系作者",
  },
  {
    key: SomeoneHelper.CLEAR,
    name: "清空对话",
  },
  // {
  //   key: SomeoneHelper.SURVEY,
  //   name: "参与调研",
  // },
  {
    key: SomeoneHelper.FEEDBACK,
    name: "建议&反馈",
  },
  {
    key: SomeoneHelper.QUIT,
    name: "退出",
  },
];

export const Helpers: FC = () => {
  return (
    <ul className="footer-helper">
      {Options.map((item) => (
        <li key={item.key}>
          {item.key} - {item.name}
        </li>
      ))}
    </ul>
  );
};
