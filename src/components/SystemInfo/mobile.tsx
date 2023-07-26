import { FC, useEffect, useState } from "react";
import { useSomeoneEditor } from "../SomeoneEditor/context";
import { successWrite, errorWrite, importantWrite, tipsWrite, inputCodeWrite } from '../SomeoneEditor/helper';
import { getIP, system } from "./system";
import { CURRENT_VERSION } from "./constants";
import { createHammerWatch } from "../../utils/hammer";


export const SystemInfoMobile: FC<{ children: any }> = ({ children }) => {
  const [systemReady, setSystemReady] = useState(false);
  const { write, asyncWrite, hideInputer } = useSomeoneEditor();

  function writeComplition() {
    asyncWrite("\n=================================\n\n", 100);
    write(`${tipsWrite("重要声明:")}\n`)
    write(`本站为试验性网站，将且仅会为访问者提供便捷对话GPT大模型的${importantWrite("体验服务")}，对生成的开放性内容造成的风险与后果将由访问者自行承担。`, 300)
    write(`\n\n请${inputCodeWrite("点击屏幕")}同意上述声明并继续`).then(() => {
      const destory = createHammerWatch('tap', () => {
        destory();
        agreedComplition();
      });
    })
  }

  function agreedComplition() {
    hideInputer();
    asyncWrite(`\n\n${successWrite("You have agreed!")}\n\n`)

    setSystemReady(true);
    localStorage.setItem("VERSION", CURRENT_VERSION);
  }

  useEffect(() => {
    if (localStorage.getItem("VERSION") === CURRENT_VERSION) {
      setSystemReady(true);
      return;
    }

    // 小于当前版本号
    if (localStorage.getItem("VERSION")?.startsWith("v")) {
      write(`Updating Stystem ${CURRENT_VERSION}...`)
      asyncWrite(successWrite("done"))
      writeComplition();
      return;
    }
    write(`SOMEONE System Setup`);
    asyncWrite("\n=================================\n\n");
    write(
      `Welecom to Setup.
This portion of the Setup program prepares Bruce & SOMEONE @1.0 to run your browser...\n\n`,
      600
    );
    write(
      `Checking computer hardware status:\nCPU - ${system.cpu.architecture}...`,
    );
    asyncWrite(`${successWrite("done")}\n`, 100);

    write(
      `\nChecking computer system environment:\nOS - ${system.os.name} - ${system.os.version}...`
    );
    asyncWrite(`${successWrite("done")}\n`, 100);

    write(
      `\nChecking browser runtime environment:\nUsing - ${system.browser.name} - ${system.browser.version}...`
    );
    asyncWrite(`${successWrite("done")}\n`, 100);

    write(`\nChecking network environment: \n`);
    write(() =>
      getIP()
        .then((ip) => `Ip - ${ip}...${successWrite("done")}\n`)
        .catch((err) => `${errorWrite(err.message)}\n`)
    );
    asyncWrite("\nMain program started successfully...\n")
    asyncWrite("Detecting locale for you...\n", 100)
    asyncWrite(`Set Language - Simplified Chinese\n`, 100)
    writeComplition()
  }, []);

  return systemReady ? children : null;
};
