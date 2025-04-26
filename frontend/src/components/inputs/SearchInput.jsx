export const SearchInput = ({
  value,
  onChange,
  placeholder = '--',
  className = '',
}) => (
  <input
    type='text'
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`focus:border-logored focus:ring-logored rounded-lg border border-gray-300 p-2 transition duration-170 ease-in-out focus:ring-2 focus:outline-hidden ${className}`}
  />
);
