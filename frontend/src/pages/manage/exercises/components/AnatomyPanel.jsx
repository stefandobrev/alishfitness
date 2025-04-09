import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { ToggleableMuscleView } from '@/components/muscleviews';

export const AnatomyPanel = ({ activeTab }) => {
  const [muscleSelection, setMuscleSelection] = useState({
    primary: null,
    secondary: [],
  });

  const { setValue, getValues, methods, watch } = useFormContext();

  // Watch form changes to update muscle visualization
  useEffect(() => {
    const subscription = watch((values) => {
      setMuscleSelection({
        primary: values.primaryGroup || null,
        secondary: values.secondaryGroups || [],
      });
    });
    return () => subscription.unsubscribe();
  }, [methods]);

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
        selectedPrimaryMuscle={muscleSelection.primary}
        selectedSecondaryMuscles={muscleSelection.secondary}
      />
    </div>
  );
};
