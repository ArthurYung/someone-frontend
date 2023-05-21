import { FC, useEffect, useMemo, useRef, useState } from "react";
import { SomeoneEditorProvider } from "./context";
import { createSomeoneEditor } from "./core";
import './style.scss';


export const SomeoneEditor: FC<{ speed?: number, children: any }> = ({ speed = 20, children }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const pageEditor = useMemo(() => createSomeoneEditor({ speed }), []);
  const [refreshId, setRefreshId] = useState(0);
  const [mountedEditor, setMountedEditor] = useState(false);

  useEffect(() => {
    if (!editorRef.current) {
      setTimeout(() => {
        setRefreshId(refreshId + 1)
      }, 0);
      return;
    }

    editorRef.current.appendChild(pageEditor.container);
    setMountedEditor(true);
  }, [refreshId, setRefreshId]);

  return <SomeoneEditorProvider value={{ isMounted: mountedEditor, editor: pageEditor }}><div className="someone-editor-root" ref={editorRef} />{mountedEditor && children}</SomeoneEditorProvider>;
};
