import {Extension} from '@tiptap/core'
import {getItem, setItem} from "@/utils/storage.ts";

export const CursorMemo = Extension.create<any, any>({
  name: 'cursorMemo',

  priority: 999,

  addOptions() {
    return {
      docId: undefined,
      init: false,
    }
  },

  onCreate() {
    // 直接改 this.init 别的回调方法里拿不到？
    this.options.init = true; // 标识初次加载，会有位置自动文末问题
    console.log(this.options.init);
  },

  onSelectionUpdate() {
    /*
     * 未知原因，editor构建时位置1，加载DB内容后，框架自动更新位置到文末，会回调这个方法。
     * 这里强行阻断，取缓存的位置信息更新之。
     */
    // console.log('cursorMemo onSelectionUpdate', this.editor, this.options.docId)
    if (this.options.init) {
      const {from, to} = getItem<any>(`TIPTAP:EDITOR_CURSOR:${this.options.docId}`) || {}
      console.log('cursorMemo getItem', this.options.docId, {from, to})
      this.editor.commands.setTextSelection({from, to});
      this.options.init = false;
    }
  },

  onUpdate() {
    // console.log('cursorMemo onUpdate', this.editor, this.options.docId);
  },

  onFocus() {
    // console.log('cursorMemo onFocus', this.editor, this.options.docId);
  },

  onBlur() {
    // console.log('cursorMemo onBlur', this.editor, this.options.docId);
    const {from, to} = this.editor.state.selection || {};
    setItem(`TIPTAP:EDITOR_CURSOR:${this.options.docId}`, {from, to})
  },

  addStorage() {
    return {
      users: [],
    }
  },

})
