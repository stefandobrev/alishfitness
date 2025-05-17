import { api, camelToSnake } from '@/utils';

export const fetchExercises = async (muscleGroupFilteredData) => {
  const transformedData = camelToSnake(muscleGroupFilteredData);
  const response = await api('exercises/filtered/', 'POST', transformedData);

  if (response.status === 404) {
    return { error: true };
  }

  if (!response.ok) {
    throw new Error('Failed to fetch exercises.');
  }

  return response.json();
};
