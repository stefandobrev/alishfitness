import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

import { getNavItemStyles } from '../../utils/classNames';

const DropdownMenu = ({ item, currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActive = item.menuItems.some((menu) => currentPath === menu.href);

  return (
    <div className='relative' ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={getNavItemStyles(isActive || isOpen)}
      >
        {item.name}
      </button>

      {isOpen && (
        <div className='absolute left-0 z-10 mt-2 w-48 rounded-lg bg-gray-800 shadow-lg ring-1 ring-gray-700'>
          {item.menuItems.map((menuItem, index) => (
            <NavLink
              key={menuItem.name}
              to={menuItem.href}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 text-sm transition duration-150 hover:bg-gray-600 ${
                  isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:text-white'
                } ${index === 0 ? 'rounded-t-lg' : ''} ${index === item.menuItems.length - 1 ? 'rounded-b-lg' : ''}`
              }
            >
              {menuItem.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
