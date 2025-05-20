import { useState, useEffect } from 'react';

import { fetchTrainingSetupData } from '@/pages/training-programs/manage/helpersManageProgram';

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

        const transformedMuscleGroups = Object.values(data.muscle_groups).map(
          (group) => ({
            label: group.name,
            value: group.slug,
          }),
        );

        transformedMuscleGroups.push({
          label: 'Custom',
          value: 'custom',
        });

        const transformedUserData = Object.values(data.users).map((user) => ({
          label: `${user.last_name}, ${user.first_name} (${user.username})`,
          value: user.id,
        }));

        setMuscleGroups(transformedMuscleGroups);
        setUsersData(transformedUserData);
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
