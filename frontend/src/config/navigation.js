import { UserCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import {
  adminPages,
  authenticatedPages,
  basePages,
  traineePages,
} from './pages';

export const getNavigation = (isAuthenticated, isAdmin) => {
  let navigation = [...basePages];
  if (isAuthenticated) {
    navigation = [...navigation, ...authenticatedPages];

    if (isAdmin) {
      navigation = [...navigation, ...adminPages];
    } else {
      navigation = [...navigation, ...traineePages];
    }
  } else {
    navigation.push({ name: 'Member Portal', href: '/login' });
  }
  return navigation;
};

export const profileMenuItems = [
  {
    name: 'Your Profile',
    href: '/profile',
    icon: UserCircleIcon,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Cog6ToothIcon,
  },
];
