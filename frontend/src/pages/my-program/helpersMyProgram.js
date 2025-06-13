import { api } from '@/utils';

export const fetchTrainingProgramData = async () => {
  const response = await api('session-logs/active-training-program/', 'GET');
  if (!response.ok) throw new Error('Failed to fetch training program data.');
  return response.json();
};

export const fetchSessionData = async (id) => {
  const response = await api(`session-logs/session-data-view/${id}/`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch session data.');
  return response.json();
};

export const createSetLog = async (id) => {
  const response = await api(`session-logs/session-data/${id}/`, 'POST');
  if (!response.ok) throw new Error('Failed to create session.');
  return response.json();
};
