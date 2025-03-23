import { FormProvider, useForm } from 'react-hook-form';

import { AddSessionButton, Schedule, SessionsGrid } from './components';
import { InputField } from '../../../components/inputs';
import { useTitle } from '../../../hooks/useTitle.hook';

export const CreatePage = () => {
  const methods = useForm();
  useTitle('Create');

  const sessions = methods.watch('sessions');

  const handleRemoveSession = (index) => {
    const currentSessions = methods.getValues('sessions') || [];
    const newSessions = currentSessions.filter((_, i) => i !== index);

    methods.setValue('sessions', newSessions);
    methods.reset({ ...methods.getValues(), sessions: newSessions });
  };

  // This function will be called when the schedule changes in the Schedule component
  const handleScheduleChange = (newSchedule) => {
    // You can perform actions based on schedule changes if needed
    console.log('Schedule updated:', newSchedule);
  };

  return (
    <FormProvider {...methods}>
      <div className='flex'>
        <div className='w-full px-4 lg:w-[80%]'>
          <h1 className='p-4 text-2xl font-bold md:text-3xl'>
            Create Training Program
          </h1>

          {/* Head section */}
          <div className='mb-4 px-4'>
            <div className='w-full max-w-xs'>
              <InputField label='Name' id='programName' />
            </div>
          </div>

          {/* Sessions grid component */}
          <SessionsGrid
            sessions={sessions}
            control={methods.control}
            watch={methods.watch}
            setValue={methods.setValue}
            getValues={methods.getValues}
            onRemoveSession={handleRemoveSession}
          />

          <AddSessionButton />
        </div>

        {/* Schedule component */}
        <Schedule
          sessions={sessions}
          control={methods.control}
          setValue={methods.setValue}
          onScheduleChange={handleScheduleChange}
        />
      </div>
    </FormProvider>
  );
};
