import api from '@/utils/api';

export const fetchExercise = async ({ slugMuscleGroup, slugTitle }) => {
  const response = await api(`exercises/${slugMuscleGroup}/${slugTitle}/`);
  if (!response.ok && response.status !== 404) {
    console.log('Are we habibi');
    throw new Error('Failed to fetch exercise data.');
  }
  return response.json();
};
