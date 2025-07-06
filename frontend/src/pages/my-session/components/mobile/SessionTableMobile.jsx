import { ActionButton, ButtonVariant } from '@/components/buttons';
import { SetHeader, SetSubHeaders, SetCells } from '..';

export const SessionTableMobile = ({ exercises, activeTab }) => {
  const maxSets = Math.max(...exercises.map((ex) => ex.sets));

  const openExercisePage = (muscleGroupSlug, exerciseSlug) => {
    window.open(`/exercises/${muscleGroupSlug}/${exerciseSlug}/`, '_blank');
  };

  return (
    <>{activeTab === 'inputs' ? <div>Inputs</div> : <div>Exercise</div>}</>
  );
};
