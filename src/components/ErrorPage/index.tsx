import { FC, useMemo, useState } from "react";
import { getError } from "./check";
import { ErrorContext } from "./context";
import "./style.scss";

export const ErrorPage: FC<{ children: any }> = ({ children }) => {
  const nativeError = useMemo(getError, []);
  const [errorInfo, setErrorInfo] = useState(nativeError);

  return (
    <ErrorContext.Provider value={{ error: errorInfo, setError: setErrorInfo }}>
      {errorInfo ? (
        <main className="error-page">
          <div className="error-page-container">
            <h3 className="error-page-container__message">
              ERROR: {errorInfo.message}
            </h3>
            <div className="errpr-page-container__info">
              {errorInfo.info.map((msg, idx) => (
                <p key={idx} className="error-page-container__txt">
                  {msg}
                </p>
              ))}
            </div>
          </div>
        </main>
      ) : (
        children
      )}
    </ErrorContext.Provider>
  );
};
