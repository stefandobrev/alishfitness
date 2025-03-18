import { useState, useRef, useEffect } from 'react';
import {
  PlusIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export const MyProgramPage = () => {
  // Add ref for the current day's card
  const currentDayRef = useRef(null);

  // Get current day for highlighting
  const getCurrentDayName = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Helper function to check if a day is in the past
  const isDayInPast = (dayName) => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const today = new Date().getDay();
    const dayIndex = days.indexOf(dayName);
    return dayIndex < today;
  };

  // Mock data - replace with real data from your backend
  const [weeklyProgram] = useState([
    {
      day: 'Monday',
      type: 'training',
      title: 'Upper Body Strength',
      summary: 'Focus on chest, shoulders, and triceps',
      isCompleted: false,
    },
    {
      day: 'Tuesday',
      type: 'training',
      title: 'Lower Body Power',
      summary: 'Squats and deadlifts focus',
      isCompleted: true,
    },
    {
      day: 'Wednesday',
      type: 'rest',
      summary: 'Active recovery & mobility work',
    },
    {
      day: 'Thursday',
      type: 'training',
      title: 'HIIT & Core',
      summary: 'High intensity intervals with core stability',
      isCompleted: false,
    },
    {
      day: 'Friday',
      type: 'training',
      title: 'Full Body Conditioning',
      summary: 'Compound movements & cardio',
      isCompleted: false,
    },
    {
      day: 'Saturday',
      type: 'rest',
      summary: 'Complete rest day',
    },
    {
      day: 'Sunday',
      type: 'rest',
      summary: 'Light mobility & stretching',
    },
  ]);

  const handleViewSession = (day) => {
    console.log(`Viewing session for ${day}`);
    // Add navigation to detailed view
  };

  const handleCompleteWorkout = (day) => {
    console.log(`Completing workout for ${day}`);
    // Add completion logic
  };

  const handleResetWorkout = (day) => {
    console.log(`Resetting workout for ${day}`);
    // Add reset logic
  };

  const getCardStyles = (day) => {
    const isCurrentDay = day.day === getCurrentDayName();
    const isPastDay = isDayInPast(day.day);

    let baseStyles =
      'overflow-hidden rounded-lg shadow-md transition-all duration-200 ';

    if (isCurrentDay) {
      baseStyles += 'bg-white ring-2 ring-blue-500 transform scale-102 ';
    } else if (isPastDay || day.isCompleted) {
      baseStyles += 'bg-gray-50 opacity-75 ';
    } else {
      baseStyles += 'bg-white ';
    }

    return baseStyles;
  };

  const getDayHeaderStyles = (day) => {
    const isCurrentDay = day.day === getCurrentDayName();
    let baseStyles = 'mb-4 flex items-center justify-between ';

    if (isCurrentDay) {
      baseStyles += 'text-blue-600';
    }

    return baseStyles;
  };

  // Add useEffect for scrolling
  useEffect(() => {
    if (currentDayRef.current) {
      // Scroll the current day card into view with smooth behavior
      currentDayRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, []); // Run once on component mount

  return (
    <div className='bg-gray-50'>
      {/* Weekly Schedule */}
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {weeklyProgram.map((day) => (
            <div
              key={day.day}
              ref={day.day === getCurrentDayName() ? currentDayRef : null}
              className={getCardStyles(day)}
            >
              <div className='px-6 py-4'>
                <div className={getDayHeaderStyles(day)}>
                  <h3 className='text-lg font-semibold'>
                    {day.day}
                    {day.day === getCurrentDayName() && (
                      <span className='ml-2 text-sm font-normal text-blue-600'>
                        (Today)
                      </span>
                    )}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      day.type === 'training'
                        ? day.isCompleted || isDayInPast(day.day)
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {day.type === 'training'
                      ? day.isCompleted
                        ? 'Completed'
                        : 'Training Day'
                      : 'Rest Day'}
                  </span>
                </div>

                {day.type === 'training' ? (
                  <>
                    <h4 className='mb-2 font-medium text-gray-900'>
                      {day.title}
                    </h4>
                    <p className='mb-4 text-gray-600'>{day.summary}</p>

                    <div className='mb-4 flex space-x-4'>
                      <button
                        onClick={() => handleCompleteWorkout(day.day)}
                        className={`flex items-center rounded-md px-3 py-2 ${
                          day.isCompleted || isDayInPast(day.day)
                            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                        disabled={day.isCompleted || isDayInPast(day.day)}
                      >
                        <CheckCircleIcon className='mr-1 h-5 w-5' />
                        Complete
                      </button>
                      <button
                        onClick={() => handleResetWorkout(day.day)}
                        className={`flex items-center rounded-md px-3 py-2 ${
                          isDayInPast(day.day)
                            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={isDayInPast(day.day)}
                      >
                        <ArrowPathIcon className='mr-1 h-5 w-5' />
                        Reset
                      </button>
                    </div>

                    <div className='my-4 border-t border-gray-200'></div>

                    <div className='flex justify-end'>
                      <button
                        onClick={() => handleViewSession(day.day)}
                        className={`flex items-center ${
                          day.isCompleted || isDayInPast(day.day)
                            ? 'cursor-not-allowed text-gray-400'
                            : 'text-blue-600 hover:text-blue-700'
                        }`}
                        disabled={day.isCompleted || isDayInPast(day.day)}
                      >
                        <PlusIcon className='mr-1 h-5 w-5' />
                        View Session
                        <ArrowRightIcon className='ml-1 h-4 w-4' />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className='text-gray-600'>
                    <p>{day.summary}</p>
                  </div>
                )}
              </div>
              {day.type === 'training' && (
                <div
                  className={`h-1 ${
                    day.isCompleted
                      ? 'bg-green-500'
                      : isDayInPast(day.day)
                        ? 'bg-gray-300'
                        : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
