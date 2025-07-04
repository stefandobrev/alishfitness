import { ChevronRightIcon } from '@heroicons/react/24/outline';

export const SessionBlock = ({ session, isMain = false, dayOrder }) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  let statusProps = {};

  switch (session.status) {
    case 'in_progress':
      statusProps = {
        bgColor: 'bg-blue-600',
        textColor: 'text-blue-600',
        description: 'Continue session',
      };
      break;
    case 'completed':
      statusProps = {
        bgColor: 'bg-green-600',
        textColor: 'text-green-600',
        description: 'Edit session',
      };
      break;
    default:
      statusProps = {
        bgColor: 'bg-logored',
        textColor: 'text-logored',
        description: 'Ready to start',
      };
      break;
  }

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
        <div
          className={`mt-[2px] h-4 w-4 rounded-full ${statusProps.bgColor}`}
        />
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
          <p className='font-semibold'>Day {dayOrder}</p>
        </div>
        <div className='flex items-center gap-2'>
          <div className='text-m flex h-5 w-5 items-center justify-center rounded-full font-bold'>
            {session.completedCount}
          </div>
          <p>
            {session.completedCount == 1 ? 'Session' : 'Sessions'} completed
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <p>Last completed: {formatDate(session.lastCompletedAt)}</p>
        </div>
      </div>

      {/* Action indicator */}
      {isMain ? (
        <div className='mt-6 flex items-center justify-between'>
          <span className='text-sm font-medium'>
            <span className={`${statusProps.textColor} font-semibold`}>
              {statusProps.description}
            </span>
          </span>

          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30'>
            <ChevronRightIcon className='h-4' />
          </div>
        </div>
      ) : (
        <div className='mt-6 flex items-center justify-between'>
          <span className='text-sm font-semibold text-gray-500 transition-colors group-hover:text-gray-600'>
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
