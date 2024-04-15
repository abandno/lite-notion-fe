


* mockjs 使用

!! url+path 严格对上. 前端url localhost:3000, 默认情况下, Mock.mock("/a/b), 使用是前端地址.
但是后端接口用的 localhost:8080
所以:
```
Mock.mock(baseUrl + '/document/add' ...
```
