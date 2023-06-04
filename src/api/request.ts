import qs from 'qs';

const BASEURL =
  import.meta.env.MODE === "development"
    ? "https://dev.someone.ink"
    : "https://someone.ink";

function locationToken() {
  return localStorage.getItem("TOKEN") || "";
}

function clearLocationToken() {
  localStorage.removeItem("TOKEN")
}

export type ResponseData<T> = {
  code: number;
  message: string;
} & T

export function getJSON<Q = any, S = any>(config: { url: string; data?: Q }): Promise<{
  data: ResponseData<S>,
  error?: {
    code: number,
    message: string;
  }
}> {
  const params = config.data ? `?${qs.stringify(config.data)}` : '';
  const url = `${BASEURL}/api/v1${config.url}${params}`
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("SMO-Token", locationToken());
  return fetch(url, {
    method: "GET",
    headers,
  })
  .then(res => res.json())
  .then(res => {
    if (!res.code) {
      return { data: res as ResponseData<S>};
    }

    // 未登录
    if (res.code === 4003) {
      clearLocationToken();
    }

    return { data: {} as ResponseData<S>, error: res }
  })
  .catch(error => ({ error, data: {} as ResponseData<S> }))
}
