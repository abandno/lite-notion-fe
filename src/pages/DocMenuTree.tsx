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
import {listDocument} from "@/api";
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

  useMount(() => {
    listDocument().then((res) => {
      const flatItems = res.data.data;
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


  const onTreeChange = async (newTreeData) => {
    console.log(newTreeData);
    // const confirm = Modal.confirm({
    //   title: '权限确认?',
    //   content: '将继承新的父文档权限, 是否保留原有权限? 是|否',
    //   onOk() {
    //     setTreeData(newTreeData);
    //   },
    //   onCancel() {},
    // });
    setTreeData(newTreeData);
  }
  const onDragStateChanged = ({isDragging, draggedNode}) => {
    console.log('isDragging:', isDragging, 'draggedNode:', draggedNode);
  }

  const handleAddDoc = ({node, path}) => {
    console.log("handleAddDoc", node, path);
    setTreeData(
        addNodeUnderParent({
          treeData,
          parentKey: path[path.length - 1],
          // parentKey: node.id,
          expandParent: true,
          getNodeKey,
          newNode: {
            title: `addNode-${new Date()}`,
          },
          addAsFirstChild: false,
        }).treeData
    );
  }
  const handleDeleteDoc = ({node, path}) => {
    console.log("handleDeleteDoc", node, path);
    setTreeData(
        removeNodeAtPath({
          treeData,
          path,
          // path: [...path, node.id],
          getNodeKey,
        })
    );
  }

  return (
      <div style={{height: 400}}>
        <SortableTree
            treeData={treeData}
            getNodeKey={getNodeKey}
            onChange={onTreeChange}
            theme={FileExplorerTheme}
            onDragStateChanged={onDragStateChanged}
            generateNodeProps={({node, path}) => ({
              onClick: () => console.log('Node clicked:', node, path),
              onDoubleClick: () => {
                node.expanded = !node.expanded;
                setTreeData(treeData => treeData.slice());
                console.log('Node expanded:', node.expanded);
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
