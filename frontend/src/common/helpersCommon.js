import api from '../utils/api';

export const fetchMuscleGroups = async (type) => {
  const response = await api(`${type}/muscle-groups/`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch muscle groups.');
  return response.json();
};
