import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

import { ActionButton, ButtonVariant } from '@/components/buttons';
import { fetchSessionData } from '../helpersMyProgram';

export const PreviewModal = ({
  onClose,
  onCreate,
  heading,
  selectedSessionId,
}) => {
  const onView = async () => {
    const data = await fetchSessionData(selectedSessionId);
    console.log({ data });
  };
  return (
    <Dialog open={true} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs'>
        <DialogPanel className='w-full max-w-lg transform space-y-6 rounded-lg border border-gray-300 bg-white p-8 shadow-xl transition-all'>
          <DialogTitle className='mb-8 truncate text-2xl font-semibold text-gray-900'>
            {heading}
          </DialogTitle>

          <div className='mb-6 space-y-4'>
            <p className='text-gray-600'>
              Choose an action to continue with your session.
            </p>
            <div className='space-y-2 text-sm text-gray-500'>
              <p>
                <strong>View:</strong> Preview session's content
              </p>
              <p>
                <strong>Create:</strong> Generate a new training session for
                today
              </p>
            </div>
          </div>

          <div className='flex flex-col gap-6 sm:flex-row sm:justify-center'>
            <ActionButton
              variant={ButtonVariant.GRAY_DARK}
              onClick={onClose}
              className='w-full sm:w-auto'
            >
              Cancel
            </ActionButton>
            <ActionButton
              variant={ButtonVariant.GRAY_DARK}
              onClick={onView}
              className='w-full sm:w-auto'
            >
              View
            </ActionButton>
            <ActionButton
              onClick={() => {
                onCreate();
                onClose();
              }}
              className='w-full sm:w-auto'
            >
              Create
            </ActionButton>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
