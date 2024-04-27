/*
[Rich Tree View - Items - MUI X](https://mui.com/x/react-tree-view/rich-tree-view/items/#item-label)
 */
import * as React from 'react';
import Box from '@mui/material/Box';
import {TreeViewBaseItem} from '@mui/x-tree-view/models';
import {RichTreeView} from '@mui/x-tree-view/RichTreeView';
import {SimpleTreeView} from '@mui/x-tree-view/SimpleTreeView';
import {useMount} from "ahooks";
import {listDocument} from "@/api";
import {useState} from "react";
import {TreeItem, treeItemClasses} from '@mui/x-tree-view/TreeItem';
// import { TreeItem } from '@mui/lab';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface TreeNodeData {
  id: string;
  title?: string;
  // label?: string;
  children?: TreeNodeData[];
}


const generateNodeId = () => `node-${Math.random().toString(36).slice(2, 10)}`;

const initialData = [
  {
    id: generateNodeId(),
    label: 'Node 1',
    children: [
      {id: generateNodeId(), label: 'Child 1'},
      {id: generateNodeId(), label: 'Child 2'},
    ],
  },
  {
    id: generateNodeId(),
    label: 'Node 2',
    children: [{id: generateNodeId(), label: 'Child'}],
  },
];

const DraggableTreeItem__bak = ({node, index, provided, snapshot}) => (
    <TreeItem
        nodeId={node.id}
        label={node.label}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        icon={node.children ? snapshot.isDragging ? <ExpandMoreIcon/> : <ChevronRightIcon/> : null}
    >
      {Array.isArray(node.children) && (
          <Droppable droppableId={node.id}>
            {(provided) => (
                <ul ref={provided.innerRef} {...provided.droppableProps}>
                  {node.children.map((child, childIndex) => (
                      <Draggable key={child.id} draggableId={child.id} index={childIndex}>
                        {(provided, snapshot) => (
                            // <li ref={provided.innerRef} {...provided.draggableProps}>
                            <DraggableTreeItem node={child} index={childIndex} provided={provided}
                                               snapshot={snapshot}/>
                            // </li>
                        )}
                      </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
            )}
          </Droppable>
      )}
    </TreeItem>
);

const DraggableTreeItem = ({id, label, children, index}) => {
  const draggableId = `DraggableTreeItem-${id}`;
  return (
      <Draggable key={draggableId} draggableId={draggableId} index={index}>
        {(provided, snapshot) => (
            <TreeItem itemId={id + ""} label={label}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
            >
            </TreeItem>
        )}
      </Draggable>
      // <TreeItem itemId={id} label={label}>
      //   <Draggable draggableId={"TreeItem" + id} index={index}>
      //     {(provided) => (
      //         <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
      //           {id} -- {label}
      //         </div>
      //     )}
      //   </Draggable>
      // </TreeItem>
  )
}



const RichDraggableTreeView__bak = ({treeData = []}) => {
  // const [treeData, setTreeData] = useState(initialData);

  return (
      <DragDropContext onDragEnd={(result) => onDragEnd(result, treeData)}>
        <SimpleTreeView defaultCollapseIcon={<ExpandMoreIcon/>} defaultExpandIcon={<ChevronRightIcon/>}>
          {treeData.map((node, index) => (
              <Draggable key={node.id} draggableId={node.id} index={index}>
                {(provided, snapshot) => (
                    <li ref={provided.innerRef} {...provided.draggableProps}>
                      <DraggableTreeItem node={node} index={index} provided={provided} snapshot={snapshot}/>
                    </li>
                )}
              </Draggable>
          ))}
        </SimpleTreeView>
      </DragDropContext>
  );
};


const DraggableTreeView = ({treeItems, onDragEnd}) => {
  console.log("DraggableTreeView", treeItems);
  return (
      <DragDropContext onDragEnd={(result) => onDragEnd(result, treeItems)}>
        <SimpleTreeView>
          <Droppable key="DroppableTreeView" droppableId="DroppableTreeView">
            {(provided) => (
                <ul ref={provided.innerRef} {...provided.droppableProps}>
                  {treeItems.map((item, index) => (
                      <DraggableTreeItem key={item.id} index={index} {...item} />
                  ))}
                  {provided.placeholder}
                </ul>
            )}
          </Droppable>
        </SimpleTreeView>
      </DragDropContext>
  )
}


export default function DocMenuTree() {
  const [data, setData] = useState<TreeNodeData[]>([]);
  useMount(() => {
    listDocument().then((res) => {
      const treeItems = res.data.data;
      treeItems.forEach((e, ix) => e.label = e.title || "未命名-" + ix);
      setData(treeItems);
    })
  })

  const onDragEnd = (result, nodes) => {
    // 这里需要实现拖拽结束后的逻辑，更新节点顺序
    // 注意处理边界情况，比如拖动到根节点、不同层级间的拖动等
    /*
     * {
     *   source: {index: 2, dropableId: 'DropableTreeView'},
     *   destination: {index: 3, dropableId: 'DropableTreeView'},
     *   draggableId: 'DraggableTreeItem-1'
     * }
     */
    console.log(result, nodes);
    // source.index 删除, destination.index 插入
    const six = result.source.index;
    const dix = result.destination.index;

    if (six == dix) {
      return;
    }
    const snode = nodes.splice(six, 1)[0]
    // nodes.splice(six < dix ? dix : dix + 1, 0, snode);
    // 向后移动, 目标item后面插入, 向前移动, 目标item前面插入, 所以, 刚好都是 dix 位置插入
    nodes.splice(dix, 0, snode);
    setData([...nodes]);
  };


  return (
      <Box sx={{minHeight: 200, flexGrow: 1, maxWidth: 400}}>
        {/*<RichTreeView items={data} getItemLabel={item => item.title || "未命名"}/>*/}
        <DraggableTreeView treeItems={data} onDragEnd={onDragEnd} />
      </Box>
  );
}
