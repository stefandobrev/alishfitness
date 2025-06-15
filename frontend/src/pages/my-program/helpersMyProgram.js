import { api, camelToSnake } from '@/utils';

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

export const createSessionLog = async (payload) => {
  const transformedData = camelToSnake(payload);

  const response = await api('session-logs/', 'POST', transformedData);
  if (!response.ok) throw new Error('Failed to create session log.');
  return response.json();
};
