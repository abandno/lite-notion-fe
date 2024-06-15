import { useLocation, useParams } from "react-router-dom";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CharacterCount from "@tiptap/extension-character-count";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import { TiptapCollabProvider } from "@hocuspocus/provider";
import { ClientId, getRandomElement } from "@/utils";
import { useDebounceFn, useMount, useUnmount, useUpdate } from "ahooks";
import { ExtensionKit } from "@components/extensions/extension-kit";
import "./index.scss";
import "@/styles/editor/index.css";
import { TextMenu } from "../menus/TextMenu";
import { ContentItemMenu } from "@components/menus";
import ImageBlockMenu from "@components/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@components/extensions/MultiColumn/menus";
import {
  TableColumnMenu,
  TableRowMenu,
} from "@components/extensions/Table/menus";
import useContentItemActions from "@components/menus/ContentItemMenu/hooks/useContentItemActions.tsx";
import { EditorContext } from "@/context";
import { getDocInfo, updateDocInfo } from "@/api";
import { useLinkState } from "@/hooks";
import {useCurrentDocNode, useDocTreeStore, useTreeData} from "@/store/docTreeStore.ts";
import {changeNodeAtPath, findByKey, getNodeKeyFn} from "@/utils/tree-data-utils.ts";
import {Tooltip} from "antd";

const colors = [
  "#958DF1",
  "#F98181",
  "#FBBC88",
  "#FAF594",
  "#70CFF8",
  "#94FADB",
  "#B9F18D",
];

const getInitialUser = () => {
  return (
    JSON.parse(localStorage.getItem("currentUser")) || {
      name: getRandomElement(["阿妹", "白客", "崔大", "帝豪", "伊人", "伏六"]),
      color: getRandomElement(colors),
    }
  );
};

const buildYdoc = () => {
  const ydoc = new Y.Doc();
  // 用一个 clientId 有点问题, 这里的 clientId 定位估计是一个文档对应一个 clientId
  // ydoc.clientID = ClientId.getClientId();
  console.log("buildYdoc, clientId", ydoc.clientID);
  return ydoc;
};
const buildTiptapCollabProvider = (room, ydoc) => {
  console.log("buildTiptapCollabProvider", room);
  return new TiptapCollabProvider({
    name: room,
    document: ydoc,
    baseUrl: "ws://localhost:4321",
  });
};

const DocumentTitle = ({ editor }) => {
  const {currentDocNode, setCurrentDocNode} = useCurrentDocNode();
  const actions = useContentItemActions(editor, null, 1);
  // const {itemMap} = useDocTreeStore();
  // const currentNode = itemMap[id] || {}
  // const {render} = useDocTreeStore(state => state.actions)
  // const { currentDocumentTitle, setCurrentDocumentTitle } =
  //   useContext(EditorContext);
  const [titleValue, setTitleValue] = useState(currentDocNode.titleText);
  // // 使用 useEffect 来监听 currentDocumentTitle 的变化
  // useEffect(() => {
  //   // 当 currentDocumentTitle 变化时，更新 titleValue
  //   setTitleValue(currentDocumentTitle);
  // }, [currentDocumentTitle]); // 注意这里的依赖数组包含了 currentDocumentTitle
  // const [titleValue, setTitleValue] = useLinkState(currentDocumentTitle);

  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef(null);
  const {treeData, setTreeData} = useTreeData(currentDocNode.root)

  const { run: debounceUpdateDocInfo } = useDebounceFn(
    (newTitle, oldTitle) => {
      // console.log("debounceUpdateDocInfo", oldTitle);
      // 持久化新标题, 成功后, 通知上层, 否则, 回滚
      updateDocInfo({ id: currentDocNode.id, title: newTitle })
        .then(() => {
          // console.log("updateDocInfo success");
          // setCurrentDocumentTitle(titleValue);
          // currentNode.title = newTitle;
          // setItemMap(itemMap)
          // render();
          console.log('updateDocInfo before', treeData)
          const treeDataN = changeNodeAtPath({
            treeData,
            path: currentDocNode.path.slice(1), // space id 去掉
            ignoreCollapsed: false,
            newNode: ({node, treeIndex}) => ({
              ...node,
              titleText: newTitle,
              title: (<Tooltip key={currentDocNode.id} title={currentDocNode.id}>{newTitle}</Tooltip>)
            })
          })
          console.log('updateDocInfo after', treeDataN)
          setTreeData(treeDataN)
        })
        .catch((e) => {
          console.log("updateDocInfo failed", e);
          setTitleValue(oldTitle);
          // currentNode.title = oldTitle;
          // setItemMap(itemMap)
          // render();
        });
    },
    {
      wait: 500,
    }
  );

  // !! 不能 async , 会导致输入后光标蹦到行尾了
  const handleChange = (e) => {
    console.log("handleChange", e.target.value);
    const oldTitle = titleValue;
    const { value: newTitle, selectionStart } = e.target;
    const cursorPosition = inputRef.current.selectionStart;
    console.log("handleChange cursorPosition", cursorPosition);
    // if (isComposing) {
    //   return
    // }
    // 更新文档 title
    // await updateDocInfo({id, title: newTitle})
    setTitleValue(newTitle);
    // 保存当前光标位置
    // 在这里可以处理你的逻辑
    // 设置光标位置
    // setTimeout(() => {
    //   inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    // }, 200);

    debounceUpdateDocInfo(newTitle, oldTitle);
  };
  const [isComposing, setIsComposing] = useState(false);

  return (
    <div className="doc-title-zone caret-black dark:caret-white outline-0 pr-8 pl-20 py-4 z-0 lg:pl-8 lg:pr-8;">
      <div className="mx-auto max-w-2xl">
        <input
          type="text"
          className="text-3xl font-bold my-4 focus:outline-none bg-transparent"
          ref={inputRef}
          value={titleValue}
          // defaultValue={currentDocNode.title}
          placeholder="输入标题"
          onChange={handleChange}
          // onInput={handleChange}
          onKeyDown={(e) => {
            // console.log("keydown", e);
            if (e.key === "Enter" || e.keyCode === 13) {
              e.preventDefault(); // 阻止默认的回车行为
              actions.handleEnterFocus(1);
            }
          }}
          onCompositionStart={() => {
            // console.log('onCompositionStart');
            setIsComposing(true);
          }}
          onCompositionEnd={() => {
            // console.log("onCompositionEnd");
            setIsComposing(false);
          }}
        />
        <p className="text-sm space-x-4">
          <span>{currentDocNode.updatedBy}</span>
          <span>{currentDocNode.updatedAt}</span>
        </p>
      </div>
    </div>
  );
};

// 封装 editor , 一个文档id对应一个这个实例
const EditorInner = ({ id, title, ydoc, provider }) => {
  // // const { id , title} = useParams();
  // const { search } = useLocation();
  // const params = new URLSearchParams(search);
  // const id = params.get("id");
  // const title = params.get("title");
  // console.log("edit", id, title);
  const menuContainerRef = useRef(null);
  useMount(() => {
    console.log("[EditorInner] editor mounted", id, title);
  });
  useUnmount(() => {
    console.log("[EditorInner] editor unmounted", id, title);
    if (provider) {
      try {
        provider.destroy();
      } catch (e) {
        console.log("provider destroy error", e);
      }
    }
    if (ydoc) {
      try {
        ydoc.destroy();
      } catch (e) {
        console.log("ydoc destroy error", e);
      }
    }
  });

  const [status, setStatus] = useState("connecting");
  // const [websocketProvider, setWebsocketProvider] = useState(null);
  const [currentUser, setCurrentUser] = useState(getInitialUser);
  // console.log("currentUser", currentUser);

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

  const editor = useEditor(
    {
      extensions: [
        ...ExtensionKit({
          provider,
        }),
        // StarterKit.configure({
        //   history: false,
        // }),
        // Highlight,
        // TaskList,
        // TaskItem,
        // CharacterCount.configure({
        //   limit: 10000,
        // }),
        // Collaboration.configure({
        //   document: ydoc,
        // }),
        Collaboration.configure({
          document: ydoc,
          // provider: websocketProvider,
        }),
        CollaborationCursor.configure({
          provider: provider,
        }),
      ],
    },
    [ydoc, provider]
  );

  useEffect(() => {
    // Update status changes
    provider.on("status", (event) => {
      setStatus(event.status);
    });
  });

  // Save current user to localStorage and emit to editor
  useEffect(() => {
    if (editor && currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      editor.chain().focus().updateUser(currentUser).run();
    }
  }, [editor, currentUser]);

  const setName = useCallback(() => {
    const name = (window.prompt("Name") || "").trim().substring(0, 32);

    if (name) {
      return setCurrentUser({ ...currentUser, name });
    }
  }, [currentUser]);

  if (!editor) {
    return null;
  }

  return (
    <div className="editor flex flex-col" ref={menuContainerRef}>
      {/*{editor && <MenuBar editor={editor} />}*/}
      <div className="relative flex flex-col flex-1 overflow-hidden">
        <DocumentTitle editor={editor} />
        {/*className="editor__content"*/}
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        <ContentItemMenu editor={editor} />
        {/*选中内容上方的一行工具按钮*/}
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
      {/*<div className="editor__footer">
          <div className={`editor__status editor__status--${status}`}>
            {status === 'connected'
                ? `${editor.storage.collaborationCursor.users.length} user${editor.storage.collaborationCursor.users.length === 1 ? '' : 's'} online in ${id} ${title}`
                : 'offline'}
          </div>
          <div className="editor__name">
            <button onClick={setName}>{currentUser.name}</button>
          </div>
        </div>*/}
    </div>
  );
};

export const Editor = () => {
  // const { id } = useParams();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get("id");
  const space = params.get("space");
  const {treeData} = useTreeData(space)
  const {currentDocNode, setCurrentDocNode} = useCurrentDocNode();

  // const title = params.get("title");
  const { currentDocumentTitle, setCurrentDocumentTitle } = useContext(EditorContext);
  useEffect(() => {
    // console.log("getDocInfo", id);
    // getDocInfo({ id }).then((res) => {
    //   console.log("getDocInfo res", res);
    //   if (currentDocumentTitle !== res.data.title) {
    //     // setCurrentDocumentTitle(res.data.title);
    //   }
    // });

    // treeData 中找到当前文档节点, 只有在直接url跳转时才需要, 点击菜单树节点时不需要
    if (currentDocNode == null) { // 可能是直接url跳转场景
      const currentDocNode = findByKey({key: id, treeData, getNodeKey: getNodeKeyFn})
      setCurrentDocNode(currentDocNode)
      // console.log("findByKey then setCurrentDocNode", currentDocNode, treeData?.length)
    }
  }, [id, treeData]); // url跳转, treeData 一开始还没来得及加载

  const title = currentDocumentTitle;
  console.log("Editor title", title);
  useMount(() => {
    console.log("[Editor] editor mounted", id, title);
  });
  useUnmount(() => {
    console.log("[Editor] editor unmounted", id, title);
  });
  const [ydoc, setYdoc] = useState(null);
  const [websocketProvider, setWebsocketProvider] = useState(null);
  useEffect(() => {
    const ydoc = buildYdoc();
    setYdoc(ydoc);
    var provider = buildTiptapCollabProvider(id, ydoc);
    setWebsocketProvider(provider);
  }, [id]);
  const editorReady = ydoc && websocketProvider;
  return (
    editorReady && (
      <div className={"page-zone"} key={id}>
        <EditorInner
          id={id}
          title={currentDocumentTitle}
          ydoc={ydoc}
          provider={websocketProvider}
        />
      </div>
    )
  );
};
