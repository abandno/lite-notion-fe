import {Editor} from '@tiptap/react'
import {useEffect, useState} from "react";
import {getItem, setItem} from "@/utils/storage.ts";

/**
 * 记忆光标位置
 */
export const useCursorMemo = (id, editor: Editor) => {
  const [cursorPosition, setCursorPosition] = useState(null);
  useEffect(() => {
    const {from, to} = getItem<any>(`TIPTAP:EDITOR_CURSOR:${id}`) || {}
    setCursorPosition({from, to});
    console.log('useCursorMemo', id, {from, to})
  }, [id])

  useEffect(() => {
    if (!editor) {
      return
    }
    const handleBlur = () => {
      if (!editor) {
        return
      }
      const {from, to} = editor.state.selection;
      setCursorPosition({from, to});
      setItem(`TIPTAP:EDITOR_CURSOR:${id}`, {from, to})
    };

    const handleFocus = () => {
      if (!editor) {
        return
      }
      if (cursorPosition) {
        // editor.commands.setTextSelection(cursorPosition);
        editor.commands.focus(cursorPosition.from)
        console.log(`editor.commands.setTextSelection`, id, cursorPosition)
      }
    };

    editor.on("blur", handleBlur);
    editor.on("focus", handleFocus);

    return () => {
      editor.off("blur", handleBlur);
      editor.off("focus", handleFocus);
    };
  }, [editor, cursorPosition]);

  return {}
}
