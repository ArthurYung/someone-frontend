export interface EditorState {
  /** Is it possible to add an input box to the view */
  inputerVisible: boolean;
  isWriting: boolean;
}

export interface EditorStateUpdater {
  setInputerVisible: (visible: boolean) => void;
  setIsWriting: (status: boolean) => void;
}
export function createEditorState(initState: Partial<EditorState>) {
  const state: EditorState = {
    inputerVisible: false,
    isWriting: false,
    ...initState,
  }

  const updater: EditorStateUpdater = {
    setInputerVisible: (visible: boolean) => {
      state.inputerVisible = visible;
    },
    setIsWriting: (status: boolean) => {
      state.isWriting = status;
    }
  }

  return {
    state, updater
  }
}