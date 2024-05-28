import React from 'react'
import ReactDOM from 'react-dom/client'
import "./index.css";
import Home from "@/pages/Home";
// import { BrowserRouter as Router } from 'react-router-dom';
import {isTrue} from "@/utils";
import './index.css'
import Router from '@/routes';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


if (isTrue(process.env.REACT_APP_MOCK_API)) {
  console.log("=> REACT_APP_MOCK_API is " + process.env.REACT_APP_MOCK_API)
  require('@/api/mock');
}
// import "./api/mock"

// 创建一个 client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // 失败重试次数
      cacheTime: 300_000, // 缓存有效期 5m
      staleTime: 10_1000, // 数据变得 "陈旧"（stale）的时间 10s
      refetchOnWindowFocus: false, // 禁止窗口聚焦时重新获取数据
      refetchOnReconnect: false, // 禁止重新连接时重新获取数据
      refetchOnMount: false, // 禁止组件挂载时重新获取数据
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  // <Router>
  //   <Home/>
  // </Router>
  // </React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <Router />
  </QueryClientProvider>
);
