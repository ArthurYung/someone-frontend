import { FC, useEffect, useMemo, useState } from "react";
import { useSomeoneEditor } from "../SomeoneEditor/context";
import { successWrite, primaryWrite, errorWrite, importantWrite, useSomeoneInputerWatch, useSomeoneEnterWatch } from '../SomeoneEditor/helper';
import { getIP, system } from "./system";

const CURRENT_VERSION = "v1.0"

export const SystemInfo: FC<{ children: any }> = ({ children }) => {
  const [systemReady, setSystemReady] = useState(false);
  const { write, asyncWrite, showInputer, hideInputer } = useSomeoneEditor();

  function writeComplition() {
    asyncWrite("\n=================================\n\n", 100);
    write(`${importantWrite("[重要声明] ")}`)
    write(`\n本站为试验性网站，将且仅会为访问者提供便捷对话GPT大模型的${importantWrite("体验服务")}，\n对生成的开放性内容造成的风险与后果将由访问者自行承担。`, 300)
    write(`\n按${importantWrite("任意按键")}同意上述声明并继续\n\n`);
    showInputer();
  }

  function agreedComplition() {
    hideInputer();
    asyncWrite(`${successWrite("System completed!")}\n\n`)

    setSystemReady(true);
    localStorage.setItem("VERSION", CURRENT_VERSION);
  }

  const destoryInputerWatch = useSomeoneInputerWatch(() => {
    console.log('systemInput')
    agreedComplition();
  })

  const destoryEnterWatch = useSomeoneEnterWatch(() => {
    console.log('systemKeydown')
    agreedComplition();
  });

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
      `    Checking computer hardware status (CPU: ${system.cpu.architecture})...`,
    );
    asyncWrite(`${successWrite("done")}\n`, 100);

    write(
      `    Checking computer system environment (OS: ${system.os.name} - ${system.os.version})...`
    );
    asyncWrite(`${successWrite("done")}\n`, 100);

    write(
      `    Checking browser runtime environment (Using: ${system.browser.name} - ${system.browser.version})...`
    );
    asyncWrite(`${successWrite("done")}\n`, 100);

    write(`    Checking network environment`);
    write(() =>
      getIP()
        .then((ip) => ` (Ip: ${ip})...${successWrite("done")}\n`)
        .catch((err) => `${errorWrite(err.message)}\n`)
    );
    asyncWrite("\nMain program started successfully...\n")
    asyncWrite("Detecting locale for you...\n", 100)
    asyncWrite(`Set Language - Simplified Chinese\n`, 100)
    writeComplition()
  }, []);

  useEffect(() => {
    if (systemReady) {
      destoryInputerWatch?.();
      destoryEnterWatch?.()
    }
  }, [systemReady])

  return systemReady ? children : null;
};
