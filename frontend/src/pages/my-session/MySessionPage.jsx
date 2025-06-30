import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { fetchSessionData, saveSessionData } from './helpersMySession';
import { getChangedFields, snakeToCamel } from '@/utils';
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
import { flattenSetLogsArray, flattenSetLogs } from './utils';

export const MySessionPage = () => {
  const { id: sessionId } = useParams();
  const [sessionLogData, setSessionLogData] = useState(null);
  const [initialSetLogs, setInitialSetLogs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const { handleSubmit, reset, watch } = methods;

  // Watch form changes to determine if save button should be disabled
  const watchedSetLogs = watch('setLogs');

  // Check if there are changes to save
  const hasChanges = () => {
    if (!watchedSetLogs || Object.keys(initialSetLogs).length === 0)
      return false;
    const transformedSetLogs = flattenSetLogs(watchedSetLogs);
    const changedData = getChangedFields(initialSetLogs, transformedSetLogs);
    return Object.keys(changedData).length > 0;
  };

  // Load session log data
  useEffect(() => {
    const loadSessionData = async () => {
      if (!sessionId) return;

      setIsLoading(true);
      try {
        const data = await fetchSessionData(sessionId);
        const transformedData = snakeToCamel(data);

        setInitialSetLogs(flattenSetLogsArray(transformedData.setLogs));
        setSessionLogData(transformedData);
      } catch (error) {
        console.error('Error loading session data:', error);
        navigate('/404', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };
    loadSessionData();
  }, [sessionId, navigate]);

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

    // Use reset with the correct structure
    reset(transformedData, {
      keepDefaultValues: false,
      keepValues: false,
      keepDirty: false,
      keepTouched: false,
    });
  }, [sessionLogData, reset]);

  // Save input changes
  const handleSave = async (data) => {
    const transformedSetLogs = flattenSetLogs(data.setLogs);
    const changedData = getChangedFields(initialSetLogs, transformedSetLogs);

    setIsSaving(true);
    try {
      await saveSessionData(changedData, sessionLogData.id);

      // Update initial state after successful save
      setInitialSetLogs(transformedSetLogs);

      toast.success('Session saved!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Save unsuccessful.');
    } finally {
      setIsSaving(false);
    }
  };

  // Complete button just changes status of session log
  const handleComplete = async () => {
    // Add implementation for completing session
    try {
      // You'll need to implement this function or add it to saveSessionData
      // await completeSession(sessionLogData.id);
      toast.success('Session completed!');
    } catch (error) {
      console.error('Complete session error:', error);
      toast.error('Failed to complete session.');
    }
  };

  // Initial loading spinner - Fixed condition
  if (isLoading || !sessionLogData) {
    return <Spinner loading={isLoading} className='min-h-[80vh]' />;
  }

  // Show error state if no session data
  if (!sessionLogData?.session) {
    return (
      <div className='flex min-h-[80vh] items-center justify-center'>
        <p className='text-lg text-gray-600'>No session data found.</p>
      </div>
    );
  }

  return (
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
              disabled={isSaving || !hasChanges()}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </SubmitButton>
            {sessionLogData?.status !== 'completed' && (
              <ActionButton onClick={handleComplete} className='mx-2 md:w-auto'>
                Complete Session
              </ActionButton>
            )}
          </div>
        </form>
      </FormProvider>
    </>
  );
};
