import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import {
  completeSession,
  fetchSessionData,
  saveSessionData,
  getExerciseTrends,
} from './helpersMySession';
import { snakeToCamel } from '@/utils';
import { Spinner } from '@/components/common';
import { useTitle } from '@/hooks';
import { useIsMobile } from '@/common/constants';
import { SessionTableDesktop } from './components/desktop';
import { SessionTableMobile } from './components/mobile';
import {
  ActionButton,
  MobileTabs,
  MobileTabVariant,
} from '@/components/buttons';
import { manageSession } from '@/schemas';
import { sanitizeInputValue, shouldSaveField } from './utils';

export const MySessionPage = () => {
  const { id: sessionId } = useParams();
  const [sessionLogData, setSessionLogData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isTrendsModalOpen, setIsTrendsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inputs');

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

  const { reset, getValues } = methods;

  // Load session log data
  useEffect(() => {
    const loadSessionData = async () => {
      if (!sessionId) return;

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
    reset(transformedData);
  }, [sessionLogData, reset]);

  // Save handleBlur changes
  const handleBlur = async ({ name, type }) => {
    const fieldValues = getValues();
    const value = name.split('.').reduce((acc, key) => acc?.[key], fieldValues);

    const [, sequence, , setNumber] = name.split('.');
    const originalEntry = sessionLogData.setLogs.find(
      (log) =>
        log.sequence === sequence && log.setNumber === parseInt(setNumber, 10),
    );

    if (originalEntry) {
      const fieldType = type === 'integer' ? 'reps' : 'weight';

      if (shouldSaveField(value, originalEntry[fieldType], type)) {
        const saveData = {
          [`${sequence}_${setNumber}`]: {
            id: originalEntry.id,
            [fieldType]: sanitizeInputValue(value, type),
          },
        };
        try {
          await saveSessionData(sessionLogData.id, saveData);

          // Update the original value in sessionLogData
          setSessionLogData((prev) => ({
            ...prev,
            setLogs: prev.setLogs.map((log) =>
              log.id === originalEntry.id
                ? { ...log, [fieldType]: sanitizeInputValue(value, type) }
                : log,
            ),
          }));
        } catch (error) {
          toast.error('Failed to save changes');
        }
      }
    }
  };

  // View trends modal
  const handleViewTrendsModal = async (exerciseId) => {
    console.log({ exerciseId });
    setIsTrendsModalOpen(true);
    try {
      const data = await getExerciseTrends(exerciseId);
    } catch (error) {
      console.log(error);
    }
  };

  // Complete button just changes status of session log and adds created_at datetime
  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await completeSession(sessionLogData.id, { status: 'completed' });
      toast.success('Session completed!');
    } catch (error) {
      toast.error('Failed to complete session.');
    } finally {
      setIsCompleting(false);
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

  // Mobile tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const tabs = [
    { label: 'Inputs', value: 'inputs' },
    { label: 'Exercise Info', value: 'info' },
  ];

  return (
    <>
      <MobileTabs
        tabs={tabs}
        variant={MobileTabVariant.HIDE}
        onTabChange={handleTabChange}
      />

      <div className='flex justify-center'>
        <h1 className='p-4 text-2xl font-bold md:text-3xl'>
          {sessionLogData.session.sessionTitle}
        </h1>
      </div>
      <FormProvider {...methods}>
        <form>
          {isMobile ? (
            <SessionTableMobile
              exercises={exercises}
              activeTab={activeTab}
              handleBlur={handleBlur}
              handleViewTrendsModal={handleViewTrendsModal}
            />
          ) : (
            <SessionTableDesktop
              exercises={exercises}
              handleBlur={handleBlur}
              handleViewTrendsModal={handleViewTrendsModal}
            />
          )}
          <div className='mt-6 flex flex-col justify-center md:flex-row'>
            {sessionLogData?.status !== 'completed' && (
              <ActionButton
                onClick={handleComplete}
                disabled={isCompleting}
                className='mx-2 md:w-auto'
              >
                {isCompleting ? 'Completing...' : 'Complete Session'}
              </ActionButton>
            )}
          </div>
        </form>
      </FormProvider>
    </>
  );
};
