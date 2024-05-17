import { Node } from '@tiptap/pm/model'
import { NodeSelection } from '@tiptap/pm/state'
import { Editor } from '@tiptap/react'
import { useCallback } from 'react'

const useContentItemActions = (editor: Editor, currentNode: Node | null, currentNodePos: number) => {
  const resetTextFormatting = useCallback(() => {
    const chain = editor.chain()

    chain.setNodeSelection(currentNodePos).unsetAllMarks()

    if (currentNode?.type.name !== 'paragraph') {
      chain.setParagraph()
    }

    chain.run()
  }, [editor, currentNodePos, currentNode?.type.name])

  const duplicateNode = useCallback(() => {
    editor.commands.setNodeSelection(currentNodePos)

    const { $anchor } = editor.state.selection
    const selectedNode = $anchor.node(1) || (editor.state.selection as NodeSelection).node

    editor
      .chain()
      .setMeta('hideDragHandle', true)
      .insertContentAt(currentNodePos + (currentNode?.nodeSize || 0), selectedNode.toJSON())
      .run()
  }, [editor, currentNodePos, currentNode?.nodeSize])

  const copyNodeToClipboard = useCallback(() => {
    editor.chain().setMeta('hideDragHandle', true).setNodeSelection(currentNodePos).run()

    document.execCommand('copy')
  }, [editor, currentNodePos])

  const deleteNode = useCallback(() => {
    editor.chain().setMeta('hideDragHandle', true).setNodeSelection(currentNodePos).deleteSelection().run()
  }, [editor, currentNodePos])

  const handleAdd = useCallback(() => {
    if (currentNodePos !== -1) {
      const currentNodeSize = currentNode?.nodeSize || 0
      const insertPos = currentNodePos + currentNodeSize
      const currentNodeIsEmptyParagraph = currentNode?.type.name === 'paragraph' && currentNode?.content?.size === 0
      const focusPos = currentNodeIsEmptyParagraph ? currentNodePos + 2 : insertPos + 2

      editor
        .chain()
        .command(({ dispatch, tr, state }) => {
          if (dispatch) {
            if (currentNodeIsEmptyParagraph) {
              tr.insertText('/', currentNodePos, currentNodePos + 1)
            } else {
              tr.insert(insertPos, state.schema.nodes.paragraph.create(null, [state.schema.text('/')]))
            }

            return dispatch(tr)
          }

          return true
        })
          .focus(focusPos)
          .run()
    }
  }, [currentNode, currentNodePos, editor])

  /**
   * 外部聚焦, 光标定位到首行
   */
  const handleEnterFocus = useCallback((focusPos) => {
    // ~~首行空行, 光标定位到首行; 首行有内容, 插入空行~~
    // const focusVirtualNode = {node: null, editor, pos: focusPos}
    // 光标定位到首行行首
    editor.chain().focus(focusPos).run();
    // console.log("currentNode", currentNode, "currentNodePos", currentNodePos);
    // ??? 按回车, 一会儿光标在第一行, 一会儿光标在第二行
    // editor
    //     .chain()
    //     .command(({dispatch, tr, state}) => {
    //       if (dispatch) {
    //
    //         tr.insert(0, state.schema.nodes.paragraph.create(null));
    //
    //         return dispatch(tr)
    //       }
    //
    //       return true
    //     })
    //     .focus(1)
    //     .run()

    // const currentNodeIsEmptyParagraph = currentNode?.content?.size === 0
    //
    // if (currentNodeIsEmptyParagraph) {
    //   editor.chain().focus(currentNodePos).run();
    // } else {
    //   // editor.chain().insert(insertPos, editor.state.schema.nodes.paragraph.create()).focus(focusPos).run();
    //   editor
    //       .chain()
    //       .command(({dispatch, tr, state}) => {
    //         if (dispatch) {
    //           tr.insert(currentNodePos, state.schema.nodes.paragraph.create())
    //           return dispatch(tr)
    //         }
    //
    //         return true
    //       })
    //       .focus(currentNodePos)
    //       .run()
    // }
  }, [currentNode, currentNodePos, editor])

  return {
    resetTextFormatting,
    duplicateNode,
    copyNodeToClipboard,
    deleteNode,
    handleAdd,
    handleEnterFocus,
  }
}

export default useContentItemActions
