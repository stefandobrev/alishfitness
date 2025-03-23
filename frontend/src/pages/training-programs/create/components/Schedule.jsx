import { useState, useEffect } from 'react';
import { useWatch } from 'react-hook-form';

import { XMarkIcon } from '@heroicons/react/24/outline';

import { DropdownField } from '../../../../components/inputs';
import { getLightColors } from '../../../../common/constants';

export const Schedule = ({ activeTab, sessions, control, setValue }) => {
  const [schedule, setSchedule] = useState([]);

  const selectedSession = useWatch({
    control,
    name: 'schedule',
  });

  useEffect(() => {
    if (selectedSession !== null && selectedSession !== undefined) {
      const newSchedule = [...schedule, selectedSession];
      setSchedule(newSchedule);
      setValue('schedule', null);
    }
  }, [selectedSession, setValue]);

  const scheduleOptions =
    sessions?.map((session, index) => {
      return {
        label: `Session ${index + 1}${session.title ? ` : ${session.title}` : ''}`,
        value: session.tempId,
      };
    }) || [];

  const handleRemoveFromSchedule = (index) => {
    const newSchedule = schedule.filter((_, idx) => idx !== index);
    setSchedule(newSchedule);
  };

  return (
    <div
      className={`mt-4 w-full lg:sticky lg:top-25 lg:min-h-[calc(100vh-108px)] lg:w-[20%] lg:border-l-2 ${
        activeTab !== 'schedule' ? 'hidden lg:block' : ''
      }`}
    >
      <div className='z-40 flex items-end gap-2 px-6 lg:sticky lg:top-25'>
        <div className='top-40 w-full'>
          <DropdownField
            label='Schedule'
            id='schedule'
            options={scheduleOptions}
            placeholder='Add session to schedule'
            value={selectedSession ?? null}
            control={control}
            className='max-w-md'
          />
        </div>
      </div>

      <div className='flex flex-col gap-3 px-6 pt-4 lg:sticky lg:top-50'>
        {schedule.length === 0 ? (
          <div className='py-6 text-center text-gray-400 italic'>
            No sessions added to schedule yet
          </div>
        ) : (
          <>
            <h3 className='mb-1 text-sm font-semibold tracking-wider text-gray-500 uppercase'>
              Session Order
            </h3>
            {schedule.map((sessionId, index) => {
              const session = sessions?.find(
                (session) => session.tempId === sessionId,
              );

              if (!session) return null;

              const sessionIndex = sessions.findIndex(
                (s) => s.tempId === sessionId,
              );

              return (
                <div
                  key={`${sessionId}-${index}`}
                  className='flex h-full w-full items-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md'
                >
                  <div
                    className={`w-2 self-stretch ${getLightColors(sessionIndex)}`}
                  ></div>
                  <div className='flex w-full items-center justify-between px-3 py-3'>
                    <div className='flex items-center gap-2'>
                      <p className='font-medium'>{`Session ${sessionIndex + 1}${session.title ? `: ${session.title}` : ''}`}</p>
                    </div>
                    <button onClick={() => handleRemoveFromSchedule(index)}>
                      <XMarkIcon className='hover:text-logored h-5 w-5 cursor-pointer text-gray-400 transition-colors duration-200' />
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
