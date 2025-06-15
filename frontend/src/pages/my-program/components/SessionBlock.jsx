import { ChevronRightIcon } from '@heroicons/react/24/outline';

export const SessionBlock = ({ session, isMain = false, dayNumber }) => {
  const formatDate = (date) => {
    if (!date) return 'No sessions completed';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      className={`group cursor-pointer rounded-2xl border border-gray-500 p-8 transition-all duration-300 hover:scale-[1.02] hover:border-gray-600 hover:shadow-2xl ${
        isMain
          ? 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-900'
          : ''
      }`}
    >
      {/* Header with icon */}
      <div className='mb-4 flex items-center gap-3'>
        <div className='bg-logored h-4 w-4 rounded-full'></div>
        <h2
          className={`font-bold ${isMain ? 'text-2xl' : 'text-xl text-gray-800'}`}
        >
          {session.title}
        </h2>
      </div>

      {/* Stats */}
      <div
        className={`space-y-3 ${isMain ? 'text-gray-800' : 'text-gray-700'}`}
      >
        <div className='flex items-center'>
          <p className='font-semibold'>Day {dayNumber}</p>
        </div>
        <div className='flex items-center gap-2'>
          <div className='text-m flex h-5 w-5 items-center justify-center rounded-full font-bold'>
            {session.completedCount}
          </div>
          <p>Sessions completed</p>
        </div>
        <div className='flex items-center gap-2'>
          <p>Last completed: {formatDate(session.lastCompletedAt)}</p>
        </div>
      </div>

      {/* Action indicator */}
      {isMain ? (
        <div className='mt-6 flex items-center justify-between'>
          <span className='text-sm font-medium text-gray-700'>
            {session.status === 'in_progress'
              ? 'Continue session'
              : session.status === 'completed'
                ? 'Edit session'
                : 'Ready to start'}
          </span>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30'>
            <ChevronRightIcon className='h-4' />
          </div>
        </div>
      ) : (
        <div className='mt-6 flex items-center justify-between'>
          <span className='text-sm font-medium text-gray-500 transition-colors group-hover:text-gray-600'>
            Tap to select
          </span>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-300'>
            <ChevronRightIcon className='h-4' />
          </div>
        </div>
      )}
    </div>
  );
};
