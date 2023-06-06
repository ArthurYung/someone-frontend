import { Component, FC, ErrorInfo, useMemo, useState, useEffect } from "react";
import { getError } from "./check";
import { ErrorContext } from "./context";
import "./style.scss";
import { requestErrorHandler } from "../../api/request";

class ErrorBoundle extends Component<{
  onError: (error: Error, info: ErrorInfo) => void;
  children: any;
}> {
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError(error, info);
  }

  render() {
    return this.props.children;
  }
}

export const ErrorPage: FC<{ children: any }> = ({ children }) => {
  const nativeError = useMemo(getError, []);
  const [errorInfo, setErrorInfo] = useState(nativeError);

  useEffect(() => {
    // 监听请求错误
    const errorWatcherDestory = requestErrorHandler.watchError(error => {
      setErrorInfo({
        message: error.message,
        info: String(error).split('\n'),
      })
    });
    return errorWatcherDestory
  }, [])

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
        <ErrorBoundle onError={(error, errorInfo) => {
          setErrorInfo({
            message: error.message,
            info: errorInfo.componentStack.split('\n'),
          })
        }}>
        {children}</ErrorBoundle>
      )}
    </ErrorContext.Provider>
  );
};
