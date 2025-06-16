import { api } from '@/utils';

export const fetchSessionData = async (id) => {
  const response = await api(`session-logs/${id}/`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch training session data.');
  const data = await response.json();
  return data;
};
