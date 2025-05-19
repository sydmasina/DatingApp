export function formatToDateOnly(date: string): string {
  const dateToFormat = new Date(date);

  if (dateToFormat.toString() == 'Invalid Date') {
    throw new Error('Invalid Date');
  }

  const year = dateToFormat.getFullYear();
  const month = String(dateToFormat.getMonth() + 1).padStart(2, '0');
  const day = String(dateToFormat.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // "yyyy-MM-dd"
}
