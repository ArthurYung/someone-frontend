import { ErrorPage } from "./components/ErrorPage";
import { GlobalLoading } from "./components/GlobalLoading";

export const App = () => {
  return <GlobalLoading>
    <ErrorPage>
      <div>started</div>
    </ErrorPage>
  </GlobalLoading>
};