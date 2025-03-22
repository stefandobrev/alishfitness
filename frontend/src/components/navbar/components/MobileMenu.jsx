import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

import { ChevronDownIcon } from '@heroicons/react/24/outline';

import { getNavMobileItemStyles } from '../../../utils/classNames';

export const MobileMenu = ({
  navigation,
  location,
  setIsOpen,
  hamburgerButtonRef,
}) => {
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState(null);
  const menuRef = useRef(null);

  const toggleMobileSubMenu = (name) => {
    setOpenMobileSubMenu(openMobileSubMenu === name ? null : name);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamburgerButtonRef.current &&
        !hamburgerButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setIsOpen, hamburgerButtonRef]);

  return (
    <div className='space-y-2 bg-gray-800 px-3 pt-2 pb-4' ref={menuRef}>
      {navigation.map((item) =>
        item.menuItems ? (
          <div key={item.name}>
            <button
              onClick={() => toggleMobileSubMenu(item.name)}
              className={getNavMobileItemStyles(
                item.menuItems.some(
                  (subItem) => location.pathname === subItem.href,
                ),
              )}
            >
              <span>{item.name}</span>
              <ChevronDownIcon
                className={`ml-auto h-5 w-5 transition-transform ${
                  openMobileSubMenu === item.name ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openMobileSubMenu === item.name && (
              <div className='mt-2 space-y-2 pl-4'>
                {item.menuItems.map((subItem) => (
                  <NavLink
                    key={subItem.name}
                    to={subItem.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      getNavMobileItemStyles(isActive) + ' px-4 py-3 text-sm'
                    }
                  >
                    {subItem.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ) : (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              getNavMobileItemStyles(isActive) + ' text-base font-medium'
            }
          >
            {item.name}
          </NavLink>
        ),
      )}
    </div>
  );
};
