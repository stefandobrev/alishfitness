import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

import { ActionButton, ButtonVariant } from '@/components/buttons';

export const ConfirmationModal = ({
  onClose,
  onConfirm,
  heading,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  return (
    <Dialog open={true} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs'>
        <DialogPanel className='w-full max-w-lg transform space-y-6 rounded-lg border border-gray-300 bg-white p-8 shadow-xl transition-all'>
          <DialogTitle className='truncate text-2xl font-semibold text-gray-900'>
            {heading}
          </DialogTitle>
          <p className='text-lg text-gray-700'>{message}</p>
          <div className='flex justify-end gap-4'>
            <ActionButton variant={ButtonVariant.GRAY_DARK} onClick={onClose}>
              {cancelText}
            </ActionButton>
            <ActionButton
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </ActionButton>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
