import {create} from "zustand";
import {getTreeFromFlatData} from "@/utils/tree-data-utils.ts";

// type DocTreeStore = {
//   flatItems;
//   itemMap;
//   actions: {
//     setFlatItems: (flatItems) => void;
//   }
// }

// type MySpaceTreeStore = {
//   treeItems;
//   // 使用 actions 命名空间来存放所有的 action
//   actions: {
//     setTreeItems: (treeItems) => void;
//     moveNode: (moveInfo) => void;
//   };
// };

export const useDocTreeStore = create<any>((set) => ({
  // flatItems: [],
  // treeItems: [],
  // itemMap: {},
  mySpaceTreeItems: [],
  kbTreeItems: [],
  actions: {
    setItems: (flatItems) => {
      // set({flatItems})
      // const itemMap = {};
      // for (const item of flatItems) {
      //   itemMap[item.id] = item
      // }
      // set({itemMap})
      // flat -> tree
      const treeItems = getTreeFromFlatData({
        flatData: flatItems,
        getKey: n => n.id,
        getParentKey: n => n.pid,
      })
      // 拆分
      const mySpaceTreeItems = treeItems.filter(e => e.id == 8001)[0]?.children;
      const kbTreeItems = treeItems.filter(e => e.id != 8001);
      // console.log("拆分后:", mySpace, knowledgeBases);
      set({mySpaceTreeItems, kbTreeItems})
    },
    setMySpaceTreeItems(mySpaceTreeItems) {
      set({mySpaceTreeItems: [...mySpaceTreeItems]})
    },
    setKbTreeItems(kbTreeItems) {
      set({kbTreeItems: [...kbTreeItems]})
    },
    updateNode({id, ...rest}) {
      set(state => {
        state.mySpaceTreeItems.find(e => e.id == id);
      })
    },
    // render: () => set(state => ({flatItems: [...state.flatItems], treeItems: [...state.treeItems]}))
  }
}))

export const useMySpaceTreeStore = create<any>((set) => ({
  treeData: [],
  actions: {
    setTreeData: (treeData = []) => {
      // console.log("useMySpaceTreeStore setTreeItems")
      set({treeData: [...treeData]})
    },
    moveNode: ({oldPid, newPid, nodeId, treeData}) => {
      const {itemMap} = useDocTreeStore();
      const moveNode = itemMap[nodeId]
      const newParent = itemMap[newPid]

      const trav = (node, path = []) => {
        const nodeId = node.id
        path.push(nodeId)
        node.path = [...path]
        if (node.children) {
          node.children.forEach(child => trav(child, [...path]))
        }
        return node;
      }

      // 递归修改 path 的前部分为新 parent 的
      trav(moveNode, [...newParent.path])
      // set(state => ({treeData: [...state.treeItems]}))
      set({treeData: [...treeData]})
    },
  },
}));


export const useTreeData = (space) => {
  if (space == "mySpace" || space == '8001') {
    return {
      treeData: useMySpaceTreeStore((state) => state.treeData),
      setTreeData: useMySpaceTreeStore((state) => state.actions.setTreeData),
    }
  }
}

export const useCurrentDocNode = create<any>((set) => ({
  currentDocNode: null,
  setCurrentDocNode: (n) => set((state) => ({currentDocNode: n})),
}))
