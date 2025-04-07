import { api } from '@/utils';

export const fetchExercises = async ({
  selectedMuscleId,
  offset,
  searchQuery,
}) => {
  const response = await api('exercises/exercises-group/', 'POST', {
    muscle_group_id: selectedMuscleId,
    offset: offset,
    search_query: searchQuery,
  });
  if (!response.ok && response.status !== 404) {
    throw new Error('Failed to fetch exercises.');
  }
  return response.json();
};
