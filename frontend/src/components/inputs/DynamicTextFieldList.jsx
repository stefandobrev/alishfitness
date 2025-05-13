import { useFormContext, Controller, useFieldArray } from 'react-hook-form';

import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { ActionButton, ButtonVariant } from '../buttons';

export const DynamicTextFieldList = ({
  labelPrefix = 'Item',
  textAreaRefs,
  autoResize,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: labelPrefix.toLowerCase(),
  });

  const singularize = (word) => {
    if (word.toLowerCase().endsWith('s')) {
      return word.slice(0, -1);
    }
    return word;
  };

  return (
    <div className='space-y-3'>
      {fields.map((fieldValue, index) => (
        <div key={fieldValue.id} className='block'>
          <label className='text-lg font-semibold text-gray-700'>{`${singularize(
            labelPrefix,
          )} ${index + 1}`}</label>
          <div className='mt-1 flex items-center space-x-1'>
            <Controller
              name={`${labelPrefix.toLowerCase()}[${index}].description`}
              control={control}
              defaultValue={fieldValue.description || ''}
              render={({ field }) => (
                <textarea
                  {...field}
                  ref={(el) => {
                    textAreaRefs.current[index] = el;
                    if (el) autoResize({ target: el }); // Trigger auto-resize immediately
                  }}
                  onInput={autoResize}
                  placeholder={`Enter ${singularize(labelPrefix).toLowerCase()}`}
                  className='focus:border-logored focus:ring-logored w-full resize-none overflow-hidden rounded-sm border border-gray-300 p-2 focus:ring-2 focus:outline-hidden'
                  rows={1}
                />
              )}
            />
            <button onClick={() => remove(index)}>
              <XMarkIcon className='hover:text-logored h-5 w-5 cursor-pointer text-gray-400 transition-colors duration-200' />
            </button>
          </div>
          {errors?.[labelPrefix.toLowerCase()]?.[index]?.description && (
            <p className='mt-1 text-sm text-red-500'>
              {errors[labelPrefix.toLowerCase()][index].description.message}
            </p>
          )}
        </div>
      ))}
      <ActionButton
        onClick={() => append({ description: '' })}
        variant={ButtonVariant.WHITE}
        className='flex w-full flex-row items-center gap-1 md:w-auto'
      >
        <PlusIcon className='h-4 w-4' />
        Add {singularize(labelPrefix).toLowerCase()}
      </ActionButton>
    </div>
  );
};
