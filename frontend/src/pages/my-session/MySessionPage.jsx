import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';

import { fetchSessionData } from './helpersMySession';
import { snakeToCamel } from '@/utils';
import { Spinner } from '@/components/common';
import { useTitle } from '@/hooks';
import { useIsMobile } from '@/common/constants';
import { SessionTableDesktop, SessionTableMobile } from './components';
import { ActionButton } from '@/components/buttons';
import { manageSession } from '@/schemas';

export const MySessionPage = () => {
  const { id: sessionId } = useParams();
  const [sessionLogData, setSessionLogData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const isMobile = useIsMobile();
  useTitle('Daily Workout');

  const defaultValues = {}; // Include set logs later

  const methods = useForm({
    resolver: zodResolver(manageSession),
    mode: 'onChange',
    defaultValues,
  });

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
  }, []);

  console.log({ sessionLogData });

  // Complete button just changes status of session log
  const onComplete = () => {};

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
            {isMobile ? (
              <SessionTableMobile sessionLogData={sessionLogData} />
            ) : (
              <SessionTableDesktop sessionLogData={sessionLogData} />
            )}
          </FormProvider>
          <div className='mt-6 flex justify-center'>
            <ActionButton
              onClick={onComplete}
              className='mx-2 w-full md:w-auto'
            >
              Complete Session
            </ActionButton>
          </div>
        </>
      )}
    </>
  );
};
