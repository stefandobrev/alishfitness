import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { ActionButton } from '../../../components/buttons';

export const ExerciseDataHeading = ({ exerciseData }) => {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate('/manage/exercises', { state: { exerciseId: exerciseData.id } });
  };

  return (
    <div className='relative w-full py-4'>
      <div className='flex flex-col items-center gap-3'>
        <div className='flex flex-row items-center'>
          <h1 className='text-2xl font-bold md:text-3xl'>
            {exerciseData.title}
          </h1>
        </div>
      </div>

      {isAdmin && (
        <div className='mt-2 flex justify-center lg:absolute lg:top-1/2 lg:right-0 lg:mt-0 lg:mr-2 lg:-translate-y-1/2'>
          <ActionButton onClick={handleViewClick}>Edit Exercise</ActionButton>
        </div>
      )}
    </div>
  );
};
