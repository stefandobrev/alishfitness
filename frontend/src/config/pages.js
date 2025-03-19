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
      { name: 'View All', href: '/training-programs/view-all' },
      { name: 'Create', href: '/training-programs/create' },
      { name: 'Templates', href: '/training-programs/templates' },
    ],
  },
];

export const traineePages = [{ name: 'My Program', href: '/my-program' }];
