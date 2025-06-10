export const SessionBlock = ({ session, isMain = false }) => {
  const formatDate = (date) => {
    if (!date) return 'No sessions completed yet';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      className={`group cursor-pointer rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
        isMain
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl'
          : 'border border-gray-100 bg-white shadow-lg hover:border-blue-200'
      }`}
    >
      {/* Header with icon */}
      <div className='mb-4 flex items-center gap-3'>
        <div
          className={`h-3 w-3 rounded-full ${isMain ? 'bg-white' : 'bg-blue-500'}`}
        ></div>
        <h2
          className={`font-bold ${isMain ? 'text-2xl' : 'text-xl text-gray-800'}`}
        >
          {session.title}
        </h2>
      </div>

      {/* Stats */}
      <div
        className={`space-y-3 ${isMain ? 'text-blue-100' : 'text-gray-600'}`}
      >
        <div className='flex items-center gap-2'>
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
              isMain ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
            }`}
          >
            {session.completedCount}
          </div>
          <p>Sessions completed</p>
        </div>
        <div className='flex items-center gap-2'>
          <div
            className={`h-2 w-2 rounded-full ${isMain ? 'bg-white/60' : 'bg-gray-400'}`}
          ></div>
          <p>Last completed: {formatDate(session.lastCompletedAt)}</p>
        </div>
      </div>

      {/* Action indicator */}
      {isMain ? (
        <div className='mt-6 flex items-center justify-between'>
          <span className='text-sm font-medium text-blue-100'>
            Ready to start
          </span>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30'>
            <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        </div>
      ) : (
        <div className='mt-6 flex items-center justify-between'>
          <span className='text-sm font-medium text-gray-500 transition-colors group-hover:text-blue-600'>
            Tap to select
          </span>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-blue-100'>
            <svg
              className='h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-600'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
