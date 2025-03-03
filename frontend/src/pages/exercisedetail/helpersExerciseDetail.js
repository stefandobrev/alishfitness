import api from '../../utils/api';

export const fetchExercise = async ({ slugMuscleGroup, slugTitle }) => {
  const response = await api(`exercises/${slugMuscleGroup}/${slugTitle}/`);
  if (!response.ok && response.status !== 404) {
    throw new Error('Failed to fetch exercise data.');
  }
  return response.json();
};
