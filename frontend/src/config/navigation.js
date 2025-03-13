import { UserCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export const getNavigation = (isAuthenticated, isAdmin) => {
  const navigation = [{ name: 'Home', href: '/' }];
  if (isAuthenticated) {
    navigation.push({ name: 'Exercises', href: '/exercises' });
    if (isAdmin) {
      navigation.push({
        name: 'Manage',
        menuItems: [
          { name: 'Exercises', href: '/manage/exercises' },
          { name: 'Users', href: '/manage/users' },
        ],
      });
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
