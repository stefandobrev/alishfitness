// Compares basic key-value fields in any two objects (used at all levels)
export const getChangedFields = (initData, updatedData) => {
  const changedFields = {};
  for (const key in initData) {
    const initial = initData[key];
    const updated = updatedData[key];
    if (!isEqual(initial, updated)) {
      changedFields[key] = updated;
    }
  }
  return changedFields;
};

// Deep comparison between values - supports nested objects and arrays
const isEqual = (a, b) => {
  if (typeof a !== typeof b) return false;
  if (
    typeof a !== 'object' ||
    a === null ||
    typeof b !== 'object' ||
    b === null
  )
    return a === b; // Bool comparison of values if neither is object or null
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => isEqual(a[key], b[key])); // Recursively compare
};

// Compares TrainingPrograms along with nested sessions and exercises
export const getChangedProgramFields = (initData, updatedData) => {
  // Excluding sessions otherwise if there is one value within the nested structure changed,
  // returns all sessions
  const changedFields = getChangedFields(
    { ...initData, sessions: undefined },
    { ...updatedData, sessions: undefined },
  );

  if ('sessions' in initData && 'sessions' in updatedData) {
    const sessionChanges = [];

    updatedData.sessions.forEach((session) => {
      // Find matching session by ID from initial data
      const initSession = initData.sessions.find((s) => s.id === session.id);
      if (!initSession) {
        sessionChanges.push(session); // New session - push fully
        return;
      }

      // Compare session properties (excluding exercises to avoid the nested issue)
      const sessionPropsChanged = getChangedFields(
        { ...initSession, exercises: undefined },
        { ...session, exercises: undefined },
      );

      // Compare exercises by ID, collect those that changed or are new as array
      const updatedExercises = session.exercises.filter((exercise) => {
        const initExercise = initSession.exercises.find(
          (e) => e.id === exercise.id,
        );
        return !initExercise || !isEqual(exercise, initExercise);
      });

      // Bool detection of deleted exercises by comparing initial with updated
      const deletedExerciseIds = initSession.exercises
        .filter((ex) => !session.exercises.some((e) => e.id === ex.id))
        .map((ex) => ex.id); // Returns only erased exercises' ids

      // Only store the session if anything changed
      if (
        Object.keys(sessionPropsChanged).length ||
        updatedExercises.length ||
        deletedExerciseIds.length
      ) {
        const sessionChange = {
          id: session.id,
          ...sessionPropsChanged, // Include any changed session properties
        };

        // Only add exercises array if there are exercise changes
        if (updatedExercises.length) {
          sessionChange.exercises = updatedExercises;
        }

        // Only add deletedExerciseIds if there are deleted exercises
        if (deletedExerciseIds.length) {
          sessionChange.deletedExerciseIds = deletedExerciseIds;
        }

        sessionChanges.push(sessionChange);
      }
    });

    // Find any deleted sessions (present initially but missing in updated)
    const deletedSessionIds = initData.sessions.filter(
      (initSession) =>
        !updatedData.sessions.some((s) => s.id === initSession.id),
    );

    // Include deleted session IDs if any
    if (deletedSessionIds.length) {
      changedFields.deletedSessionIds = deletedSessionIds.map((s) => s.id);
    }

    // Include session changes if any
    if (sessionChanges.length) {
      changedFields.sessions = sessionChanges;
    }
  }

  return changedFields;
};
