import api from '../../../utils/api';

export const fetchExercisesByMuscle = async (muscleGroup) => {
  const response = await api(
    `/training-programs/${muscleGroup}/exercises`,
    'GET',
  );
  if (!response.ok) throw new Error('Failed to fetch exercises.');
  return response.json();
};
