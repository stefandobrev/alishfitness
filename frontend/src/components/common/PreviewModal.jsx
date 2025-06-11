import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

import { ActionButton, ButtonVariant } from '@/components/buttons';

export const PreviewModal = ({
  onClose,
  onCreate,
  onView,
  heading,
  sessionData,
}) => {
  return (
    <Dialog open={true} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs'>
        <DialogPanel className='w-full max-w-lg transform space-y-6 rounded-lg border border-gray-300 bg-white p-8 shadow-xl transition-all'>
          <DialogTitle className='truncate text-2xl font-semibold text-gray-900'>
            {heading}
          </DialogTitle>

          <div className='flex flex-col gap-4 sm:flex-row sm:justify-end'>
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
