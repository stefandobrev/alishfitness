import api from '../../utils/api';

export const fetchExercises = async ({ selectedMuscleId, searchQuery }) => {
  const response = await api('exercises/exercises-group/', 'POST', {
    muscle_group_id: selectedMuscleId,
    search_query: searchQuery,
  });
  if (!response.ok && response.status !== 404) {
    throw new Error('Failed to fetch exercises.');
  }
  return response.json();
};
