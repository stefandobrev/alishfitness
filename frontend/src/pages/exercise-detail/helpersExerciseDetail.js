import { api } from '@/utils';

export const fetchExercise = async ({ slugMuscleGroup, slugTitle }) => {
  const response = await api(`exercises/${slugMuscleGroup}/${slugTitle}/`);

  if (response.status === 404) {
    return { error: true };
  }

  if (!response.ok) {
    throw new Error('Failed to fetch exercise data.');
  }
  return response.json();
};
