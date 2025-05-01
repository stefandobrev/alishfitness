import { api, camelToSnake } from '@/utils';

export const fetchExercises = async (muscleGroupFilteredData) => {
  const trasnformedData = camelToSnake(muscleGroupFilteredData);
  const response = await api('exercises/filter/', 'POST', trasnformedData);
  if (!response.ok && response.status !== 404) {
    throw new Error('Failed to fetch exercises.');
  }
  return response.json();
};
