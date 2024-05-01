import React, {useState} from 'react';
import SortableTree from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css'; // This only needs to be imported once in your app
// import FileExplorerTheme from '@nosferatu500/theme-file-explorer';
import FileExplorerTheme from '@/components/theme-file-explorer'


export default function DocMenuTree() {
  const [treeData, setTreeData] = useState([
    {title: 'Chicken', children: [{title: 'Egg'}]},
    {title: 'Fish', children: [{title: 'fingerline'}]},
  ]);

  return (
      <div style={{height: 400}}>
        <SortableTree
            treeData={treeData}
            onChange={treeData => setTreeData(treeData)}
            theme={FileExplorerTheme}
        />
      </div>
  );
}
