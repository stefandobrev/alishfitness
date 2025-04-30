import { api } from '@/utils';

export const fetchTrainingProgramData = async () => {
  const response = await api('training-programs/view-all/', 'GET');
  if (!response.ok) throw new Error('Failed to fetch training programs data.');
  return response.json();
};
