export const createDateTimeFormatter = (locale: string) => {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};
