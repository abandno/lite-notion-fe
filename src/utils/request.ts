import axios from 'axios';
import {message} from 'antd'; // 假设你使用的是 antd 的 message 组件来显示提示信息

console.log("import.meta.env.VITE_API_URL", import.meta.env.VITE_API_URL);
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_API_URL,
  // 超时
  timeout: 10000
})

service.interceptors.response.use(
    response => {
      const res = response.data;
      if (res.code !== 0) {
        // 如果 code 不等于 0，说明有错误，弹窗提示 msg
        message.error(res.msg);
        return Promise.reject(new Error(res.msg || 'Error'));
      } else {
        // 如果 code 等于 0，说明成功，直接返回数据
        return res;
      }
    },
    error => {
      console.log("request onRejected", error);
      // 对响应错误做点什么
      // message.error(error.message);
      message.error(error.response.data?.msg || '服务异常, 请稍候重试')
      return Promise.reject(error);
    }
);

export const post = (url, data) => {
  return service({
    url,
    method: "post",
    data,
  })
}
export const get = (url, params) => {
  return service({
    url,
    method: "get",
    params,
  })
}
