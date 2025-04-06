import { useState, useEffect } from 'react';

import { ToggleableMuscleView } from '@/components/muscleviews';

export const AnatomyPanel = ({ activeTab, methods }) => {
  const [muscleSelection, setMuscleSelection] = useState({
    primary: null,
    secondary: [],
  });

  // Watch form changes to update muscle visualization
  useEffect(() => {
    const subscription = methods.watch((values) => {
      setMuscleSelection({
        primary: values.primary_group || null,
        secondary: values.secondary_groups || [],
      });
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  const handleMuscleClick = (muscle) => {
    const currentPrimary = methods.getValues('primary_group');
    const currentSecondary = methods.getValues('secondary_groups') || [];

    if (!currentPrimary) {
      methods.setValue('primary_group', muscle);
    } else if (currentPrimary === muscle) {
      methods.setValue('primary_group', null);
    } else if (currentSecondary.includes(muscle)) {
      methods.setValue(
        'secondary_groups',
        currentSecondary.filter((m) => m !== muscle),
      );
    } else {
      methods.setValue('secondary_groups', [...currentSecondary, muscle]);
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
