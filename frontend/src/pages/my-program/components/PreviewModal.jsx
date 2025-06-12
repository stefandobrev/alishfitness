import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

import { ActionButton, ButtonVariant } from '@/components/buttons';
import { fetchSessionData } from '../helpersMyProgram';
import { snakeToCamel } from '@/utils';
import { Spinner } from '@/components/common';

export const PreviewModal = ({
  onClose,
  onCreate,
  heading,
  selectedSessionId,
}) => {
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const onView = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSessionData(selectedSessionId);
      const transformedData = snakeToCamel(data);
      console.log({ transformedData });
      setPreviewData(transformedData);
      setShowPreview(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onBack = () => {
    setShowPreview(false);
    setPreviewData(null);
  };

  return (
    <Dialog open={true} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
        <DialogPanel
          className={`w-full transform space-y-6 rounded-xl border border-gray-200 bg-white shadow-2xl transition-all ${
            showPreview ? 'max-w-2xl' : 'max-w-lg'
          }`}
        >
          <div className='p-8'>
            <DialogTitle className='mb-6 truncate text-2xl font-bold text-gray-900'>
              {heading}
            </DialogTitle>

            {isLoading ? (
              <Spinner className='min-h-[40vh]' />
            ) : !showPreview ? (
              // Initial view - action selection
              <>
                <div className='mb-8 space-y-4'>
                  <p className='text-lg text-gray-600'>
                    Choose an action to continue with your session.
                  </p>
                  <div className='space-y-3 rounded-lg bg-gray-50 p-4'>
                    <div className='flex items-start space-x-3'>
                      <div>
                        <p className='font-medium text-gray-900'>View</p>
                        <p className='text-sm text-gray-600'>
                          Preview session's exercises and details
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start space-x-3'>
                      <div>
                        <p className='font-medium text-gray-900'>Create</p>
                        <p className='text-sm text-gray-600'>
                          Generate a new training session for today
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
                  <ActionButton
                    variant={ButtonVariant.GRAY_DARK}
                    onClick={onClose}
                    className='w-full px-6 py-2.5 sm:w-auto'
                  >
                    Close
                  </ActionButton>
                  <ActionButton
                    variant={ButtonVariant.GRAY_DARK}
                    onClick={onView}
                    className='w-full px-6 py-2.5 sm:w-auto'
                  >
                    View
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      onCreate();
                      onClose();
                    }}
                  >
                    Create New Session
                  </ActionButton>
                </div>
              </>
            ) : (
              // Preview view - show exercises
              <>
                <div className='mb-6'>
                  <div className='mb-4 flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      Exercise Preview
                    </h3>
                    <span className='rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500'>
                      {previewData?.length || 0} exercises
                    </span>
                  </div>

                  {previewData && previewData.length > 0 ? (
                    <div className='max-h-96 space-y-3 overflow-y-auto'>
                      {previewData.map((exercise, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-4 transition-shadow hover:shadow-md'
                        >
                          <div className='flex items-center space-x-4'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-lg font-bold text-white'>
                              {exercise.sequence}
                            </div>
                            <div>
                              <h4 className='text-lg font-medium text-gray-900'>
                                {exercise.exerciseTitle}
                              </h4>
                              <div className='mt-1 flex items-center space-x-4 text-sm text-gray-600'>
                                <span className='flex items-center'>
                                  <span className='font-medium'>Sets:</span>
                                  <span className='ml-1 rounded bg-gray-100 px-2 py-0.5 text-gray-600'>
                                    {exercise.sets}
                                  </span>
                                </span>
                                <span className='flex items-center'>
                                  <span className='font-medium'>Reps:</span>
                                  <span className='ml-1 rounded bg-gray-100 px-2 py-0.5 text-gray-600'>
                                    {exercise.reps}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='py-8 text-center text-gray-500'>
                      <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
                        <svg
                          className='h-8 w-8 text-gray-400'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                          />
                        </svg>
                      </div>
                      <p>No exercises found for this session</p>
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:justify-center'>
                  <ActionButton
                    variant={ButtonVariant.GRAY_DARK}
                    onClick={onBack}
                    className='w-full px-6 py-2.5 sm:w-auto'
                  >
                    ← Back
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      onCreate();
                      onClose();
                    }}
                  >
                    Create New Session
                  </ActionButton>
                  <ActionButton
                    variant={ButtonVariant.GRAY_DARK}
                    onClick={onClose}
                    className='w-full px-6 py-2.5 sm:w-auto'
                  >
                    Close
                  </ActionButton>
                </div>
              </>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
