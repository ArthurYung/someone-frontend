export interface SomeoneViewConfig {
  className?: string
}

export interface SomeoneTypewriterPropsConfig {
  speed?: number;
  onWrite?: () => void;
  onWriteEnd?: () => void;
}

export interface SomeoneTypewriterStaticConfig {
  onEditorWrite?: () => void;
  onEditorWriteEnd?: () => void;
}


export interface SomeoneInputerPropsConfig {
  suffixs?: string[];
  onFocus?: () => void;
  onBlur?: () => void;
  onInput?: (value: string) => void;
  onEnter?: (text: string) => void;
}

export interface SomeoneInputerStaticConfig {
  onEditorInput?: (value: string) => void;
  onEditorEnter?: (text: string) => void;
}

export interface EditorState {
  /** Is it possible to add an input box to the view */
  inputerVisible: boolean;
  isWriting: boolean;
}