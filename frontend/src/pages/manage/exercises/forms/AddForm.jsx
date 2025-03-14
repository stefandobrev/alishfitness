import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import { saveExercise } from '../helpersManageExercises';
import { DefaultForm } from './DefaultForm';

const AddForm = ({ muscleGroups, onExerciseAdded }) => {
  const { reset } = useFormContext();
  const [message, setMessage] = useState(null);

  const onSubmit = async (submittedExerciseData) => {
    const response = await saveExercise(submittedExerciseData);
    const { type, text } = response;

    if (type === 'error') {
      setMessage({ type, text });
      return;
    }

    if (type === 'success') {
      toast.success(text);
      onExerciseAdded();
      reset();
      reset({
        steps: [],
        mistakes: [],
      });
      setMessage(null);
    }
  };

  return (
    <DefaultForm
      submittedExerciseData={onSubmit}
      muscleGroups={muscleGroups}
      message={message}
      title={
        <h2 className='sticky top-0 z-10 mb-3 bg-white px-2 text-start text-2xl font-semibold'>
          Add Exercise
        </h2>
      }
    />
  );
};

export default AddForm;
