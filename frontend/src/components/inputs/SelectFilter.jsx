import Select from 'react-select';

export const SelectFilter = ({ label, optionsData, placeholder }) => {
  return (
    <div>
      <label className='mb-2 block font-semibold text-gray-700'>{label}</label>
      <Select
        placeholder={placeholder}
        options={optionsData}
        isClearable
        classNamePrefix='react-select'
        className='max-w-md'
      />
    </div>
  );
};
