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
];

export const traineePages = [
  { name: 'Training Program', href: '/training-program' },
];
