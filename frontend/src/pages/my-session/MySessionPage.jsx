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

export const MySessionPage = () => {
  const { id: sessionId } = useParams();
  const [sessionLogData, setSessionLogData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const isMobile = useIsMobile();
  useTitle('Daily Workout');

  // const methods = useForm({
  //   resolver: zodResolver(),
  //   mode: 'onChange'
  // })

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

  // Initial loading spinner on session log data fetch
  if (isLoading && !sessionLogData.length) {
    return <Spinner loading={isLoading} className='min-h-[80vh]' />;
  }

  console.log({ sessionLogData });

  return (
    <>
      <div className='flex justify-center'>
        <h1 className='p-4 text-2xl font-bold md:text-3xl'>
          {sessionLogData?.session?.sessionTitle}
        </h1>
      </div>
      <FormProvider>
        {isMobile ? <SessionTableMobile /> : <SessionTableDesktop />}
      </FormProvider>
    </>
  );
};
