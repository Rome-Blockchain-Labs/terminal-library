export const firstAndLast = (str, chars = 8) =>
  str && str.slice(0, chars) + '...' + str.slice(-chars);

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
