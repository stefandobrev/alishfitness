export const snakeToCamel = (obj) => {
  if (!obj) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => snakeToCamel(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      acc[camelKey] = snakeToCamel(obj[key]);
      return acc;
    }, {});
  }

  return obj;
};

export const camelToSnake = (obj) => {
  if (!obj) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => camelToSnake(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`,
      );
      acc[snakeKey] = camelToSnake(obj[key]);
      return acc;
    }, {});
  }

  return obj;
};
