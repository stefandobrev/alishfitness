import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { EditButton } from '../buttons/EditButtons';

const DynamicTextFieldList = ({
  labelPrefix = 'Item',
  textAreaRefs,
  autoResize,
}) => {
  const { control } = useFormContext();

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
          <div className='flex items-center space-x-2'>
            <Controller
              name={`${labelPrefix.toLowerCase()}[${index}]`}
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  ref={(el) => {
                    textAreaRefs.current[index] = el;
                    if (el) autoResize({ target: el }); // Trigger auto-resize immediately
                  }}
                  onInput={autoResize}
                  placeholder={`Enter ${singularize(labelPrefix)}`}
                  className='focus:border-logored focus:ring-logored w-full resize-none overflow-hidden rounded-sm border border-gray-300 p-2 focus:ring-2 focus:outline-hidden'
                  rows={1}
                />
              )}
            />
            <button
              type='button'
              onClick={() => remove(index)}
              className='text-red-500 hover:text-red-700'
            >
              &times;
            </button>
          </div>
        </div>
      ))}
      <EditButton
        onClick={() => append('')}
        variant='white'
        className='w-full md:w-auto'
      >
        Add {singularize(labelPrefix)}
      </EditButton>
    </div>
  );
};

export default DynamicTextFieldList;
