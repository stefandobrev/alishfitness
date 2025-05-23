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

  return (
    <>
      <h1 className='p-4 text-2xl font-bold md:text-3xl'>
        {programMode === 'create' ? 'Create ' : 'Edit '}
        {typeLabel}
      </h1>

      <div className='flex flex-col justify-between md:flex-row md:pl-4'>
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
                setSelectedTemplateId(selected.value);
              }}
            />
          </div>
        </div>

        {programMode === 'create' && (
          <div className='mt-4 inline-flex cursor-pointer items-center md:mt-0'>
            <div className='ml-2 flex items-center gap-2'>
              <span className='text-m font-semibold text-gray-700 dark:text-gray-200'>
                Template Mode
              </span>
              <input
                type='checkbox'
                value=''
                className='peer sr-only'
                onClick={toggleProgramUsageMode}
              />
              <div className="peer peer-checked:bg-logored relative h-6 w-11 rounded-full bg-gray-600 peer-focus:ring-1 peer-focus:ring-black after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
