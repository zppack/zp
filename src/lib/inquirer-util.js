export const filterTrim = value => value.trim();

export const validateRequired = tips => value => !!value || tips;

export default {
  filterTrim,
  validateRequired,
};
