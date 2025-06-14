import { api } from '@/utils';

export const fetchSessionData = async (id) => {
  const response = await api('session-logs/session-data/', 'GET');
  if (!response.ok) throw new Error('Failed to fetch training session data.');
  return response.json();
};
