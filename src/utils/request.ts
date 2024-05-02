import axios from 'axios';

console.log("import.meta.env.VITE_API_URL", import.meta.env.VITE_API_URL);
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_API_URL,
  // 超时
  timeout: 10000
})

export const post = (url, data) => {
  return service({
    url,
    method: "post",
    data,
  })
}
export const get = (url, data) => {
  return service({
    url,
    method: "get",
    data,
  })
}

export default service
