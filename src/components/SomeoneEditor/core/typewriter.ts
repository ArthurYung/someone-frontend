import { createSampleAutoMation } from "./automation";
import { TextToken, TextTokenType, createTextToken } from "./token";
import { sleepTimeout } from "./util";

export type WriteInputer = string | (() => string) | (() => Promise<string>);

export interface SomeoneTypewriterConfig {
  view: HTMLDivElement;
  speed?: number;
  onWrite?: () => void;
  onWriteEnd?: () => void;
}

export type SomeoneTypewriterInstance = ReturnType<typeof createTypewriter>;

export function createTypewriter(config: SomeoneTypewriterConfig) {
  const writeTasks: (() => Promise<any>)[] = [];
  let taskRunning = false;
  let prevToken: TextToken | null;
  let currentTask;

  function appendToken(text: string, tokenType: TextTokenType, token?: string) {
    if (prevToken?.type === tokenType) {
      prevToken.node!.textContent += text;
      return;
    }

    prevToken = createTextToken(text, tokenType, token);
    config.view.appendChild(prevToken.node);
  }

  function appendBr() {
    prevToken = null;
    config.view.appendChild(document.createElement("br"));
  }

  async function runWriteTask() {
    if (taskRunning || !writeTasks.length) return;
    taskRunning = true;
    config.onWrite?.();
    while ((currentTask = writeTasks.shift())) {
      await currentTask();
    }
    taskRunning = false;
    config.onWriteEnd?.();
  }

  async function writeText(text: string) {
    const automation = createSampleAutoMation(text);

    await new Promise((resolve) => {
      const loop = setInterval(() => {
        if (!automation.next()) {
          clearInterval(loop);
          resolve(true);
          return;
        }

        if (automation.isBreak()) {
          appendBr();
          return;
        }

        automation.clearToken();
        automation.matchToken();
        appendToken(
          automation.getChar(),
          automation.getToken(),
          automation.getContent()
        );
      }, config.speed || 100);
    });
  }

  async function asyncWriteText(inputer: string) {
    const automation = createSampleAutoMation(inputer);

    while (automation.next()) {
      if (automation.isBreak()) {
        appendBr();
        continue;
      }

      automation.clearToken();
      automation.matchToken();

      appendToken(
        automation.getChar(),
        automation.getToken(),
        automation.getContent()
      );
    }
  }

  async function createWriter(
    inputer: WriteInputer,
    delay?: number,
    async?: boolean
  ) {
    if (delay) {
      await sleepTimeout(delay);
    }

    if (typeof inputer !== "string") {
      inputer = await inputer();
    }

    if (async) {
      asyncWriteText(inputer);
      return;
    }

    await writeText(inputer);
  }

  function write(inputer: WriteInputer, delay?: number) {
    writeTasks.push(() => createWriter(inputer, delay));
    runWriteTask();
  }

  function asyncWrite(inputer: WriteInputer, delay?: number) {
    writeTasks.push(() => createWriter(inputer, delay, true));
    runWriteTask();
  }

  return {
    write,
    asyncWrite,
  };
}
