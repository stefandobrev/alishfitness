const pillStyles = {
  default: 'bg-gray-200 border border-gray-400 text-gray-800',
  status: 'bg-blue-100 border border-blue-400 text-blue-800',
  success: 'bg-green-100 border border-green-400 text-green-800',
  warning: 'bg-yellow-100 border border-yellow-400 text-yellow-800',
  highlight: 'bg-purple-100 border border-purple-400 text-purple-800',
};

export const Pill = ({ text, variant = 'default' }) => {
  const classes = pillStyles[variant] || pillStyles.default;
  return (
    <div
      className={`${classes} flex w-fit min-w-[100px] justify-center rounded-full px-3 py-1 text-sm`}
    >
      {text}
    </div>
  );
};
