export const firstAndLast = (str: string, chars = 8): string =>
  str && str.slice(0, chars) + '...' + str.slice(-chars);

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
