export const basePages = [{ name: 'Home', href: '/' }];

export const authenticatedPages = [{ name: 'Exercises', href: '/exercises' }];

export const adminPages = [
  {
    name: 'Manage',
    menuItems: [
      { name: 'Exercises', href: '/manage/exercises' },
      { name: 'Users', href: '/manage/users' },
    ],
  },
  {
    name: 'Training Program',
    menuItems: [
      { name: 'View All', href: '/training-program/view-all' },
      { name: 'Create', href: '/training-program/create' },
      { name: 'Templates', href: '/training-program/templates' },
    ],
  },
];

export const traineePages = [
  { name: 'Training Program', href: '/training-program' },
];
