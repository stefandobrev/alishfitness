const repPercentage = (reps) => {
  if (reps <= 3) return 0.93;
  if (reps <= 5) return 0.87;
  return 0.8;
};

export const epleyFormula = (prevWeightValue, prevRepValue) => {
  const oneRM = prevWeightValue * (1 + 0.0333 * prevRepValue);
  return Math.round(oneRM * repPercentage(prevRepValue));
};
