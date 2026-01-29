declare module "@codemirror/view" {
  import type { Extension } from "@codemirror/state";

  export const EditorView: {
    lineWrapping: Extension;
  };
}
