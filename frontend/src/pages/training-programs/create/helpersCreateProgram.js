import { api, camelToSnake } from '@/utils';

export const fetchTrainingSetupData = async () => {
  const response = await api('training-programs/training-setup-data/', 'GET');
  if (!response.ok) throw new Error('Failed to fetch training setup data.');
  return response.json();
};

export const createProgramRequest = async (data) => {
  const tranformedData = camelToSnake(data);
  console.log({ tranformedData });
  const response = await api(
    'training-programs/create-program/',
    'POST',
    tranformedData,
  );
  if (!response.ok) throw new Error('Failed to create program.');
  return response.json();
};
