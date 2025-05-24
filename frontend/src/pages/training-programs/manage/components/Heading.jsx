import { useEffect, useState } from 'react';
import Select from 'react-select';
import { InputField } from '@/components/inputs';
import { fetchTemplates } from '../helpersManageProgram';
import { snakeToCamel } from '@/utils';

export const Heading = ({
  programUsageMode,
  setProgramUsageMode,
  setSelectedTemplateId,
  selectedTemplateId,
  programMode,
}) => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const loadTemplates = async () => {
      const data = await fetchTemplates();
      const transformedData = snakeToCamel(data);
      const options = transformedData.map((template) => {
        return {
          label: template.programTitle,
          value: template.id,
        };
      });
      setTemplates(options);
    };
    loadTemplates();
  }, []);

  const toggleProgramUsageMode = () => {
    setProgramUsageMode((prev) =>
      prev === 'assigned' ? 'template' : 'assigned',
    );
  };

  // Page mode is for create/edit, programUsageMode is for new/template program on create.
  const typeLabel =
    programMode === 'create'
      ? programUsageMode === 'assigned'
        ? 'Training Program'
        : 'Template'
      : programUsageMode === 'assigned'
        ? 'Training Program'
        : 'Template';

  // Find the selected template option for the Select component.
  const selectedTemplateOption =
    templates.find((template) => template.value === selectedTemplateId) || null;

  return (
    <>
      <h1 className='p-4 text-2xl font-bold md:text-3xl'>
        {programMode === 'create' ? 'Create ' : 'Edit '}
        {typeLabel}
      </h1>
      <div className='m-4 flex flex-col justify-between md:flex-row'>
        <div className='flex flex-col gap-2 md:flex-row md:items-end'>
          <div className='flex flex-col gap-2 lg:flex-row'>
            <InputField
              label='Name'
              id='programTitle'
              className='h-9.5 md:w-75'
            />
          </div>
          <div className='flex flex-col gap-2 md:items-end lg:flex-row'>
            <Select
              options={templates}
              placeholder='Select template'
              isClearable
              className='w-full md:w-75'
              classNamePrefix='react-select'
              menuPlacement='auto'
              menuPosition='fixed'
              onChange={(selected) => {
                setSelectedTemplateId(selected ? selected.value : null);
              }}
              value={selectedTemplateOption}
            />
          </div>
        </div>
        {programMode === 'create' && (
          <div className='mt-4 inline-flex cursor-pointer items-center md:mt-0'>
            <div className='ml-2 flex items-center'>
              <label className='inline-flex cursor-pointer items-center gap-2'>
                <span className='text-m font-bold'>Template mode</span>
                <input
                  type='checkbox'
                  className='peer sr-only'
                  checked={programUsageMode === 'template'}
                  onChange={toggleProgramUsageMode}
                />
                <div className="peer peer-checked:bg-logored relative h-6 w-11 rounded-full bg-gray-400 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-gray-300 rtl:peer-checked:after:-translate-x-full"></div>
              </label>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
