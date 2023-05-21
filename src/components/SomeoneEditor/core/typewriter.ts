import { sleepTimeout } from "./util";

export type WriteInputer = string | (() => string) | (() => Promise<string>);

export interface SomeoneTypewriterConfig {
  view: HTMLDivElement,
  speed?: number,
  onWrite?: () => void,
  onWriteEnd?: () => void,
}

export type SomeoneTypewriterInstance = ReturnType<typeof createTypewriter>;

export function createTypewriter(config: SomeoneTypewriterConfig) {
  const writeTasks: (() => Promise<any>)[] = [];
  let taskRunning = false;
  let currentTask;

  function appendText(text: string) {
    config.view.appendChild(document.createTextNode(text));
  }

  function appendBr() {
    config.view.appendChild(document.createElement('br'));
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
    let walk = 0;
    let char: string;
    await new Promise((resolve) => {
     const loop = setInterval(() => {
      char = text.charAt(walk++);
      if (!char) {
        clearInterval(loop);
        resolve(true);
        return;
      }

      if (char === '\n') {
        appendBr();
        return;
      }

      appendText(char);
     }, config.speed || 100);
    })
  }

  async function asyncWriteText(inputer: string) {
    inputer.split('\n').forEach((line, index) => {
      if (index) {
        appendBr();
      }

      appendText(line);
    });
  } 

  async function createWriter(inputer: WriteInputer, delay?: number, async?: boolean) {
    if (delay) {
      await sleepTimeout(delay);
    }

    if (typeof inputer !== 'string') {
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
  }
}