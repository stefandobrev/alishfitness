const mapSessionData = ({ id, exercises, sessionTitle }, i) => {
  const tempId = (i + 1).toString();
  return {
    id,
    exercises: exercises.map(mapExerciseData),
    sessionTitle,
    tempId,
  };
};

const mapExerciseData = ({
  sequence,
  sets,
  reps,
  isCustomMuscleGroup,
  muscleGroupSlug,
  exerciseSlug,
  customExerciseTitle,
}) => {
  let muscleGroupExerciseRelation = {
    muscleGroupInput: muscleGroupSlug,
    exerciseInput: exerciseSlug,
  };
  if (isCustomMuscleGroup) {
    muscleGroupExerciseRelation = {
      muscleGroupInput: 'custom',
      exerciseInput: customExerciseTitle,
    };
  }
  return {
    ...muscleGroupExerciseRelation,
    sequence,
    sets: sets.toString(),
    reps,
  };
};

export const mapTrainingProgramData = (initialData) => {
  const {
    programTitle,
    mode,
    sessions,
    scheduleArray,
    activationDate,
    assignedUser,
  } = initialData;

  const formattedUser = {
    label: `${assignedUser.lastName}, ${assignedUser.firstName} (${assignedUser.username})`,
    value: assignedUser.id,
  };

  const formattedSessions = sessions.map(mapSessionData);

  const formattedActivationDate = new Date(activationDate);
  return {
    programTitle,
    mode,
    sessions: formattedSessions,
    scheduleArray,
    activationDate: formattedActivationDate,
    assignedUser: formattedUser,
  };
};
