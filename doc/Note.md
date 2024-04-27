


## mockjs 使用

!! url+path 严格对上. 前端url localhost:3000, 默认情况下, Mock.mock("/a/b), 使用是前端地址.
但是后端接口用的 localhost:8080
所以:
```
Mock.mock(baseUrl + '/document/add' ...
```

## 树形菜单选型

[最好用的 6 个 React Tree select 树形组件测评与推荐 - 掘金](https://juejin.cn/post/7106028870742048804)

react-sortable-tree 太老了, 没人维护了, 五六年前的.

[Tree View - Getting started - MUI X](https://mui.com/x/react-tree-view/getting-started/)
正在维护.

react-dnd-treeview 拖拽.
