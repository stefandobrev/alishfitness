const mapSessionData = ({ id, exercises, sessionTitle }, i) => {
  const tempId = (i + 1).toString(); // tempId assignment starts from 1
  return {
    id,
    exercises: exercises.map(mapExerciseData),
    sessionTitle,
    tempId,
  };
};

const mapExerciseData = ({
  id,
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
    id,
    sequence,
    sets: sets.toString(), // Backend returns int for sets
    reps,
  };
};

export const mapTrainingProgramData = (initialData) => {
  const {
    programTitle,
    mode,
    sessions,
    scheduleData,
    activationDate,
    assignedUser,
  } = initialData;

  const formattedSessions = sessions.map(mapSessionData);

  const sessionIdOrder = scheduleData;

  const sortedSessions = [...formattedSessions].sort(
    (a, b) => sessionIdOrder.indexOf(a.id) - sessionIdOrder.indexOf(b.id),
  );

  // Assign session ids as keys to tempId values from formattedSessions and replace the values
  // within scheduleData with str tempIds that match

  const sessionIdMap = Object.fromEntries(
    formattedSessions.map((s) => [s.id, s.tempId]),
  );

  const formattedScheduleData = scheduleData.map((realId) => ({
    tempId: sessionIdMap[realId],
    realId: realId,
  }));

  // Conditionals to apply null for activationDate and assignedUser on Template program mode.
  const formattedUser =
    mode === 'assigned'
      ? {
          label: `${assignedUser.lastName}, ${assignedUser.firstName} (${assignedUser.username})`,
          value: assignedUser.id,
        }
      : null;

  const formattedActivationDate =
    mode === 'assigned' ? new Date(activationDate) : null;
  return {
    programTitle,
    mode,
    sessions: sortedSessions,
    scheduleData: formattedScheduleData,
    activationDate: formattedActivationDate,
    assignedUser: formattedUser,
  };
};
