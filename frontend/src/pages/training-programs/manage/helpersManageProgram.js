import { api, camelToSnake } from '@/utils';

export const fetchTrainingSetupData = async () => {
  const response = await api('training-programs/training-setup-data/', 'GET');
  if (!response.ok) throw new Error('Failed to fetch training setup data.');
  return response.json();
};

export const fetchTrainingProgramData = async (programId) => {
  const response = await api(`training-programs/${programId}/`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch training program data.');
  return response.json();
};

export const checkUserHasCurrentProgram = async (userId) => {
  const tranformedData = camelToSnake(userId);
  const response = await api(
    'training-programs/has-active/',
    'POST',
    tranformedData,
  );
  if (!response.ok) throw new Error('Failed to check for current programs.');
  return response.json();
};

export const saveProgram = async (data, id = null) => {
  const tranformedData = camelToSnake(data);

  try {
    const isEditMode = Boolean(id);
    let response;

    if (isEditMode) {
      response = await api(`training-programs/${id}/`, 'PATCH', tranformedData);
    } else {
      response = await api('training-programs/', 'POST', tranformedData);
    }

    if (!response.ok) {
      const errorData = await response.json();

      const key = Object.keys(errorData)[0];
      const errorMessage = errorData[key]?.[0] || 'Something went wrong';

      return {
        type: 'error',
        text: errorMessage,
      };
    }

    return {
      type: 'success',
      text: 'Program created successfully!',
    };
  } catch (error) {
    return {
      type: 'error',
      text: 'An unexpected error occurred. Please try again later.',
    };
  }
};

export const fetchTemplates = async () => {
  const response = await api('training-programs/templates/', 'GET');
  if (!response.ok) throw new Error('Failed to fetch templates.');
  return response.json();
};
