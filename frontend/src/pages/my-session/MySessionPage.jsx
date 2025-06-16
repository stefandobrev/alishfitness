import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { fetchSessionData } from './helpersMySession';
import { snakeToCamel } from '@/utils';
import { Spinner } from '@/components/common';

export const MySessionPage = () => {
  const { id: sessionId } = useParams();
  const [sessionData, setSessionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load session log data
  useEffect(() => {
    const loadSessionData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSessionData(sessionId);
        const transformedData = snakeToCamel(data);
        setSessionData(transformedData);
      } finally {
        setIsLoading(false);
      }
    };
    loadSessionData();
  }, []);

  // Initial loading spinner on session fetch
  if (isLoading && !sessionData.length) {
    return <Spinner loading={isLoading} className='min-h-[70vh]' />;
  }

  return <div>MySessionPage</div>;
};
