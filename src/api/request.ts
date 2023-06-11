import qs from 'qs';
import { clearToken, getToken } from '../utils/token';

const BASEURL =
  import.meta.env.MODE === "development"
    ? "https://dev.someone.ink"
    : "https://someone.ink";

export const requestErrorHandler = {
  watchers: [] as ((err: Error) => void)[],
  watchError: (watcher: (err: Error) => void) => {
    requestErrorHandler.watchers.push(watcher);
    return () => {
      const index = requestErrorHandler.watchers.indexOf(watcher);
      requestErrorHandler.watchers.splice(index, 1);
    }
  },
  emitError: (err: Error) => {
    requestErrorHandler.watchers.forEach(watcher => watcher(err))
  }
}

export type ResponseData<T> = {
  code: number;
  message: string;
} & T

export function fetchData<Q = any, S = any>(config: { url: string; data?: Q }, method: RequestInit["method"] = "GET"): Promise<{
  data: ResponseData<S>,
  error?: {
    code: number,
    message: string;
  }
}> {
  let url = `${BASEURL}/api/v1${config.url}`
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("SMO-Token", getToken());
  const requestConfig: RequestInit = {
    headers,
    method,
  }

  if (method === "GET") {
    const params = config.data ? `?${qs.stringify(config.data)}` : '';
    url += params;
  }

  if (method === "POST") {
    requestConfig.body = JSON.stringify(config.data || {})
  }


  return fetch(url, requestConfig)
  .then(res => res.json())
  .then(res => {
    if (!res.code) {
      return { data: res as ResponseData<S>};
    }

    // 未登录
    if (res.code === 4003) {
      clearToken();
    }

    return { data: {} as ResponseData<S>, error: res }
  })
  .catch(error => {
    requestErrorHandler.emitError(error);
    return Promise.reject(error);
  });
};

