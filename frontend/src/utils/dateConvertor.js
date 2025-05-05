export const toUtcMidnightDateString = (date) => {
  if (!date) return null;
  const utc = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  return utc.toISOString().split('T')[0];
};
