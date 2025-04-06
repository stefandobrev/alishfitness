import { useMedia } from 'react-use';
import { useNavigate } from 'react-router-dom';
import {
  FullBodyMuscleView,
  ToggleableMuscleView,
} from '@/components/muscleviews';
import { useTitle } from '@/hooks/useTitle.hook';

export const ExercisePage = () => {
  const navigate = useNavigate();

  useTitle('Exercises');

  const isMdOrLarger = useMedia('(min-width: 768px)');

  const handleMuscleClick = (id) => {
    if (id) navigate(`/exercises/${id}`);
  };

  return (
    <>
      {isMdOrLarger ? (
        <FullBodyMuscleView handleMuscleClick={handleMuscleClick} />
      ) : (
        <ToggleableMuscleView handleMuscleClick={handleMuscleClick} />
      )}
    </>
  );
};
