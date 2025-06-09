import { api } from '@/utils';

export const fetchTrainingProgramData = async () => {
  const response = await api('session-logs/active-training-program/', 'GET');
  if (!response.ok) throw new Error('Failed to fetch training program data.');
  return response.json();
};
