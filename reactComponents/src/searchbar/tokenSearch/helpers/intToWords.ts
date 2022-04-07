export function intToWords(int) {
  if (typeof int !== 'number') {
    int = Number(int);
  }
  if (isNaN(int)) {
    return '?';
  }
  if (int < 1e6) {
    return '$' + Math.round(int).toLocaleString();
  }
  if (int < 1e9) {
    return '$' + Math.round(int / 1e5) / 10 + ' Million';
  }
  return '$' + Math.round(int / 1e8) / 10 + ' Billion';
}
