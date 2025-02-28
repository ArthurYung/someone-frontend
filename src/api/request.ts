import qs from "qs";
import { clearToken, getToken } from "../utils/token";
import { createStreamPusher } from "../utils/stream";
import { resetLineParser } from "../utils/parser";

const BASEURL =
  import.meta.env.MODE === "development"
    ? "https://someone-api.bruceau.plus"
    : "https://someone-api.bruceau.plus";

export const requestErrorHandler = {
  watchers: [] as ((err: Error) => void)[],
  watchError: (watcher: (err: Error) => void) => {
    requestErrorHandler.watchers.push(watcher);
    return () => {
      const index = requestErrorHandler.watchers.indexOf(watcher);
      requestErrorHandler.watchers.splice(index, 1);
    };
  },
  emitError: (err: Error) => {
    requestErrorHandler.watchers.forEach((watcher) => watcher(err));
  },
};

export type ResponseData<T> = {
  code: number;
  message: string;
} & T;

export function fetchData<Q = any, S = any>(
  config: { url: string; data?: Q },
  method: RequestInit["method"] = "GET"
): Promise<{
  data: ResponseData<S>;
  error?: {
    code: number;
    message: string;
  };
}> {
  let url = `${BASEURL}/api/v1${config.url}`;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("SMO-Token", getToken());
  const requestConfig: RequestInit = {
    headers,
    method,
  };

  if (method === "GET") {
    const params = config.data ? `?${qs.stringify(config.data)}` : "";
    url += params;
  }

  if (method === "POST") {
    requestConfig.body = JSON.stringify(config.data || {});
  }

  return fetch(url, requestConfig)
    .then((res) => res.json())
    .then((res) => {
      if (!res.code) {
        return { data: res as ResponseData<S> };
      }

      // 未登录
      if (res.code === 4003) {
        clearToken();
      }

      return { data: {} as ResponseData<S>, error: res };
    })
    .catch((error) => {
      requestErrorHandler.emitError(error);
      return Promise.reject(error);
    });
}

export function fetchStream<T>(config: {
  url: string;
  data?: any;
  method?: "GET" | "POST";
  onMessage?: (data: T) => void;
  timeout?: number;
}) {
  return new Promise((resolve, reject) => {
    let url = `${BASEURL}/api/v1${config.url}`;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("SMO-Token", getToken());
  
    const requestConfig: RequestInit = {
      headers,
      method: config.method || "GET",
    };

    const timeoutRejector = {
      responseTimouter: 0,
      responseTimeouted: false,
      refreshTimouter: () => {
        timeoutRejector.clearTimeouter();
        timeoutRejector.responseTimouter = window.setTimeout(() => {
          timeoutRejector.responseTimeouted = true;
          reject(new Error('Request Timeout!'));
        }, config.timeout || 50000);
      },
      clearTimeouter: () => {
        clearTimeout(timeoutRejector.responseTimouter);
      }
    }

    timeoutRejector.refreshTimouter();


    if (requestConfig.method === "GET") {
      const params = config.data ? `?${qs.stringify(config.data)}` : "";
      url += params;
    }

    if (requestConfig.method === "POST") {
      requestConfig.body = JSON.stringify(config.data || {});
    }

    const streamPusher = createStreamPusher();

    const push = async (
      controller: ReadableStreamDefaultController,
      reader: ReadableStreamDefaultReader
    ) => {
      const { value, done } = await reader.read();
      
      if (timeoutRejector.responseTimeouted) {
        controller.close();
        return;
      }

      timeoutRejector.refreshTimouter();


      if (!done) {
        streamPusher.push(value);
      }

      const lines = streamPusher.getLines(done);
      
      if (!lines.length && streamPusher.hasValue()) {
        push(controller, reader);
        return;
      }

      // 错误返回
      // if (!/^(data|event):/.test(lines[0])) {
      //   try {
      //     const errorInfo = JSON.parse(lines[0]);
      //     // 未登录
      //     if (errorInfo.code === 4003) {
      //       clearToken();
      //     }
      //
      //     reject(errorInfo);
      //   } catch (e) {
      //     reject(e);
      //   }
      //
      //   return;
      // }
      //
      let data: T;
      for (let line of lines) {
        if (!line) continue;
        if (!(line = line.trim())) continue;
        if (line === "event:message") continue;
        if (line.startsWith("data:")) {
          data = JSON.parse(line.replace("data:", ""));
          config.onMessage?.(data);
          continue;
        }
        if (
          line === "event:done" ||
          line === "event:stop" ||
          line === "data:finish" ||
          line === "data:<!finish>"
        ) {
          controller.close();
          timeoutRejector.clearTimeouter();
          resolve(true);
          return;
        }

        timeoutRejector.clearTimeouter();
        reject(new Error("Parse line error: " + line));
        return;
      }

      if (done) {
        controller.close();
        timeoutRejector.clearTimeouter();
        resolve(true);
        return;
      }

      controller.enqueue(value);
      push(controller, reader);
    };

    // 重置解析器
    resetLineParser()

    fetch(url, requestConfig)
      .then((res) => {
        const reader = res.body?.getReader();
        if (reader) {
          new ReadableStream({
            start(controller) {
              push(controller, reader);
            },
          });

          return;
        }

        timeoutRejector.clearTimeouter();
        reject(new Error("Get stream reader fail"));
      })
      .catch(err => {
        timeoutRejector.clearTimeouter();
        reject(err);
      });
  });
}
