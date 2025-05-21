export const getChangedFields = (initData, updatedData) => {
  const changedFields = {};
  for (const key in initData) {
    const initial = initData[key];
    const updated = updatedData[key];

    if (Array.isArray(initial) && Array.isArray(updated)) {
      if (
        initial.length !== updated.length ||
        !initial.every((val, i) =>
          typeof val === 'object'
            ? JSON.stringify(val) === JSON.stringify(updated[i])
            : val === updated[i],
        )
      ) {
        changedFields[key] = updated;
      }
    } else if (initial !== updated) {
      changedFields[key] = updated;
    }
  }
  return changedFields;
};
