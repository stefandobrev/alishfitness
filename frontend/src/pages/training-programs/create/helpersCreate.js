import api from '../../../utils/api';

export const fetchMuscleGroupsWithExercises = async () => {
  const response = await api(
    '/training-programs/muscle-groups-with-exercises',
    'GET',
  );
  if (!response.ok) throw new Error('Failed to fetch exercises.');
  return response.json();
};
