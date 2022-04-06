export const firstAndLast = (str, chars = 8) =>
  str && str.slice(0, chars) + '...' + str.slice(-chars);
