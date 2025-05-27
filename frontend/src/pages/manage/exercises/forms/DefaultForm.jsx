import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  InputField,
  DropdownField,
  DropdownFieldWithTags,
  DynamicTextFieldList,
} from '@/components/inputs';
import {
  MdScreenButtons,
  SmScreenButtons,
} from '../components/DefaultFormButtons';
import { isMobile } from '@/common/constants';

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
  const { handleSubmit, register, reset, watch, setValue } = useFormContext();
  const textAreaRefs = useRef([]);
  const exerciseDataRef = useRef(exerciseData);

  // Reset secondary groups if primary group is changed.
  const primaryGroupValue = watch('primaryGroup');

  useEffect(() => {
    if (exerciseDataRef.current?.primaryGroup !== primaryGroupValue) {
      setValue('secondaryGroups', []);
    }
  }, [primaryGroupValue, setValue]);

  // Exclude once selected group from further selection.
  const filteredMuscleGroups = muscleGroups.filter(
    (group) => group.value !== primaryGroupValue,
  );

  // Pre-fill fetched data from backend.
  useEffect(() => {
    if (exerciseData) {
      const formatted = {
        title: exerciseData.title,
        primaryGroup: exerciseData.primaryGroup,
        secondaryGroups: exerciseData.secondaryGroups,
        gifLinkFront: exerciseData.gifLinkFront,
        gifLinkSide: exerciseData.gifLinkSide,
        videoLink: exerciseData.videoLink,
        steps: exerciseData.steps.map((step) => ({
          description: step.description || step,
        })),
        mistakes: exerciseData.mistakes.map((mistake) => ({
          description: mistake.description || mistake,
        })),
      };
      reset(formatted);
    }
  }, [exerciseData, reset]);

  // Cosmetic changes
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

  // Live URL checker to prevent match between gifs - they need to be different.
  const gifFront = watch('gifLinkFront');
  const gifSide = watch('gifLinkSide');

  const areUrlsInvalid = gifFront && gifSide && gifFront === gifSide;

  return (
    <div className='flex w-full max-w-sm flex-col md:max-w-md lg:max-w-lg'>
      {title}

      <form
        id='exerciseForm'
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
          label='Primary group'
          id='primaryGroup'
          options={muscleGroups}
          placeholder='Select primary group'
        />
        <DropdownFieldWithTags
          label='Secondary groups'
          id='secondaryGroups'
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
            label='Gif front'
            id='gifLinkFront'
            type='url'
            required
            placeholder='Enter front gif'
          />
          <InputField
            label='Gif side'
            id='gifLinkSide'
            type='url'
            required
            placeholder='Enter side gif'
          />
          <InputField
            label='Video'
            id='videoLink'
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
