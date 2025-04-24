import { DefaultForm } from './';

export const AddForm = ({
  muscleGroups,
  submittedNewExerciseData,
  message,
}) => {
  return (
    <DefaultForm
      submittedExerciseData={submittedNewExerciseData}
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
