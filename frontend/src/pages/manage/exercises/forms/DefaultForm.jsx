import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  InputField,
  DropdownField,
  DropdownFieldWithTags,
  DynamicTextFieldList,
} from '../../../../components/inputs';
import {
  MdScreenButtons,
  SmScreenButtons,
} from '../components/DefaultFormButtons';
import { isMobile } from '../../../../common/constants';

export const DefaultForm = ({
  submittedExerciseData,
  muscleGroups,
  message,
  mode = 'add',
  title,
  exerciseData,
  hasChanges,
  handleDeleteButton,
  handleViewButton,
}) => {
  const { handleSubmit, register, watch, setValue } = useFormContext();
  const textAreaRefs = useRef([]);
  const exerciseDataRef = useRef(exerciseData);

  const primaryGroupValue = watch('primary_group');

  useEffect(() => {
    if (exerciseDataRef.current?.primary_group !== primaryGroupValue) {
      setValue('secondary_groups', []);
    }
  }, [primaryGroupValue, setValue]);

  const filteredMuscleGroups = muscleGroups.filter(
    (group) => group.value !== primaryGroupValue,
  );

  useEffect(() => {
    if (exerciseData) {
      setValue('id', exerciseData.id);
      setValue('title', exerciseData.title);
      setValue('primary_group', exerciseData.primary_group);
      setValue('secondary_groups', exerciseData.secondary_groups);
      setValue('steps', exerciseData.steps);
      setValue('gif_link_front', exerciseData.gif_link_front);
      setValue('gif_link_side', exerciseData.gif_link_side);
      setValue('video_link', exerciseData.video_link);
      setValue('mistakes', exerciseData.mistakes);

      exerciseDataRef.current = exerciseData;
    }
  }, [exerciseData, setValue]);

  /* Cosmetic changes */
  const autoResize = (event) => {
    event.target.style.height = 'auto';
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  useEffect(() => {
    if (exerciseData) {
      textAreaRefs.current.forEach((textarea) => {
        if (textarea) {
          autoResize({ target: textarea });
        }
      });
    }
  }, [exerciseData]);

  const gifFront = watch('gif_link_front');
  const gifSide = watch('gif_link_side');

  const areUrlsInvalid = gifFront && gifSide && gifFront === gifSide;

  return (
    <div className='flex w-full max-w-sm flex-col md:max-w-md lg:max-w-lg'>
      {title}

      <form
        id='exercise-form'
        onSubmit={handleSubmit(submittedExerciseData)}
        className='flex flex-col space-y-3 overflow-y-auto px-2 lg:max-h-[67vh]'
      >
        <InputField
          label='Title'
          id='title'
          registration={register('title')}
          placeholder='Exercise title'
        />
        <DropdownField
          label='Primary Group'
          id='primary_group'
          options={muscleGroups}
          placeholder='Select primary group'
        />
        <DropdownFieldWithTags
          label='Secondary Groups'
          id='secondary_groups'
          options={filteredMuscleGroups}
          key={primaryGroupValue}
          placeholder='Select secondary groups'
        />
        <DynamicTextFieldList
          labelPrefix='Steps'
          textAreaRefs={textAreaRefs}
          autoResize={autoResize}
        />
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <InputField
            label='Gif Front'
            id='gif_link_front'
            type='url'
            required
            placeholder='Enter front gif'
          />
          <InputField
            label='Gif Side'
            id='gif_link_side'
            type='url'
            required
            placeholder='Enter side gif'
          />
          <InputField
            label='Video'
            id='video_link'
            type='url'
            required={false}
            placeholder='Enter video'
          />
        </div>
        <DynamicTextFieldList
          labelPrefix='Mistakes'
          textAreaRefs={textAreaRefs}
          autoResize={autoResize}
        />
        {areUrlsInvalid && (
          <p className='text-red-500'>Gif links shouldn't be the same</p>
        )}
        {message && <p className='text-red-500'>{message.text}</p>}
      </form>

      {isMobile ? (
        <SmScreenButtons
          mode={mode}
          hasChanges={hasChanges}
          areUrlsInvalid={areUrlsInvalid}
          handleDeleteButton={handleDeleteButton}
          handleViewButton={handleViewButton}
        />
      ) : (
        <MdScreenButtons
          mode={mode}
          hasChanges={hasChanges}
          areUrlsInvalid={areUrlsInvalid}
          handleDeleteButton={handleDeleteButton}
          handleViewButton={handleViewButton}
        />
      )}
    </div>
  );
};
