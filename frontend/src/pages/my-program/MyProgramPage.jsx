import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { createSessionLog, fetchTrainingProgramData } from './helpersMyProgram';
import { SessionBlock, PreviewModal } from './components';
import { snakeToCamel } from '@/utils';
import { NoDataDiv } from '@/components/common';
import { Spinner } from '@/components/common';
import { useTitle } from '@/hooks';

export const MyProgramPage = () => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [trainingProgramData, setTrainingProgramData] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const navigate = useNavigate();
  useTitle('My Program');

  // Load training program data on mount
  useEffect(() => {
    const loadTrainingProgramData = async () => {
      setIsPageLoading(true);
      try {
        const data = await fetchTrainingProgramData();
        const transformedData = snakeToCamel(data);
        setTrainingProgramData(transformedData);
      } finally {
        setIsPageLoading(false);
      }
    };
    loadTrainingProgramData();
  }, []);

  // On create navigate to training session, if created just open today setLog
  const navigateToSession = async ({ session }) => {
    setIsCreateLoading(true);

    if (session.sessionLogId) {
      navigate(`/my-sessions/${session.sessionLogId}`);
    } else {
      const payload = {
        sessionId: session.id,
        trainingProgramId: trainingProgramData.id,
        order: session.order,
      };

      try {
        const data = await createSessionLog(payload);
        navigate(`/my-sessions/${data.id}`);
      } catch {
        toast.error('Session create failed');
      } finally {
        setIsCreateLoading(false);
      }
    }
  };
  console.log({ trainingProgramData });

  // Modal for sessions without status (in progress, completed - today)
  const handlePreviewModal = () => {
    setIsViewDialogOpen(true);
  };

  // On load return
  if ((isPageLoading && !trainingProgramData) || isCreateLoading) {
    return (
      <Spinner
        loading={isPageLoading || isCreateLoading}
        className='min-h-[70vh]'
      />
    );
  }

  // No training data paragraph return
  if (
    !isPageLoading &&
    (!trainingProgramData?.sessions ||
      trainingProgramData.sessions.length === 0)
  ) {
    return <NoDataDiv heading='No active training program found.' />;
  }

  // Build sessions with their orders by matching sessionId from scheduleData
  const sessionsWithOrder = trainingProgramData.scheduleData.map((schedule) => {
    const session = trainingProgramData.sessions.find(
      (s) => s.id === schedule.sessionId && s.order === schedule.order,
    );
    return session;
  });

  // Recommended vs rest sessions deconstruct
  const [mainSession, ...otherSessions] = sessionsWithOrder;

  return (
    <>
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
              <div
                className='mx-auto max-w-xl'
                onClick={() => {
                  if (!mainSession.status) {
                    setSelectedSession(mainSession);
                    handlePreviewModal();
                  } else {
                    navigateToSession({ session: mainSession });
                  }
                }}
              >
                <SessionBlock
                  session={mainSession}
                  isMain={true}
                  dayOrder={[mainSession.order]}
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
                  <div
                    key={`${session.id}-${session.order}`}
                    className='w-full md:max-w-xs'
                    onClick={() => {
                      if (!session.status) {
                        setSelectedSession(session);
                        handlePreviewModal();
                      } else {
                        navigateToSession({ session: session });
                      }
                    }}
                  >
                    <SessionBlock
                      session={session}
                      dayOrder={[session.order]}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isViewDialogOpen && (
        <PreviewModal
          onClose={() => setIsViewDialogOpen(false)}
          onCreate={() =>
            navigateToSession({
              session: selectedSession,
            })
          }
          heading={`Session: ${selectedSession.title}`}
          selectedSessionId={selectedSession.id}
        />
      )}
    </>
  );
};
