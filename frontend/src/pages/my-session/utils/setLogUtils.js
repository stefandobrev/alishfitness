// Flatten nested structure into simple key-value pairs
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

// Converts all fields to string.Initial empty set logs are null.
export const normalizeValues = (obj) => {
  const normalized = {};
  for (const key in obj) {
    normalized[key] = {};
    for (const field in obj[key]) {
      normalized[key][field] =
        obj[key][field] === null ? '' : String(obj[key][field]);
    }
  }
  return normalized;
};
