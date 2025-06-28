import { api } from '@/utils';

export const fetchSessionData = async (id) => {
  const response = await api(`session-logs/${id}/`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch training session data.');
  const data = await response.json();
  return data;
};

export const saveSessionData = async (sessionLogdata, sessionLogId) => {
  const response = await api(
    `session-logs/${sessionLogId}/set-logs/`,
    'PATCH',
    sessionLogdata,
  );
  if (!response.ok) throw new Error('Failed to save session log data.');
  const data = await response.json();
  return data;
};
