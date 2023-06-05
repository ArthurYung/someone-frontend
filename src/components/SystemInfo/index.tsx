import { FC, useEffect, useMemo, useState } from "react";
import { useSomeoneEditor } from "../SomeoneEditor/context";
import { successWrite, primaryWrite, errorWrite, importantWrite, useSomeoneInputerWatch } from '../SomeoneEditor/helper';
import { getIP, system } from "./system";
import "./style.scss";

export const SystemInfo: FC<{ children: any }> = ({ children }) => {
  const [systemReady, setSystemReady] = useState(false);
  const { write, asyncWrite, showInputer, hideInputer } = useSomeoneEditor();

  useSomeoneInputerWatch(() => {
    if (systemReady) return;
    console.log('on keydown')
    hideInputer();
    write(`Setup completed!`)
    asyncWrite("\n=================================\n\n");
    setSystemReady(true);
  })

  useEffect(() => {
    // setSystemReady(true);
    // return;
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
    asyncWrite(`Set Simplified Chinese\n`, 100)

    asyncWrite(`\n${primaryWrite("System completed!")}\n\n`)
    write(`${importantWrite("[重要声明] ")}`)
    write(`\n本站为试验性网站，将且仅会为访问者提供便捷对话GPT大模型的${importantWrite("体验")}服务，\n对生成的开放性内容造成的风险与后果将由访问者自行承担。`, 300)
    write(`\n按任意按键${importantWrite("同意上述声明")}并继续\n\n`).then(() => {
      showInputer();
    })
  }, []);

  return systemReady ? children : null;
};
