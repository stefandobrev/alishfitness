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
    name: 'Training Programs',
    menuItems: [
      { name: 'View All', href: '/training-program/view-all' },
      { name: 'Create', href: '/training-program/create' },
      { name: 'Templates', href: '/training-program/templates' },
    ],
  },
];

export const traineePages = [{ name: 'My Program', href: '/my-program' }];
