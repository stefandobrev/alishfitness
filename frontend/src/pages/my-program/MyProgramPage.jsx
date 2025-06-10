import { useEffect, useState } from 'react';

import { fetchTrainingProgramData } from './helpersMyProgram';
import { SessionBlock } from './components';
import { snakeToCamel } from '@/utils';
import { NoDataDiv } from '@/components/common';
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

  const [mainSession, ...otherSessions] = trainingProgramData.sessions || [];

  // On load return
  if (isLoading && !trainingProgramData.length) {
    return <Spinner loading={isLoading} className='min-h-[70vh]' />;
  }

  // No training data paragraph return
  if (
    !isLoading &&
    (!trainingProgramData.sessions || trainingProgramData.sessions.length === 0)
  ) {
    return <NoDataDiv heading='No active training program found.' />;
  }

  return (
    <div className='bg-gradient-to-br from-gray-50 to-blue-50/30'>
      <div className='container mx-auto px-4 py-6'>
        {/* Header */}
        <div className='mb-4 text-center'>
          <h1 className='p-4 text-2xl font-bold md:text-3xl'>
            {trainingProgramData.programTitle}
          </h1>
        </div>

        {/* Main Session Section */}
        {mainSession && (
          <div className='mb-6'>
            <div className='mb-4 text-center'>
              <h2 className='font-semi-bold mb-2 text-xl text-gray-800'>
                Recommended next session
              </h2>
            </div>
            <div className='mx-auto max-w-xl'>
              <SessionBlock
                session={mainSession}
                isMain={true}
                dayNumber={
                  trainingProgramData.scheduleData.indexOf(mainSession.id) + 1
                }
              />
            </div>
          </div>
        )}

        {/* Other Sessions Section */}
        {otherSessions.length > 0 && (
          <div>
            <div className='mb-6 text-center'>
              <h2 className='font-semi-bold mb-2 text-xl text-gray-800'>
                Explore other sessions
              </h2>
            </div>
            <div className='flex flex-wrap justify-center gap-4'>
              {otherSessions.map((session) => (
                <div key={session.id} className='w-full md:max-w-xs'>
                  <SessionBlock
                    session={session}
                    dayNumber={
                      trainingProgramData.scheduleData.indexOf(session.id) + 1
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
