import { useFormContext, useWatch } from 'react-hook-form';

import { ToggleableMuscleView } from '@/components/muscleviews';

export const AnatomyPanel = ({ activeTab }) => {
  const { setValue, getValues, control } = useFormContext();

  // Watch form changes to update muscle visualization
  const primaryGroup = useWatch({
    control,
    name: 'primaryGroup',
  });

  const secondaryGroups = useWatch({
    control,
    name: 'secondaryGroups',
  });

  const handleMuscleClick = (muscle) => {
    const currentPrimary = getValues('primaryGroup');
    const currentSecondary = getValues('secondaryGroups') || [];

    if (!currentPrimary) {
      setValue('primaryGroup', muscle);
    } else if (currentPrimary === muscle) {
      setValue('primaryGroup', null);
    } else if (currentSecondary.includes(muscle)) {
      setValue(
        'secondaryGroups',
        currentSecondary.filter((m) => m !== muscle),
      );
    } else {
      setValue('secondaryGroups', [...currentSecondary, muscle]);
    }
  };

  return (
    <div
      className={`w-full items-center lg:w-1/4 ${
        activeTab !== 'anatomy' ? 'hidden lg:block' : ''
      }`}
    >
      <ToggleableMuscleView
        handleMuscleClick={handleMuscleClick}
        selectedPrimaryMuscle={primaryGroup ?? null}
        selectedSecondaryMuscles={secondaryGroups ?? []}
      />
    </div>
  );
};
