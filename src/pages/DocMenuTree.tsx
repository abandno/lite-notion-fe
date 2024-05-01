import React, {Component, useState} from 'react';
import SortableTree from '@nosferatu500/react-sortable-tree';
// import { SortableTreeWithoutDndContext as SortableTree } from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css'; // This only needs to be imported once in your app
// import FileExplorerTheme from '@nosferatu500/theme-file-explorer';
import FileExplorerTheme from '@/components/theme-file-explorer'
import {Modal} from "antd";


export default function DocMenuTree() {
  const [treeData, setTreeData] = useState([
    {title: 'Chicken', children: [{title: 'Egg'}]},
    {title: 'Fish', children: [{title: 'fingerline'}]},
  ]);


  const onTreeChange = async (newTreeData) => {
    console.log(newTreeData);
    const confirm = Modal.confirm({
      title: '权限确认?',
      content: '将继承新的父文档权限, 是否保留原有权限? 是|否',
      onOk() {
        setTreeData(newTreeData);
      },
      onCancel() {},
    });
  }
  const onDragStateChanged = ({isDragging, draggedNode}) => {
    console.log('isDragging:', isDragging, 'draggedNode:', draggedNode);
  }

  return (
      <div style={{height: 400}}>
        <SortableTree
            treeData={treeData}
            onChange={onTreeChange}
            theme={FileExplorerTheme}
            onDragStateChanged={onDragStateChanged}
        />
      </div>
  );
}
