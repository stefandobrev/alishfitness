import { api, camelToSnake } from '@/utils';

export const fetchSessionData = async (id) => {
  const response = await api(`session-logs/${id}/`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch training session data.');
  const data = await response.json();
  return data;
};

export const saveSessionData = async (sessionLogId, sessionLogData) => {
  const transformedData = camelToSnake(sessionLogData);

  const response = await api(
    `session-logs/${sessionLogId}/set-logs/`,
    'PATCH',
    transformedData,
  );
  if (!response.ok) throw new Error('Failed to save session log data.');
  const data = await response.json();
  return data;
};

export const completeSession = async (sessionLogId, statusData) => {
  const response = await api(
    `session-logs/${sessionLogId}/`,
    'PATCH',
    statusData,
  );
  if (!response.ok) throw new Error('Failed to complete the session.');
  const data = await response.json();
  return data;
};

export const getExerciseTrends = async (exerciseId) => {
  const response = await api(`session-logs/view-trends/${exerciseId}/`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch exercise trends data.');
  const data = await response.json();
  return data;
};
