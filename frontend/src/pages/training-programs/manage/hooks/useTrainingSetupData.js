import { useState, useEffect } from 'react';

import { fetchTrainingSetupData } from '@/pages/training-programs/manage/helpersManageProgram';
import { snakeToCamel } from '@/utils';

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
        const transformedData = snakeToCamel(data);
        setMuscleGroupsAndExercises(transformedData.muscleGroups);

        const transformedMuscleGroups = Object.values(
          transformedData.muscleGroups,
        ).map((group) => ({
          label: group.name,
          value: group.slug,
        }));

        transformedMuscleGroups.push({
          label: 'Custom',
          value: 'custom',
        });

        const transformedUserData = Object.values(transformedData.users).map(
          (user) => ({
            label: `${user.lastName}, ${user.firstName} (${user.username})`,
            value: user.id,
          }),
        );

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
