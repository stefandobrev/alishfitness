export const getChangedFields = (initData, updatedData) => {
  const changedFields = {};
  for (const key in initData) {
    if (Array.isArray(initData[key]) && Array.isArray(updatedData[key])) {
      if (
        initData[key].length !== updatedData[key].length ||
        !initData[key].every((val, index) => val === updatedData[key][index])
      ) {
        changedFields[key] = updatedData[key];
      }
    } else if (initData[key] !== updatedData[key]) {
      changedFields[key] = updatedData[key];
    }
  }
  return changedFields;
};
