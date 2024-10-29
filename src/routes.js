import { useEffect } from 'react';

import { Navigate, useNavigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import PostPage from './pages/PostPage';
import DashboardAppPage from './pages/DashboardAppPage';
import ContentPage from './pages/ContentPage';
import NotificationPage from './pages/NotificationPage';
import Meal from './pages/Meal';
import Exercise from './pages/Exercise';
import RequestPage from './pages/RequestPage';
import Diet from './pages/Diet';
import Nutrition from './pages/Nutrition';
import Routine from './pages/Routine';
import Orders from './pages/OrdersPage';
import UploadStatement from './pages/UploadStatement';
import Payout from './pages/Payout';
import Allpayout from './pages/Allpayout';

export default function Router() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      console.log('1');
    } else {
      console.log('2');
    }
  }, []);
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'user/:id', element: <UploadStatement /> },
        { path: 'payout/:id', element: <Payout /> },
        { path: 'all-payouts', element: <Allpayout /> },
        // { path: 'product', element: <PostPage /> },
        // { path: 'content', element: <ContentPage /> },
        // { path: 'subscription', element: <PostPage /> },
        // { path: 'notification', element: <NotificationPage /> },
        // { path: 'request', element: <RequestPage /> },
        // { path: 'meal', element: <Meal /> },
        // { path: 'exercise', element: <Exercise /> },
        // { path: 'diet', element: <Diet /> },
        // { path: 'orders', element: <Orders /> },
        // { path: 'nutrition', element: <Nutrition /> },
        // { path: 'routine', element: <Routine /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
