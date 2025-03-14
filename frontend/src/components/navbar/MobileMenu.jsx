import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { getNavMobileItemStyles } from '../../utils/classNames';

const MobileMenu = ({
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

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       menuRef.current &&
  //       !menuRef.current.contains(event.target) &&
  //       hamburgerButtonRef.current &&
  //       !hamburgerButtonRef.current.contains(event.target)
  //     ) {
  //       setIsOpen(false);
  //     }
  //   };
  //   document.addEventListener('click', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside);
  //   };
  // }, [setIsOpen, hamburgerButtonRef]);

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
              <svg
                className={`ml-auto h-5 w-5 transition-transform ${
                  openMobileSubMenu === item.name ? 'rotate-180' : ''
                }`}
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
                  clipRule='evenodd'
                />
              </svg>
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

export default MobileMenu;
