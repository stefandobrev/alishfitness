import { classNames } from '@/utils';

import { useScrollVisibility } from '@/hooks';
import { MobileTabVariant } from './constants';

export const MobileTabs = ({
  activeTab,
  onTabChange,
  tabs,
  variant = MobileTabVariant.STATIC,
}) => {
  const isHeaderVisible =
    variant === MobileTabVariant.HIDE ? useScrollVisibility() : true;

  const variants = {
    [MobileTabVariant.STATIC]:
      'sticky top-20 z-40 flex h-16 justify-around border-t border-gray-800 bg-gray-600 p-2 lg:hidden',
    [MobileTabVariant.HIDE]: `transition-transform duration-500 ease-in-out ${
      isHeaderVisible
        ? 'sticky top-20 translate-y-0 opacity-100'
        : 'relative -translate-y-full opacity-0'
    } z-40 flex h-16 justify-around border-t border-gray-800 bg-gray-600 p-2 lg:hidden`,
  };

  return (
    <div className={variants[variant]}>
      {tabs.map((tab) => (
        <TabButton
          key={tab.value}
          label={tab.label}
          isActive={activeTab === tab.value}
          onClick={() => onTabChange(tab.value)}
        />
      ))}
    </div>
  );
};

const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={classNames(
      'flex h-full w-24 cursor-pointer flex-col items-center justify-center rounded-md transition hover:bg-gray-800 active:bg-gray-800',
      isActive ? 'bg-gray-800 text-white' : 'text-gray-300 active:text-white',
    )}
  >
    <span>{label}</span>
  </button>
);
