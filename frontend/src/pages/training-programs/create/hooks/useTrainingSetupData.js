import { useState, useEffect } from 'react';

import { fetchTrainingSetupData } from '@/pages/training-programs/create/helpersCreateProgram';

export const useTrainingSetupData = () => {
  const [muscleGroupsAndExercises, setMuscleGroupsAndExercises] = useState({});
  const [usersData, setUsersData] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTrainingSetupData = async () => {
      setIsLoading(true);

      try {
        const data = await fetchTrainingSetupData();
        setMuscleGroupsAndExercises(data.muscle_groups);

        const filteredMuscleGroups = Object.values(data.muscle_groups).map(
          (group) => ({
            label: group.name,
            value: group.slug,
          }),
        );

        filteredMuscleGroups.push({
          label: 'Custom',
          value: 'custom',
        });

        const fitleredUserData = Object.values(data.users).map((user) => ({
          label: `${user.last_name}, ${user.first_name} (${user.username})`,
          value: user.id,
        }));

        setMuscleGroups(filteredMuscleGroups);
        setUsersData(fitleredUserData);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrainingSetupData();
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
    usersData,
    getExerciseOptionsForMuscleGroup,
    isLoading,
  };
};
