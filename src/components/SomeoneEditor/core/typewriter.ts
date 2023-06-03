import { createSampleAutoMation } from "./automation";
import { SomeoneEditorConfig } from "./config";
import { TextToken, TextTokenType, createTextToken } from "./token";
import { sleepTimeout } from "./util";

export type WriteInputer = string | (() => string) | (() => Promise<string>);


export type SomeoneTypewriterInstance = ReturnType<typeof createTypewriter>;

export function createTypewriter(config: SomeoneEditorConfig, view: HTMLDivElement) {
  const writeTasks: (() => Promise<any>)[] = [];
  let taskRunning = false;
  let prevToken: TextToken | null;
  let currentTask;

  function appendToken(text: string, tokenType: TextTokenType, token?: string) {
    if (prevToken?.type === tokenType && prevToken?.token === token) {
      prevToken.node!.textContent += text;
      return;
    }

    prevToken = createTextToken(text, tokenType, token);
    view.appendChild(prevToken.node);
  }

  function appendBr() {
    prevToken = null;
    view.appendChild(document.createElement("br"));
  }

  async function runWriteTask() {
    if (taskRunning || !writeTasks.length) return;
    taskRunning = true;
    config.emit('onEditorWrite');
    while ((currentTask = writeTasks.shift())) {
      currentTask = await currentTask();
    }
    taskRunning = false;
    config.emit('onEditorWriteEnd');
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
      }, config.get('speed') || 100);
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
        automation.getContent(),
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

    if (typeof inputer === "function") {
      inputer = await inputer();
    }

    if (!inputer) {
      inputer = '';
    }

    if (async) {
      asyncWriteText(inputer);
      return;
    }

    await writeText(inputer);
  }

  function write(inputer: WriteInputer, delay?: number) {
    return new Promise((resolve) => {
      writeTasks.push(() => createWriter(inputer, delay).then(resolve));
      runWriteTask();
    })
  }

  function asyncWrite(inputer: WriteInputer, delay?: number) {
    return new Promise((resolve) => {
      writeTasks.push(() => createWriter(inputer, delay, true).then(resolve));
      runWriteTask();
    })
  }

  return {
    write,
    asyncWrite,
  };
}
