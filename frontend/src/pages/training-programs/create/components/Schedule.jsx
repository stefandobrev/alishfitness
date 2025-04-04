import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

import {
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

import { getLightColors } from '../../../../common/constants';
import { ActionButton, ButtonVariant } from '../../../../components/buttons';

export const Schedule = ({ activeTab, sessions }) => {
  const [schedule, setSchedule] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const { register, setValue } = useFormContext();

  useEffect(() => {
    register('scheduleArray');
    setValue('scheduleArray', schedule);
  }, [register]);

  useEffect(() => {
    setValue('scheduleArray', schedule);
  }, [schedule, setValue]);

  const handleSessionSelect = (selected) => {
    if (selected) {
      const newSchedule = [...schedule, selected.value];
      setSchedule(newSchedule);
      setSelectedSession(null); // Reset dropdown after selection
    }
  };

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

  const moveSessionUp = (index) => {
    if (index === 0) return;
    const newSchedule = [...schedule];
    const temp = newSchedule[index];
    newSchedule[index] = newSchedule[index - 1];
    newSchedule[index - 1] = temp;
    setSchedule(newSchedule);
  };

  const moveSessionDown = (index) => {
    if (index === schedule.length - 1) return;
    const newSchedule = [...schedule];
    const temp = newSchedule[index];
    newSchedule[index] = newSchedule[index + 1];
    newSchedule[index + 1] = temp;
    setSchedule(newSchedule);
  };

  return (
    <div
      className={`mt-4 w-full lg:sticky lg:top-25 lg:min-h-[calc(100vh-108px)] lg:w-[30%] lg:border-l-2 xl:w-[20%] ${
        activeTab !== 'schedule' ? 'hidden lg:block' : ''
      }`}
    >
      <div className='z-40 flex items-end gap-2 px-6 lg:sticky lg:top-25'>
        <div className='top-40 w-full'>
          <div className='mb-4'>
            <label className='text-m mb-2 block font-semibold text-gray-700'>
              Schedule
            </label>
            <Select
              options={scheduleOptions}
              placeholder='Add session to schedule'
              isClearable
              value={selectedSession}
              onChange={handleSessionSelect}
              menuPortalTarget={document.body}
              classNamePrefix='react-select'
              className='w-full max-w-md font-semibold'
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-3 px-6 pt-4 lg:sticky lg:top-50'>
        {schedule.length === 0 ? (
          <div className='py-6 text-center text-gray-400 italic'>
            No sessions added to schedule yet
          </div>
        ) : (
          <>
            <h3 className='text-m text-m mb-1 font-semibold text-gray-700'>
              Schedule order
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
                      <div className='flex size-6 items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-sm font-semibold text-gray-700 shadow-sm'>
                        {index + 1}
                      </div>
                      <p className='line-clamp-2 max-w-20 font-medium break-words'>{`${session.title ? `${session.title}` : `Session ${sessionIndex + 1}`}`}</p>{' '}
                    </div>

                    <div className='flex items-center'>
                      {/* Reordering buttons group */}
                      <div className='mr-3 flex items-center gap-2 border-r pr-3'>
                        <ActionButton
                          variant={ButtonVariant.BLANK}
                          onClick={() => moveSessionUp(index)}
                          disabled={index === 0}
                          className={index === 0 ? 'hidden' : ''}
                        >
                          <ArrowUpIcon className='h-4 w-4 cursor-pointer text-gray-400 transition-colors duration-200 hover:text-gray-600' />
                        </ActionButton>
                        <ActionButton
                          variant={ButtonVariant.BLANK}
                          onClick={() => moveSessionDown(index)}
                          disabled={index === schedule.length - 1}
                          className={
                            index === schedule.length - 1 ? 'hidden' : ''
                          }
                        >
                          <ArrowDownIcon className='h-4 w-4 cursor-pointer text-gray-400 transition-colors duration-200 hover:text-gray-600' />
                        </ActionButton>
                      </div>

                      {/* Delete button */}
                      <ActionButton
                        variant={ButtonVariant.BLANK}
                        onClick={() => handleRemoveFromSchedule(index)}
                      >
                        <XMarkIcon className='hover:text-logored h-5 w-5 cursor-pointer text-gray-400 transition-colors duration-200' />
                      </ActionButton>
                    </div>
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
