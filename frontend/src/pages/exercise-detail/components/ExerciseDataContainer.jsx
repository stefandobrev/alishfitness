import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const VideoItems = ({ src }) => (
  <video
    src={src}
    autoPlay
    loop
    className='rounded-lg object-cover lg:w-[50%]'
  />
);

export const ExerciseDataContainer = ({ exerciseData }) => {
  return (
    <div className='m-2 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
      <div className='flex flex-col gap-6 lg:flex-row'>
        <VideoItems src={exerciseData.gif_link_front} />
        <VideoItems src={exerciseData.gif_link_side} />
      </div>

      {exerciseData.steps?.length > 0 && (
        <>
          <ol className='list-decimal space-y-4 text-lg text-gray-800 lg:pl-4'>
            {exerciseData.steps.map((step, index) => (
              <li key={index} className='flex items-center'>
                <div className='mr-3 flex-shrink-0'>
                  <span className='text-md flex h-8 w-8 items-center justify-center rounded-full bg-white font-medium text-gray-800 ring-2 ring-gray-800'>
                    {index + 1}
                  </span>
                </div>
                <span className='text-gray-700'>{step.description}</span>
              </li>
            ))}
          </ol>
        </>
      )}

      {exerciseData.video_link && (
        <div className='my-2 flex justify-center'>
          <a
            href={exerciseData.video_link}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700'
          >
            <svg
              className='h-5 w-5'
              fill='currentColor'
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' />
            </svg>
            Watch full tutorial on YouTube
          </a>
        </div>
      )}

      {exerciseData.mistakes?.length > 0 && (
        <>
          <h3 className='text-xl font-medium text-gray-800'>
            Common mistakes to avoid
          </h3>
          <ul className='space-y-3 text-lg text-gray-800 lg:pl-4'>
            {exerciseData.mistakes.map((mistake, index) => (
              <li key={index} className='flex items-start'>
                <div className='mt-1 mr-3 flex-shrink-0'>
                  <ExclamationTriangleIcon className='text-logored h-5 w-5' />
                </div>
                <span className='text-gray-700'>{mistake.description}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
