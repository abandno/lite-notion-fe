import React, {Component, useState, CSSProperties, useRef, useContext, useEffect} from 'react';
import SortableTree, {
  SortableTreeWithoutDndContext,
  addNodeUnderParent,
  getTreeFromFlatData,
  removeNodeAtPath,
  TreeItem
} from '@nosferatu500/react-sortable-tree';
// import { SortableTreeWithoutDndContext as SortableTree } from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css'; // This only needs to be imported once in your app
// import FileExplorerTheme from '@nosferatu500/theme-file-explorer';
import FileExplorerTheme from '@/components/theme-file-explorer'
import {Button, Modal, Dropdown, MenuProps, CollapseProps, Collapse, theme} from "antd";
import {useFocusWithin, useHover, useMount} from "ahooks";
import {addDocument, deleteDocument, listDocument, moveNode} from "@/api";
import {HeartIcon, MoreIcon} from "@/components/icons";
import {CaretRightOutlined, DeleteOutlined, FileAddOutlined, FormOutlined} from "@ant-design/icons";
import {find} from "@/utils";
import {DndContext, DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import './DocMenuTree.scss';
import {Ellipsis} from "lucide-react";
import {Icon} from "@components/ui/Icon.tsx";
import {EditorContext} from "@/context";

const DocMenuContext = React.createContext({
  selectedNode: null,
  setSelectedNode: null
});
const DocMenuProvider = ({children}) => {
  const [selectedNode, setSelectedNode] = useState();

  return (
      <DocMenuContext.Provider value={{selectedNode, setSelectedNode}}>
        {children}
      </DocMenuContext.Provider>
  )
}

/**
 * @param { node: nextNode, treeIndex: currentIndex }
 */
const getNodeKey = ({node, treeIndex=undefined}) => node.id

const NodeDropdown = ({node, path, onAddDoc, onDeleteDoc}) => {
  const style: CSSProperties = {
    display: node.isHovering ? "inline" : "none",
    float: "right",
  }
  const dropdownItems: MenuProps['items'] = [
    {
      label: '新建文档',
      key: 'createDoc',
    },
    {
      label: '删除',
      key: 'deleteDoc',
      icon: <DeleteOutlined/>,
    },
  ]
  const handleMenuClick: MenuProps['onClick'] = ({key}) => {
    if (key === 'createDoc') {
      onAddDoc({node, path})
    } else if (key === 'deleteDoc') {
      onDeleteDoc({node, path})
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    console.log("Dropdown click")
  }

  return (
      <Dropdown menu={{items: dropdownItems, onClick: handleMenuClick}} trigger={['click']}>
        <Button type="text" style={style} onClick={handleClick} size="small">
          {/*<MoreIcon/>*/}
          <Icon name="Ellipsis"/>
        </Button>
      </Dropdown>
  )
}

const TextIconButton = ({onClick = undefined, ...restProps}) => {
  const {children} = restProps;
  const handleClick = (event) => {
    // 触发上层元素的 focus 事件
    event.currentTarget.parentElement.focus();

    // 调用原来的 onClick 事件处理函数
    if (onClick) {
      onClick(event);
    }
  }
  return (
      <Button type="text" onClick={handleClick} {...restProps}>
        {children}
      </Button>
  )
}

export function SortableTreeCard({treeData, updateTreeData}) {
  // const [treeData, setTreeData] = useState<TreeItem[]>([
  //   {title: 'Chicken', children: [{title: 'Egg'}]},
  //   {title: 'Fish', children: [{title: 'fingerline'}]},
  // ]);
  const [isDragging, setIsDragging] = useState(false);
  const setTreeData = updateTreeData;

  // isDragging true -> onChange -> onMoveNode -> isDragging false
  const onTreeChange = async (newTreeData) => {
    console.log("onTreeChange", newTreeData);
    console.log("onTreeChange: treeData.length:", newTreeData.length);
    if (!isDragging) {
      setTreeData(newTreeData);
    } // 拖拽移动时, 在 onMoveNode 中判断是否更新
  }
  const onDragStateChanged = ({isDragging, draggedNode}) => {
    console.log('isDragging:', isDragging, 'draggedNode:', draggedNode);
    setIsDragging(isDragging);
  }

  const handleAddDoc = async ({node, path}) => {
    console.log("handleAddDoc", node, path);

    let resp = await addDocument({pid: node.id, level: node.level + 1});
    setTreeData(
        addNodeUnderParent({
          treeData,
          parentKey: path[path.length - 1],
          // parentKey: node.id,
          expandParent: true,
          getNodeKey,
          newNode: resp.data,
          addAsFirstChild: false,
        }).treeData
    );
  }
  const handleDeleteDoc = async ({node, path}) => {
    console.log("handleDeleteDoc", node, path);
    const confirm = Modal.confirm({
      title: `确认删除 '${node.title}'(${node.id})?`,
      // content: '',
      async onOk() {
        await deleteDocument({id: node.id})
        setTreeData(
            removeNodeAtPath({
              treeData,
              path,
              getNodeKey,
            })
        );
      },
      onCancel() {
      },
    });
  }

  const {selectedNode, setSelectedNode} = useContext(DocMenuContext);

  return (
      <div style={{height: 200}}>
          <SortableTreeWithoutDndContext
              treeData={treeData}
              getNodeKey={getNodeKey}
              onChange={onTreeChange}
              theme={FileExplorerTheme}
              onDragStateChanged={onDragStateChanged}
              onMoveNode={({treeData, node, nextParentNode, prevPath, nextPath, prevTreeIndex, nextTreeIndex}) => {
                console.log('onMoveNode: Node:', node, 'Next Parent Node:', nextParentNode, 'Previous Path:', prevPath, 'Next Path:', nextPath, 'prevTreeIndex', prevTreeIndex, 'nextTreeIndex', nextTreeIndex);
                // console.log("onMoveNode: treeData.length:", treeData.length);
                // 层级没有变, 序号变了; 层级+序号; 往前移动, 目标位置前插入, 往后移动, 目标位置后面插入
                const confirm = Modal.confirm({
                  title: '权限确认?',
                  content: '将继承新的父文档权限, 是否保留原有权限? 是|否',
                  async onOk() {
                    // nextParentNode children 中更新当前插入节点的顺序
                    const children = nextParentNode?.children || treeData;
                    // 在新的父亲下面, 找到当前节点的前后兄弟
                    const [n, ix] = find(children, (e, ix) => e.id == node.id) || [];
                    const prev = children[ix - 1];
                    const next = children[ix + 1];
                    console.log("prev", prev, "next", next);
                    const oldPid = node.pid;
                    // 旧的父节点下删除当前节点信息, 如子节点计数; 当前节点更新相关属性, 如pid,sort
                    const req = {
                      prevPid: oldPid,
                      node: {
                        id: node.id,
                        sort: ((parseFloat(prev?.sort) || -10000) + (parseFloat(next?.sort) || 10000)) / 2,
                        pid: nextParentNode?.id || node.pid,
                      }
                    }
                    console.log("onMoveNode request param:", req);
                    await moveNode(req)

                    setTreeData(treeData);
                  },
                  onCancel() {
                  },
                });
              }}
              generateNodeProps={({node, path}) => ({
                onClick: () => {
                  // console.log('Node clicked:', node, path)
                  setSelectedNode(node);
                  setTreeData(treeData => treeData.slice());
                },
                onDoubleClick: () => {
                  node.expanded = !node.expanded;
                  setTreeData(treeData => treeData.slice());
                  // console.log('onDoubleClick: Node expanded:', node.expanded);
                },
                onMouseEnter: () => {
                  node.isHovering = true;
                  setTreeData([...treeData])
                },
                onMouseLeave: () => {
                  node.isHovering = false;
                  setTreeData([...treeData])
                },
                buttons: [
                  <NodeDropdown node={node} path={path} onAddDoc={handleAddDoc} onDeleteDoc={handleDeleteDoc}/>,
                ],
                // 传入当前点选的节点
                selectedNode: selectedNode,
              })}
          />
      </div>
  )
}

const MySpaceTitleLine = ({handleAddDoc}) => {
  const ref = useRef(null);
  const isHovering = useHover(ref);
  const {token} = theme.useToken();
  //  tabIndex={-1} style={{...(isFocusWithin && focusStyle)}}
  const focusStyle =  {
    borderRadius: token.borderRadius,
    boxShadow: `0 0 0 1px ${token.colorBorder}`,
    backgroundColor: token.colorFill,
  };

  const iconBtnClick = (event) => {
    // 阻止事件冒泡
    event.stopPropagation();
    if (handleAddDoc) {
      handleAddDoc();
    }
  }

  return (<div ref={ref}>
    <span>我的空间</span>
    <TextIconButton size={"small"}
                    style={{float: "right", display: isHovering ? 'inline' : 'none'}}
                    onClick={iconBtnClick}
    >
      <FileAddOutlined />
    </TextIconButton>
  </div>)
}



export function DocMenuTree0({onSelectedChange}) {
  const {token} = theme.useToken();
  const panelStyle: React.CSSProperties = {
    marginBottom: 1,
    // background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };
  const [mySpaceTreeData, setMySpaceTreeData] = useState([]);
  const [knowledgeBaseTreeData, setKnowledgeBaseTreeData] = useState([]);

  const {currentDocumentTitle} = useContext(EditorContext);
  useEffect(() => {
    console.log("currentDocumentTitle change", currentDocumentTitle)
    refreshDocument();
  }, [currentDocumentTitle])

  function refreshDocument() {
    listDocument({userId: 1}).then((res) => {
      const flatItems = res.data;
      flatItems.forEach((e, ix) => {
        e.title = e.title || "未命名"
        e.title = e.title + "-" + e.id; //debug
        // e.title = <span style={{color: "red"}}>{e.title}</span>
      });
      console.log("request flatItems: ", flatItems);
      // flat -> tree
      const treeItems = getTreeFromFlatData({
        flatData: flatItems,
        getKey: n => n.id,
        getParentKey: n => n.pid,
      })
      console.log("treeItems after getTreeFromFlatData", treeItems);
      // 拆分
      const mySpace = treeItems.filter(e => e.id == 8001)[0]?.children;
      const knowledgeBases = treeItems.filter(e => e.id != 8001);
      console.log("拆分后:", mySpace, knowledgeBases);
      // mySpace 中克隆出映射在共享空间 todo
      setMySpaceTreeData(mySpace);
      setKnowledgeBaseTreeData(knowledgeBases);
      // setTreeData(treeItems);
    })
  }

  useMount(() => {
    refreshDocument();
  })

  const handleAddRootDoc = async ({pid, treeData, setTreeData, activeKey}) => {
    console.log("handleAddRootDoc");
    let resp = await addDocument({pid, level: 0, sort: treeData.length * 10000});
    refreshDocument();
    setActiveKey(activeKey);
  }

  const [activeKey, setActiveKey] = useState(["1"]);
  const {selectedNode, setSelectedNode} = useContext(DocMenuContext);
  useEffect(() => {
    // 这里可以添加处理 selectedNode 变化的代码
    // console.log("selectedNode has changed:", selectedNode);
    if (selectedNode) {
      onSelectedChange(selectedNode);
    }
  }, [selectedNode]);

  return (
      // @ts-ignore
      <DndProvider debugMode={false} backend={HTML5Backend}>
          <Collapse
            className={"doc-menu-tree"}
            bordered={false}
            // defaultActiveKey={['1']}
            activeKey={activeKey}
            onChange={(key) => {
              console.log("activeKey change to:", key);
              setActiveKey(key as string[])
            }}
            expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
            style={{background: token.colorBgContainer}}
            items={[{
              key: '1',
              label: (<MySpaceTitleLine
                  handleAddDoc={() => handleAddRootDoc({
                    pid: 8001,
                    treeData: mySpaceTreeData,
                    setTreeData: setMySpaceTreeData,
                    activeKey: "1"
                  })}/>),
              style: panelStyle,
              children: <SortableTreeCard treeData={mySpaceTreeData}
                                          updateTreeData={setMySpaceTreeData}
              />
            }, /*{
                      key: '2',
                      label: '共享空间',
                      style: panelStyle,
                      children: <SortableTreeCard />
                    },*/ /*{
              key: '3',
              label: '知识库',
              style: panelStyle,
              children: <SortableTreeCard treeData={knowledgeBaseTreeData}
                                          updateTreeData={setKnowledgeBaseTreeData}
              />
            }*/
            ]}
          />
      </DndProvider>
  )
}

export default function DocMenuTree({onSelectedChange}) {
  return (
      <DocMenuProvider>
        <DocMenuTree0 onSelectedChange={onSelectedChange}/>
      </DocMenuProvider>
  )
};
