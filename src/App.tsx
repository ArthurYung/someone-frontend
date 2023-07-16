import { CheckLogin } from "./components/CheckLogin";
import { EditorGuide } from "./components/EditorGuide";
import { ErrorPage } from "./components/ErrorPage";
import { GlobalLoading } from "./components/GlobalLoading";
import { LayoutMain } from "./components/LayoutMain";
import { MessageContainer } from "./components/Message";
import { SomeoneEditor } from "./components/SomeoneEditor";
import { SystemInfo } from "./components/SystemInfo";

export const App = () => {
  return <GlobalLoading>
    <ErrorPage>
      <LayoutMain>
        <SomeoneEditor>
          <SystemInfo>
            <CheckLogin>
              <EditorGuide>
                <MessageContainer />
              </EditorGuide>
            </CheckLogin>
          </SystemInfo>
        </SomeoneEditor>
      </LayoutMain>
    </ErrorPage>
  </GlobalLoading>
};