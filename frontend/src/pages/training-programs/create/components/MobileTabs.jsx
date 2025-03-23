import TabButton from '../../../../components/buttons/TabButton';

export const MobileTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className='sticky top-20 z-40 flex h-16 justify-around border-t border-gray-800 bg-gray-600 p-2 lg:hidden'>
      <TabButton
        label='Sessions'
        isActive={activeTab === 'sessions'}
        onClick={() => onTabChange('sessions')}
      />
      <TabButton
        label='Schedule'
        isActive={activeTab === 'schedule'}
        onClick={() => onTabChange('schedule')}
      />
    </div>
  );
};
