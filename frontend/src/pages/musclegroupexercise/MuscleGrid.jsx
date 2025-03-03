import MuscleTile from './MuscleTile';

const MuscleGrid = ({ exercisesData }) => {
  return (
    <div className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3'>
      {exercisesData?.map((exercise) => (
        <MuscleTile exercise={exercise} />
      ))}
    </div>
  );
};

export default MuscleGrid;
