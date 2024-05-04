import React, {Component, useState, CSSProperties} from 'react';
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
import {useMount} from "ahooks";
import {addDocument, deleteDocument, listDocument, moveNode} from "@/api";
import {HeartIcon, MoreIcon} from "@/components/icons";
import {CaretRightOutlined, DeleteOutlined} from "@ant-design/icons";
import {find} from "@/utils";
import {DndContext, DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'


/**
 * @param { node: nextNode, treeIndex: currentIndex }
 */
const getNodeKey = ({node, treeIndex}) => node.id

const NodeDropdown = ({node, path, onAddDoc, onDeleteDoc}) => {
  const style = {
    display: node.isHovering ? "inline" : "none",
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

  const handleClick = () => {
    console.log("Dropdown click")
  }

  return (
      <Dropdown menu={{items: dropdownItems, onClick: handleMenuClick}} trigger={['click']}>
        <Button type="text" style={style} onClick={handleClick}>
          <MoreIcon/>
        </Button>
      </Dropdown>
  )
}

export function SortableTreeCard({treeData, updateTreeData}) {
  // const [treeData, setTreeData] = useState<TreeItem[]>([
  //   {title: 'Chicken', children: [{title: 'Egg'}]},
  //   {title: 'Fish', children: [{title: 'fingerline'}]},
  // ]);
  const [isDragging, setIsDragging] = useState(false);
  const setTreeData = updateTreeData;

  // useMount(() => {
  //   listDocument({userId: 1}).then((res) => {
  //     const flatItems = res.data;
  //     flatItems.forEach((e, ix) => {
  //       e.title = e.title || "未命名-" + ix
  //     });
  //     console.log("request flatItems: ", flatItems);
  //     // flat -> tree
  //     const treeItems = getTreeFromFlatData({
  //       flatData: flatItems,
  //       getKey: n => n.id,
  //       getParentKey: n => n.pid,
  //     })
  //     console.log("treeItems after getTreeFromFlatData", treeItems);
  //     setTreeData(treeItems);
  //   })
  // })

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
                    const [n, ix] = find(children, (e, ix) => e.id == node.id);
                    const prev = children[ix - 1];
                    const next = children[ix + 1];
                    console.log("prev", prev, "next", next);
                    const oldPid = node.pid;
                    // 旧的父节点下删除当前节点信息, 如子节点计数; 当前节点更新相关属性, 如pid,sort
                    const req = {
                      prevPid: oldPid,
                      node: {
                        id: node.id,
                        sort: ((prev.sort || -10000) + (next.sort || 10000)) / 2,
                        pid: nextParentNode?.id || 0,
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
                onClick: () => console.log('Node clicked:', node, path),
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
              })}
          />
      </div>
  )
}

export default function DocMenuTree() {
  const { token } = theme.useToken();
  const panelStyle: React.CSSProperties = {
    marginBottom: 1,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };
  const [mySpaceTreeData, setMySpaceTreeData] = useState([]);
  const [knowledgeBaseTreeData, setKnowledgeBaseTreeData] = useState([]);

  useMount(() => {
    listDocument({userId: 1}).then((res) => {
      const flatItems = res.data;
      flatItems.forEach((e, ix) => {
        e.title = e.title || "未命名-" + e.id
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
  })

  return (
      // @ts-ignore
      <DndProvider debugMode={false} backend={HTML5Backend}>
        <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            style={{ background: token.colorBgContainer }}
            items={[{
              key: '1',
              label: '我的空间',
              style: panelStyle,
              children: <SortableTreeCard treeData={mySpaceTreeData} updateTreeData={setMySpaceTreeData} />
            }, /*{
              key: '2',
              label: '共享空间',
              style: panelStyle,
              children: <SortableTreeCard />
            },*/ {
              key: '3',
              label: '知识库',
              style: panelStyle,
              children: <SortableTreeCard treeData={knowledgeBaseTreeData} updateTreeData={setKnowledgeBaseTreeData} />
            }]}
        />
        <div>{knowledgeBaseTreeData.map(e => e.id + "--" + e.title)}</div>
      </DndProvider>
  )
}
