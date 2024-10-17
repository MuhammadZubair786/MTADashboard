// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('dashboard-layout-svgrepo-com'),
  },
  {
    title: 'Users',
    path: '/dashboard/user',
    icon: icon('user-circle-svgrepo-com'),
  },
  {
    title: 'Products',
    path: '/dashboard/product',
    icon: icon('post-svgrepo-com'),
  },
  {
    title: 'content',
    path: '/dashboard/content',
    icon: icon('content-email-inbox-mail-message-icon-svgrepo-com'),
  },
  // {
  //   title: 'subscription',
  //   path: '/dashboard/subscription',
  //   icon: icon('collection-email-svgrepo-com'),
  // },
  {
    title: 'Notifications',
    path: '/dashboard/notification',
    icon: icon('notification-bell-1397-svgrepo-com'),
  },
  {
    title: 'Requests',
    path: '/dashboard/request',
    icon: icon('request-added-svgrepo-com'),
  },
  // {
  //   title: 'Exercise',
  //   path: '/dashboard/exercise',
  //   icon: icon('exercise-bike-svgrepo-com'),
  // },
  // {
  //   title: 'Meal',
  //   path: '/dashboard/meal',
  //   icon: icon('meal-svgrepo-com'),
  // },
  // {
  //   title: 'Diet',
  //   path: '/dashboard/diet',
  //   icon: icon('diet-vegan-svgrepo-com'),
  // },
  {
    title: 'Orders',
    path: '/dashboard/orders',
    icon: icon('money-send-svgrepo-com'),
  },
  // {
  //   title: 'Nutrition',
  //   path: '/dashboard/nutrition',
  //   icon: icon('nutrition-svgrepo-com'),
  // // },
  // {
  //   title: 'Routine',
  //   path: '/dashboard/Routine',
  //   icon: icon('routine'),
  // },
  {
    title: 'logout',
    path: '/login',
    icon: icon('logout-svgrepo-com'),
  },
];

export default navConfig;
