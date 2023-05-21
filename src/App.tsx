import { CheckLogin } from "./components/CheckLogin";
import { ErrorPage } from "./components/ErrorPage";
import { GlobalLoading } from "./components/GlobalLoading";
import { LayoutMain } from "./components/LayoutMain";
import { SomeoneEditor } from "./components/SomeoneEditor";

export const App = () => {
  return <GlobalLoading>
    <ErrorPage>
      <LayoutMain>
        <SomeoneEditor>
          <CheckLogin>

          </CheckLogin>
        </SomeoneEditor>
      </LayoutMain>
    </ErrorPage>
  </GlobalLoading>
};