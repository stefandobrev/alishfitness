import { api, camelToSnake } from '@/utils';

export const fetchMuscleGroups = async () => {
  const response = await api('exercises/muscle-groups/', 'GET');
  if (!response.ok) throw new Error('Failed to fetch muscle groups.');
  const data = await response.json();
  return data;
};

export const fetchExerciseTitles = async (filterData) => {
  const transformedData = camelToSnake(filterData);
  const response = await api(
    'exercises/exercise-titles/',
    'POST',
    transformedData,
  );
  if (!response.ok) throw new Error('Failed to fetch exercise titles.');
  const data = await response.json();
  return data;
};

export const fetchExerciseData = async (id) => {
  const response = await api(`exercises/${id}/`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch exercise data.');
  const data = await response.json();
  return data;
};

export const saveExercise = async (exerciseData, id = null) => {
  const transformedData = camelToSnake(exerciseData);

  try {
    const isEditMode = Boolean(id);
    let response;

    if (isEditMode) {
      response = await api(`exercises/${id}/`, 'PATCH', transformedData);
    } else {
      response = await api('exercises/', 'POST', transformedData);
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

    const successMessage = isEditMode
      ? 'Exercise updated successfully!'
      : 'Exercise created successfully!';

    return {
      type: 'success',
      text: successMessage,
    };
  } catch (error) {
    return {
      type: 'error',
      text: 'An unexpected error occurred. Please try again later.',
    };
  }
};

export const deleteExercise = async (id) => {
  try {
    const response = await api(`exercises/${id}/`, 'DELETE');
    if (!response.ok) {
      return {
        type: 'error',
        text: 'Failed to delete the exercise.',
      };
    }

    return {
      type: 'success',
      text: 'Exercise deleted successfully!',
    };
  } catch (error) {
    return {
      type: 'error',
      text: 'Something went wrong',
    };
  }
};
