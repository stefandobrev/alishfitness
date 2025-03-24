const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex h-full w-24 cursor-pointer flex-col items-center justify-center rounded-md transition hover:bg-gray-800 active:bg-gray-800 ${
      isActive ? 'bg-gray-800 text-white' : 'text-gray-300 active:text-white'
    }`}
  >
    <span>{label}</span>
  </button>
);

export const MobileTabs = ({ activeTab, onTabChange, tabs }) => {
  return (
    <>
      {tabs.map((tab) => (
        <TabButton
          key={tab.value}
          label={tab.label}
          isActive={activeTab === tab.value}
          onClick={() => onTabChange(tab.value)}
        />
      ))}
    </>
  );
};
