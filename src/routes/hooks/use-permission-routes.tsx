import { useMemo } from 'react';
import { About } from '@/pages/About';
import { SimpleLayout } from '@/layouts';

// 路由配置对象
const routeConfig = [
  { path: "/home", element: <SimpleLayout /> },
  { path: "/about", element: <About /> },
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
