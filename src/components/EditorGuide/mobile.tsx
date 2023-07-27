import { FC, useEffect, useState } from "react";
import { useSomeoneEditor } from "../SomeoneEditor/context";
import { codeWrite, inputCodeWrite, tipsWrite } from "../SomeoneEditor/helper";
import { useHammer } from "../Mobile/useHammer";

export const EditorGuideMobile: FC<{ children: any }> = ({ children }) => {
  const [guideReady, setGuideReady] = useState(false);
  const { write, asyncWrite, clear } = useSomeoneEditor();

  function writeTips() {
    asyncWrite(`${tipsWrite('Tips:')}\n`);
    write(`
* 普通体验账号每周的对话有次数限制，可输入${codeWrite("/info")}指令来查看当前账号详情。

* 若要切换账号，可输入${codeWrite("/quit")}退出当前账号。

* 更多操作内容可在验证身份成功后输入${codeWrite("/help")}查看操作帮助。

* 可以安装Someone wep APP (PWA)来获得更好的使用体验：

* [IOS]
Safari浏览器中打开 -> 点击底部分享${codeWrite('↥')}按钮 -> 添加至桌面

* [Andriod]
根据自带浏览器指引将本站添加到桌面

> 点击${inputCodeWrite("任意位置")}开启对话
`, 300)
  }

  const destory = useHammer('tap', () => {
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