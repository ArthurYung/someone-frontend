import { useEffect, useRef } from "react";
import { checkCode } from "../../../api/login";
import { MAX_LOOP_COUNT, TIMEOUT_ERROR_TOKEN } from "../constants";

export const useLoginCode = () => {
  const loopRef = useRef({ code: "", timeout: 0, loopCount: 0 });
  function startLoop(code: string) {
    return new Promise<string>((resolve, reject) => {
      loopRef.current.code = code;
      loopRef.current.loopCount = 0;
      window.clearTimeout(loopRef.current.timeout);
      async function looper() {
        const { data, error } = await checkCode(code);
        if (error) {
          reject(error);
          return;
        }

        if (data.token) {
          resolve(data.token);
          return;
        }

        if (loopRef.current.loopCount > MAX_LOOP_COUNT) {
          reject({
            message: TIMEOUT_ERROR_TOKEN,
          });
          return;
        }

        loopRef.current.loopCount += 1;
        loopRef.current.timeout = window.setTimeout(looper, 1000);
      }

      looper();
    });
  }

  useEffect(() => {
    window.clearTimeout(loopRef.current.timeout);
  }, []);

  return startLoop;
};