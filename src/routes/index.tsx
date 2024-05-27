import { lazy } from 'react';
import { Navigate, RouteObject, RouterProvider, createBrowserRouter, createHashRouter } from 'react-router-dom';
import { AppRouteObject } from '@/types/router';
import { SimpleLayout } from '@/layouts';
import AuthGuard from './components/auth-guard';
import { usePermissionRoutes } from './hooks/use-permission-routes';
import { ErrorRoutes } from '@/routes/components/error-routes';
const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

const LoginRoute: AppRouteObject = {
  path: '/login',
  Component: lazy(() => import('@/pages/sys/login/Login')),
};
const PAGE_NOT_FOUND_ROUTE: AppRouteObject = {
  path: '*',
  element: <Navigate to="/404" replace />,
};

export default function Router() {
  const permissionRoutes = usePermissionRoutes();
  const asyncRoutes: AppRouteObject = {
    path: '/',
    element: (
      <AuthGuard>
        <SimpleLayout />
      </AuthGuard>
    ),
    children: [{ index: true, element: <Navigate to={HOMEPAGE} replace /> }, ...permissionRoutes],
  };

  const routes = [LoginRoute, asyncRoutes, ErrorRoutes, PAGE_NOT_FOUND_ROUTE];

  // const router = createHashRouter(routes as unknown as RouteObject[]);
  const router = createBrowserRouter(routes as RouteObject[]);

  return <RouterProvider router={router} />;
}
