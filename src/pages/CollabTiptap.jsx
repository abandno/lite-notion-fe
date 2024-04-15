// import './styles.scss'

import { TiptapCollabProvider } from '@hocuspocus/provider'
import CharacterCount from '@tiptap/extension-character-count'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, {
  useCallback, useEffect,
  useState,
} from 'react'
import * as Y from 'yjs'


import { variables } from '@/variables.js'
import MenuBar from '@/menubar/MenuBar.jsx'

const colors = ['#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70CFF8', '#94FADB', '#B9F18D']
const names = [
  'Lea Thompson',
  'Cyndi Lauper',
  'Tom Cruise',
  'Madonna',
  'Jerry Hall',
  'Joan Collins',
  'Winona Ryder',
  'Christina Applegate',
  'Alyssa Milano',
  'Molly Ringwald',
  'Ally Sheedy',
  'Debbie Harry',
  'Olivia Newton-John',
  'Elton John',
  'Michael J. Fox',
  'Axl Rose',
  'Emilio Estevez',
  'Ralph Macchio',
  'Rob Lowe',
  'Jennifer Grey',
  'Mickey Rourke',
  'John Cusack',
  'Matthew Broderick',
  'Justine Bateman',
  'Lisa Bonet',
]

const getRandomElement = list => list[Math.floor(Math.random() * list.length)]

const getRandomRoom = () => {
  // const roomNumbers = variables.collabRooms?.trim()?.split(',') ?? [10, 11, 12]
  const roomNumbers = ["TestRoom"]

  return getRandomElement(roomNumbers.map(number => `rooms.${number}`))
}
const getRandomColor = () => getRandomElement(colors)
const getRandomName = () => getRandomElement(names)

const room = getRandomRoom()
console.log("room", room);
const ydoc = new Y.Doc()
const websocketProvider = new TiptapCollabProvider({
  // appId: '7j9y6m10', // wss://7j9y6m10.collab.tiptap.cloud/
  name: room,  //: 发送消息时即 documentName
  document: ydoc,
  //wss://${configuration.appId}.collab.tiptap.cloud
  baseUrl: 'ws://localhost:4321',
})

const getInitialUser = () => {
  return JSON.parse(localStorage.getItem('currentUser')) || {
    name: getRandomName(),
    color: getRandomColor(),
  }
}

export default () => {
  const [status, setStatus] = useState('connecting')
  const [currentUser, setCurrentUser] = useState(getInitialUser)

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


  // useEffect(() => {
  //   if (editor) {
  //     editor.on("transaction", () => {
  //       const content = editor.getHTML();
  //       console.log("content", content);
  //     })
  //   }
  // }, [editor])

  useEffect(() => {
    // Update status changes
    websocketProvider.on('status', event => {
      setStatus(event.status)
    })
  }, [])

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
      return setCurrentUser({ ...currentUser, name })
    }
  }, [currentUser])

  return (
    <div className="editor">
      {/*{editor && <MenuBar editor={editor} />}*/}
      <EditorContent className="editor__content" editor={editor} />
      <div className="editor__footer">
        <div className={`editor__status editor__status--${status}`}>
          {status === 'connected'
            ? `${editor.storage.collaborationCursor.users.length} user${editor.storage.collaborationCursor.users.length === 1 ? '' : 's'} online in ${room}`
            : 'offline'}
        </div>
        <div className="editor__name">
          <button onClick={setName}>{currentUser.name}</button>
        </div>
      </div>
    </div>
  )
}
