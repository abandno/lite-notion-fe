


## mockjs 使用

!! url+path 严格对上. 前端url localhost:3000, 默认情况下, Mock.mock("/a/b), 使用是前端地址.
但是后端接口用的 localhost:8080
所以:
```
Mock.mock(baseUrl + '/document/add' ...
```

## 树形菜单选型

[最好用的 6 个 React Tree select 树形组件测评与推荐 - 掘金](https://juejin.cn/post/7106028870742048804)

react-sortable-tree 停止维护了, 最近更新五六年前的.  
[react-sortable-tree alternatives · frontend-collective/react-sortable-tree · Discussion #942](https://github.com/frontend-collective/react-sortable-tree/discussions/942)
fork 版
[nosferatu500/react-sortable-tree: Drag-and-drop sortable component for nested data and hierarchies](https://github.com/nosferatu500/react-sortable-tree)

[Tree View - Getting started - MUI X](https://mui.com/x/react-tree-view/getting-started/)
正在维护.

react-dnd-treeview 拖拽.


## js\jsx\ts\tsx 都支持jsx语法怎么做?

[解决Vite-React项目中.js使用jsx语法报错的问题 - 掘金](https://juejin.cn/post/7018128782225571853)
