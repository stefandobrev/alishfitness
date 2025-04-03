import api from '../../../utils/api';

export const fetchTrainingSetupData = async () => {
  const response = await api('/training-programs/training-setup-data', 'GET');
  if (!response.ok) throw new Error('Failed to fetch training setup data.');
  return response.json();
};

export const helpersCreate = async () => {
  const response = await api('/training-programs/create-program');
  if (!response.ok) throw new Error('Failed to create program.');
  return response.json();
};
