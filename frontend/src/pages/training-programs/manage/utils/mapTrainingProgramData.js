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
}) => ({
  muscleGroupInput: isCustomMuscleGroup ? 'custom' : muscleGroupSlug,
  exerciseInput: isCustomMuscleGroup ? customExerciseTitle : exerciseSlug,
  id,
  sequence,
  sets: sets.toString(), // Backend returns ints
  reps,
});

export const mapTrainingProgramData = (initialData) => {
  const {
    programTitle,
    mode,
    sessions,
    scheduleData,
    activationDate,
    assignedUser,
  } = initialData;

  /* Assign session tempId to the rest of the attributes and
  order session according to their position in scheduleData */
  const flatScheduleData = scheduleData.flatMap((obj) => obj.sessionId);

  const sortedSessions = [...sessions]
    .map(mapSessionData)
    .sort(
      (a, b) => flatScheduleData.indexOf(a.id) - flatScheduleData.indexOf(b.id),
    );

  /* Assign session ids as keys to tempId values from formattedSessions and replace the values
   within scheduleData with str tempIds that match */
  const sessionIdMap = Object.fromEntries(
    sortedSessions.map((s) => [s.id, s.tempId]),
  );

  const formattedScheduleData = flatScheduleData.map((realId) => ({
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
