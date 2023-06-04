import { CheckLogin } from "./components/CheckLogin";
import { ErrorPage } from "./components/ErrorPage";
import { GlobalLoading } from "./components/GlobalLoading";
import { LayoutMain } from "./components/LayoutMain";
import { SomeoneEditor } from "./components/SomeoneEditor";
import { SystemInfo } from "./components/SystemInfo";
console.log(import.meta.env)
export const App = () => {
  return <GlobalLoading>
    <ErrorPage>
      <LayoutMain>
        <SomeoneEditor>
          <SystemInfo>
            <CheckLogin>

            </CheckLogin>
          </SystemInfo>
        </SomeoneEditor>
      </LayoutMain>
    </ErrorPage>
  </GlobalLoading>
};