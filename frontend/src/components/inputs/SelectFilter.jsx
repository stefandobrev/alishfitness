import Select from 'react-select';

export const SelectFilter = ({
  label,
  optionsData,
  placeholder,
  isMulti = false,
  isClearable = true,
  onChange,
  value,
}) => {
  return (
    <div>
      <label className='mb-2 block font-semibold text-gray-700'>{label}</label>
      <Select
        placeholder={placeholder}
        options={optionsData}
        isMulti={isMulti}
        isClearable={isClearable}
        onChange={onChange}
        value={value}
        classNamePrefix='react-select'
        className='max-w-md'
      />
    </div>
  );
};
