import { api, camelToSnake, camelToSnakeStr } from '@/utils';

export const fetchTrainingProgramData = async (
  trainingProgramsFilteredData,
) => {
  const transformedData = {
    ...camelToSnake(trainingProgramsFilteredData),
    sort_config: trainingProgramsFilteredData.sortConfig?.map(
      ({ key, direction }) => ({
        key: camelToSnakeStr(key),
        direction,
      }),
    ),
  };

  const response = await api(
    'training-programs/filtered/',
    'POST',
    transformedData,
  );
  if (!response.ok) throw new Error('Failed to fetch training programs data.');
  return response.json();
};

export const fetchTrainingFilterData = async () => {
  const response = await api('training-programs/filter-data/', 'GET');
  if (!response.ok)
    throw new Error('Failed to fetch training programs filter data.');
  return response.json();
};

export const deleteProgram = async (id) => {
  try {
    const response = await api(`training-programs/${id}/`, 'DELETE');
    if (!response.ok) {
      return {
        type: 'error',
        text: 'Failed to delete the program.',
      };
    }

    return {
      type: 'success',
      text: 'Program deleted successfully!',
    };
  } catch (error) {
    return {
      type: 'error',
      text: 'Something went wrong.',
    };
  }
};
