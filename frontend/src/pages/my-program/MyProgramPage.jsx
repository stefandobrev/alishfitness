import { useEffect, useState } from 'react';

import { fetchTrainingProgramData } from './helpersMyProgram';
import { NoDataDiv } from '@/components/common';
import { snakeToCamel } from '@/utils';
import { Spinner } from '@/components/common';

export const MyProgramPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [trainingProgramData, setTrainingProgramData] = useState([]);

  useEffect(() => {
    const loadTrainingProgramData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTrainingProgramData();
        const transformedData = snakeToCamel(data);

        setTrainingProgramData(transformedData);
        console.log({ transformedData });
      } finally {
        setIsLoading(false);
      }
    };
    loadTrainingProgramData();
  }, []);

  return (
    <>
      {isLoading && !trainingProgramData.length ? (
        <Spinner loading={isLoading} className='min-h-[70vh]' />
      ) : (
        <h1 className='flex justify-center p-4 text-2xl font-bold md:text-3xl'>
          {trainingProgramData.programTitle}
        </h1>
      )}

      {!isLoading && trainingProgramData.length === 0 && (
        <NoDataDiv heading='No training programs found' />
      )}
    </>
  );
};
