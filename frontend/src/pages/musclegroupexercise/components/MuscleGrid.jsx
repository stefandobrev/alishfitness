import { MuscleTile } from './MuscleTile';

export const MuscleGrid = ({ exercisesData }) => {
  return (
    <div className='grid grid-cols-1 gap-2 px-3 md:grid-cols-2 lg:grid-cols-3'>
      {exercisesData?.map((exercise) => (
        <MuscleTile exercise={exercise} />
      ))}
    </div>
  );
};
