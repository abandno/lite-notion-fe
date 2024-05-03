import React, {Component, useState} from 'react';
import SortableTree, {
  addNodeUnderParent,
  getTreeFromFlatData,
  removeNodeAtPath,
  TreeItem
} from '@nosferatu500/react-sortable-tree';
// import { SortableTreeWithoutDndContext as SortableTree } from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css'; // This only needs to be imported once in your app
// import FileExplorerTheme from '@nosferatu500/theme-file-explorer';
import FileExplorerTheme from '@/components/theme-file-explorer'
import {Button, Modal, Dropdown, MenuProps} from "antd";
import {useMount} from "ahooks";
import {addDocument, deleteDocument, listDocument} from "@/api";
import {HeartIcon, MoreIcon} from "@/components/icons";
import {DeleteOutlined} from "@ant-design/icons";


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

export default function DocMenuTree() {
  const [treeData, setTreeData] = useState<TreeItem[]>([
    {title: 'Chicken', children: [{title: 'Egg'}]},
    {title: 'Fish', children: [{title: 'fingerline'}]},
  ]);
  const [isDragging, setIsDragging] = useState(false);

  useMount(() => {
    listDocument({userId: 1}).then((res) => {
      const flatItems = res.data;
      flatItems.forEach((e, ix) => {
        e.title = e.title || "未命名-" + ix
      });
      console.log("request flatItems: ", flatItems);
      // flat -> tree
      const treeItems = getTreeFromFlatData({
        flatData: flatItems,
        getKey: n => n.id,
        getParentKey: n => n.pid,
      })
      console.log("treeItems after getTreeFromFlatData", treeItems);
      setTreeData(treeItems);
    })
  })

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
      <div style={{height: 400}}>
        <SortableTree
            treeData={treeData}
            getNodeKey={getNodeKey}
            onChange={onTreeChange}
            theme={FileExplorerTheme}
            onDragStateChanged={onDragStateChanged}
            onMoveNode={({treeData, node, nextParentNode, prevPath, nextPath}) => {
              console.log('onMoveNode: Node:', node, 'Next Parent Node:', nextParentNode, 'Previous Path:', prevPath, 'Next Path:', nextPath);
              // console.log("onMoveNode: treeData.length:", treeData.length);
              const confirm = Modal.confirm({
                title: '权限确认?',
                content: '将继承新的父文档权限, 是否保留原有权限? 是|否',
                onOk() {
                  setTreeData(treeData);
                },
                onCancel() {},
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
  );
}
