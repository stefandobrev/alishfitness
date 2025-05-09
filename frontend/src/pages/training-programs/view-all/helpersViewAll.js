import { api, camelToSnake } from '@/utils';

export const fetchTrainingProgramData = async (
  trainingProgramsFilteredData,
) => {
  const transformedData = camelToSnake(trainingProgramsFilteredData);
  const response = await api('training-programs/', 'POST', transformedData);
  if (!response.ok) throw new Error('Failed to fetch training programs data.');
  return response.json();
};

export const fetchTrainingFilterData = async () => {
  const response = await api('training-programs/filter-data/', 'GET');
  if (!response.ok)
    throw new Error('Failed to fetch training programs filter data.');
  return response.json();
};
