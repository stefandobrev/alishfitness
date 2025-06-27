import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';

import { fetchSessionData } from './helpersMySession';
import { snakeToCamel } from '@/utils';
import { Spinner } from '@/components/common';
import { useTitle } from '@/hooks';
import { useIsMobile } from '@/common/constants';
import { SessionTableDesktop } from './components/desktop';
import { SessionTableMobile } from './components/mobile';
import {
  ActionButton,
  ButtonVariant,
  SubmitButton,
} from '@/components/buttons';
import { manageSession } from '@/schemas';

export const MySessionPage = () => {
  const { id: sessionId } = useParams();
  const [sessionLogData, setSessionLogData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const isMobile = useIsMobile();
  useTitle('Daily Workout');

  const session = sessionLogData?.session || {};
  const exercises = session.exercises || [];

  const methods = useForm({
    resolver: zodResolver(manageSession),
    defaultValues: {
      setLogs: {},
    },
  });

  const {
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = methods;

  console.log({ errors, values: getValues() });

  // Load session log data
  useEffect(() => {
    const loadSessionData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSessionData(sessionId);
        const transformedData = snakeToCamel(data);
        setSessionLogData(transformedData);
      } catch (error) {
        navigate('/404', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };
    loadSessionData();
  }, [sessionId, navigate]);

  console.log({ sessionLogData });

  // Set the values on sessionLogData change
  useEffect(() => {
    if (!sessionLogData?.setLogs) return;

    const transformedData = {
      setLogs: sessionLogData.setLogs.reduce(
        (acc, { id, reps, weight, sequence, setNumber }) => {
          if (!acc[sequence]) {
            acc[sequence] = { sets: {} };
          }
          acc[sequence].sets[setNumber] = {
            id,
            reps,
            weight,
          };
          return acc;
        },
        {},
      ),
    };

    console.log({ transformedData });

    // Use reset with the correct structure and clear any existing form state
    reset(transformedData, {
      keepDefaultValues: false,
      keepValues: false,
      keepDirty: false,
      keepTouched: false,
    });
  }, [sessionLogData, reset]);

  // Save input changes
  const handleSave = (data) => {
    console.log('Form submission data:', data);
  };

  // Complete button just changes status of session log
  const handleComplete = () => {};

  // Initial loading spinner on session log data fetch
  if (isLoading && !sessionLogData.length) {
    return <Spinner loading={isLoading} className='min-h-[80vh]' />;
  }

  return (
    <>
      {sessionLogData?.session && (
        <>
          <div className='flex justify-center'>
            <h1 className='p-4 text-2xl font-bold md:text-3xl'>
              {sessionLogData.session.sessionTitle}
            </h1>
          </div>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              {isMobile ? (
                <SessionTableMobile exercises={exercises} />
              ) : (
                <SessionTableDesktop exercises={exercises} />
              )}
              <div className='mt-6 flex flex-col justify-center gap-4 md:flex-row'>
                <SubmitButton
                  variant={ButtonVariant.GREEN}
                  className='mx-2 md:w-auto'
                >
                  Save Changes
                </SubmitButton>
                <ActionButton
                  onClick={handleComplete}
                  className={`${sessionLogData?.status !== 'completed' ? '' : 'hidden'} mx-2 md:w-auto`}
                >
                  Complete Session
                </ActionButton>
              </div>
            </form>
          </FormProvider>
        </>
      )}
    </>
  );
};
