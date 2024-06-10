import { useMemo } from 'react';
import { About } from '@/pages/About';
import {Doc} from "@/pages/doc/Doc"
import {Editor} from "@components/editor";


// 路由配置对象
const routeConfig = [
  { path: "about", element: <About /> },
  {
    path: "doc",
    element: <Doc />,
    children: [
      {
        path: 'edit',
        element: <Editor />,
      },
    ]
  },
];

/**
 * return routes about permission
 */
export function usePermissionRoutes() {
  // 切换回静态路由
  return useMemo(() => {
    return routeConfig;
  }, []);
}
