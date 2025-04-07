import { NavLink } from 'react-router-dom';

import { DropdownMenu } from './';
import { getNavItemStyles } from '@/utils';

export const NavigationItems = ({ navigation, currentPath, isTransparent }) => {
  const isCurrent = (href) => (href === currentPath ? 'page' : undefined);

  return (
    <div className='flex space-x-6'>
      {navigation.map((item) =>
        item.menuItems ? (
          <DropdownMenu
            key={item.name}
            item={item}
            currentPath={currentPath}
            className={isTransparent ? 'text-white hover:text-gray-200' : ''}
          />
        ) : (
          <NavLink
            key={item.name}
            to={item.href}
            aria-current={isCurrent(item.href)}
            className={({ isActive }) =>
              getNavItemStyles(isActive, isTransparent)
            }
          >
            {item.name}
          </NavLink>
        ),
      )}
    </div>
  );
};
