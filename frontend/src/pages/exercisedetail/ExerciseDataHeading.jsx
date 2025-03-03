import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { ViewButton } from '../../components/buttons/EditButtons';

const ExerciseDataHeading = ({ exerciseData }) => {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate('/manage', { state: { exerciseId: exerciseData.id } });
  };

  return (
    <div className='relative w-full py-4'>
      <div className='flex flex-col items-center gap-3'>
        <div className='flex flex-row items-center'>
          <h1 className='text-2xl font-bold md:text-3xl'>
            {exerciseData.title}
          </h1>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: `Exercise: ${exerciseData.title}`,
                    url: window.location.href,
                  })
                  .catch((err) => console.error('Error sharing:', err));
              } else {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
              }
            }}
            className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            aria-label='Share exercise'
            title='Share exercise'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
              aria-hidden='true'
              data-slot='icon'
              className='text-logored h-7 w-7 pt-1'
            >
              <path d='M13 4.5a2.5 2.5 0 1 1 .702 1.737L6.97 9.604a2.518 2.518 0 0 1 0 .792l6.733 3.367a2.5 2.5 0 1 1-.671 1.341l-6.733-3.367a2.5 2.5 0 1 1 0-3.475l6.733-3.366A2.52 2.52 0 0 1 13 4.5Z'></path>
            </svg>
          </button>
        </div>
      </div>

      {isAdmin && (
        <div className='mt-2 flex justify-center lg:absolute lg:top-1/2 lg:right-0 lg:mt-0 lg:mr-2 lg:-translate-y-1/2'>
          <ViewButton onClick={handleViewClick} variant='red'>
            Edit Exercise
          </ViewButton>
        </div>
      )}
    </div>
  );
};
export default ExerciseDataHeading;
