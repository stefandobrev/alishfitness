export const flattenSetLogsArray = (setLogsArray) => {
  const flat = {};
  setLogsArray.forEach(({ id, weight, reps, sequence, setNumber }) => {
    const key = `${sequence}_${setNumber}`;
    flat[key] = { id, weight, reps };
  });
  return flat;
};

export const flattenSetLogs = (setLogData) => {
  const flat = {};
  for (const sequence in setLogData) {
    const sets = setLogData[sequence].sets;
    for (const setNumber in sets) {
      const key = `${sequence}_${setNumber}`;
      flat[key] = sets[setNumber];
    }
  }
  return flat;
};
