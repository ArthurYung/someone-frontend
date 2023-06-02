import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { SomeoneEditorProvider } from './context';
import { createSomeoneEditor } from './core';
import './style.scss';

export const SomeoneEditor: FC<{ speed?: number; children: any }> = ({
  speed = 10,
  children,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const onEnterRef = useRef<() => void>(onEnter);
  const pageEditor = useMemo(
    () =>
      createSomeoneEditor({
        speed,
        onEnter() {
          onEnterRef.current?.();
        },
      }),
    []
  );
  const [refreshId, setRefreshId] = useState(0);
  const [mountedEditor, setMountedEditor] = useState(false);

  function onEnter() {
    pageEditor.asyncWrite('<style|color:green>[%someone: %]');
  }

  useEffect(() => {
    if (!editorRef.current) {
      setTimeout(() => {
        setRefreshId(refreshId + 1);
      }, 0);
      return;
    }

    editorRef.current.appendChild(pageEditor.container);
    setMountedEditor(true);
  }, [refreshId, setRefreshId]);

  onEnterRef.current = onEnter;

  return (
    <SomeoneEditorProvider
      value={{ isMounted: mountedEditor, editor: pageEditor }}
    >
      <div className="someone-editor-root" ref={editorRef} />
      {mountedEditor && children}
    </SomeoneEditorProvider>
  );
};
