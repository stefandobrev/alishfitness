// Transforms set logs inputs into integers/decimals. Type is part of the input in onBlur
export const sanitizeInputValue = (val, type) => {
  if (val === null || val === '' || val === undefined) return null;
  if (type === 'integer') return parseInt(val, 10) || 0;
  return parseFloat(String(val).replace(',', '.')) || 0;
};

export const shouldSaveField = (currentValue, originalValue, type) => {
  const sanitized = sanitizeInputValue(currentValue, type);
  return sanitized !== originalValue;
};
