import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { SomeoneEditorProvider } from './context';
import { createSomeoneEditor } from './core';
import './style.scss';

function removeArrayItem<T>(arr: T[], item: T) {
  const index = arr.indexOf(item);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

export const SomeoneEditor: FC<{ speed?: number; children: any }> = ({
  speed = 13,
  children,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const onEnterRefs = useRef<((val: string) =>any)[]>([]);
  const onInputRefs = useRef<((val: string) =>any)[]>([]);
  const pageEditor = useMemo(
    () =>
      createSomeoneEditor({
        speed,
        onEnter(val) {
          // 按顺序执行
          onEnterRefs.current.every(fn =>fn(val) !== false)
        },
        onInput(val) {
          onInputRefs.current.every(fn =>fn(val) !== false)
        }
      }),
    []
  );
  const [refreshId, setRefreshId] = useState(0);
  const [mountedEditor, setMountedEditor] = useState(false);

  function setEnterCallback(callback: (val: string) => any) {
    onEnterRefs.current.push(callback);
    return () => removeArrayItem(onEnterRefs.current, callback)
  }

  function setInputCallback(callback: (val: string) => any) {
    onInputRefs.current.push(callback);
    return () => removeArrayItem(onInputRefs.current, callback)
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

  return (
    <SomeoneEditorProvider
      value={{ isMounted: mountedEditor, editor: pageEditor, setEnterCallback, setInputCallback }}
    >
      <div className="someone-editor-root" ref={editorRef} />
      {mountedEditor && children}
    </SomeoneEditorProvider>
  );
};
