import { FC, useEffect, useState } from "react";
import { useSomeoneEditor } from "../SomeoneEditor/context";
import { codeWrite, inputCodeWrite, successWrite, tipsWrite, useDocKeydownWatch } from "../SomeoneEditor/helper";

export const EditorGuidePC: FC<{ children: any }> = ({ children }) => {
  const [guideReady, setGuideReady] = useState(false);
  const { write, asyncWrite, clear } = useSomeoneEditor();

  function writeTips() {
    asyncWrite(`${tipsWrite('Tips:')}\n`);
    write(`
* 输入内置指令时（以${codeWrite("/")}开头），可通过右键${codeWrite(" → ")}或${codeWrite("Tab")}键来智能补全指令。
  
* 聊天过程中可以通过方向键${codeWrite(" ↑↓ ")}来切换历史输入文字。

* 可使用${codeWrite("Shift + 回车")}键来执行换行符操作。

* 普通体验账号每周的对话有次数限制，可输入${codeWrite("/info")}指令来查看当前账号详情。

* 更多操作内容可在验证身份成功后输入${codeWrite("/help")}查看操作帮助。

* 可以点击地址栏右侧的小电脑安装Someone wep APP (PWA)来获得更好的使用体验。

> 按${inputCodeWrite("空格键")}开启对话
`, 300)
  }

  const destory = useDocKeydownWatch(' ', () => {
    localStorage.setItem("EDITOR_GUIDE", "true");
    clear();
    setGuideReady(true);
  })

  useEffect(() => {
    if (localStorage.getItem('EDITOR_GUIDE')) {
      setGuideReady(true);
      return;
    }

    writeTips();
  }, []);

  useEffect(() => {
    if (guideReady) destory?.();
  }, [guideReady])

  return guideReady ? children : null;
}