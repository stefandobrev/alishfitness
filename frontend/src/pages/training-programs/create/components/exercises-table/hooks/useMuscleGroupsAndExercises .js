import { useState, useEffect } from 'react';

import { fetchMuscleGroupsWithExercises } from '../../../helpersCreate';

export const useMuscleGroupsAndExercises = () => {
  const [muscleGroupsAndExercises, setMuscleGroupsAndExercises] = useState({});
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMuscleGroupsAndExercises = async () => {
      setIsLoading(true);

      try {
        const muscleGroupData = await fetchMuscleGroupsWithExercises();
        setMuscleGroupsAndExercises(muscleGroupData);

        const transformedMuscleGroups = Object.values(muscleGroupData).map(
          (group) => ({
            label: group.name,
            value: group.slug,
          }),
        );

        transformedMuscleGroups.push({
          label: 'Custom',
          value: 'custom',
        });

        setMuscleGroups(transformedMuscleGroups);
      } finally {
        setIsLoading(false);
      }
    };

    loadMuscleGroupsAndExercises();
  }, []);

  const getExerciseOptionsForMuscleGroup = (muscleGroupSlug) => {
    if (!muscleGroupSlug) return [];

    const muscleGroup = muscleGroupsAndExercises[muscleGroupSlug];
    return (
      muscleGroup?.exercises.map((exercise) => ({
        label: exercise.title,
        value: exercise.slug,
      })) || []
    );
  };

  return {
    muscleGroups,
    muscleGroupsAndExercises,
    getExerciseOptionsForMuscleGroup,
    isLoading,
  };
};
