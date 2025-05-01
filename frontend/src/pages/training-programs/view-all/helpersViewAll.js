import { api, camelToSnake } from '@/utils';

export const fetchTrainingProgramData = async (
  trainingProgramsFilteredData,
) => {
  const trasnformedData = camelToSnake(trainingProgramsFilteredData);
  const response = await api('training-programs/', 'POST', trasnformedData);
  if (!response.ok) throw new Error('Failed to fetch training programs data.');
  return response.json();
};
