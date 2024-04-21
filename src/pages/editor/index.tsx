import {useLocation, useParams} from "react-router-dom";
import React, {useEffect, useState, useCallback} from "react";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CharacterCount from "@tiptap/extension-character-count";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from 'yjs'
import {TiptapCollabProvider} from '@hocuspocus/provider'
import {getRandomElement} from "@/utils";
import "./index.scss"
import {useMount} from "ahooks";

const colors = ['#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70CFF8', '#94FADB', '#B9F18D']

const getInitialUser = () => {
  return JSON.parse(localStorage.getItem('currentUser')) || {
    name: getRandomElement(["阿妹", "白客", "崔大", "帝豪", "伊人", "伏六"]),
    color: getRandomElement(colors),
  }
}

// 封装 editor , 一个文档id对应一个这个实例
const EditorInner = ({id, title}) => {
  // // const { id , title} = useParams();
  // const { search } = useLocation();
  // const params = new URLSearchParams(search);
  // const id = params.get("id");
  // const title = params.get("title");
  // console.log("edit", id, title);
  useMount(() => {
    console.log("editor mounted ====", id, title);
  })

  const getYdoc = useCallback(() => {
    return new Y.Doc();
  }, [id])
  const [ydoc, setYdoc] = useState(getYdoc());
  const getProvider = useCallback(() => {
    const room = id
    const provider = new TiptapCollabProvider({
      name: room,
      document: ydoc,
      baseUrl: 'ws://localhost:4321',
    });

    return provider;
  }, [ydoc])
  const [status, setStatus] = useState('connecting')
  const [websocketProvider, setWebsocketProvider] = useState(getProvider);
  const [currentUser, setCurrentUser] = useState(getInitialUser)


  // useEffect(() => {
  //   const room = id
  //   const ydoc = new Y.Doc();
  //   const provider = new TiptapCollabProvider({
  //     name: room,
  //     document: ydoc,
  //     baseUrl: 'ws://localhost:4321',
  //   });
  //
  //   setWebsocketProvider(provider);
  //   setYdoc(ydoc);
  //
  //   // 在组件卸载时销毁 ydoc 和 provider
  //   return () => {
  //     ydoc.destroy();
  //     provider.destroy();
  //   };
  // }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Highlight,
      TaskList,
      TaskItem,
      CharacterCount.configure({
        limit: 10000,
      }),
      // Collaboration.configure({
      //   document: ydoc,
      // }),
      Collaboration.configure({
        document: ydoc,
        // provider: websocketProvider,
      }),
      CollaborationCursor.configure({
        provider: websocketProvider,
      }),
    ],
  })

  // Save current user to localStorage and emit to editor
  useEffect(() => {
    if (editor && currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      editor.chain().focus().updateUser(currentUser).run()
    }
  }, [editor, currentUser])

  const setName = useCallback(() => {
    const name = (window.prompt('Name') || '').trim().substring(0, 32)

    if (name) {
      return setCurrentUser({...currentUser, name})
    }
  }, [currentUser])

  return (
      <div className="editor">
        <div>Edit Area for article {id} {title}</div>
        ;
        {/*{editor && <MenuBar editor={editor} />}*/}
        <EditorContent className="editor__content" editor={editor}/>
        <div className="editor__footer">
          <div className={`editor__status editor__status--${status}`}>
            {status === 'connected'
                ? `${editor.storage.collaborationCursor.users.length} user${editor.storage.collaborationCursor.users.length === 1 ? '' : 's'} online in ${id} ${title}`
                : 'offline'}
          </div>
          <div className="editor__name">
            <button onClick={setName}>{currentUser.name}</button>
          </div>
        </div>
      </div>
  )
}

export default () => {
  // const { id , title} = useParams();
  const {search} = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get("id");
  const title = params.get("title");
  console.log("edit", id, title);
  return (
      <div key={id}>
        <EditorInner id={id} title={title}/>
      </div>
  )
}
