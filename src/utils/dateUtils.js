import i18next from 'i18next';

export function formatEventDateTime(start_datetime, end_datetime) {
    const startDate = new Date(start_datetime);
    const endDate = new Date(end_datetime);
    const locale = i18next.language;
    const options = { weekday: 'long', month: 'long', day: 'numeric' }; // Формат: день недели, месяц, число

    if (startDate.toLocaleDateString(locale) === endDate.toLocaleDateString(locale)) {
      return `${startDate.toLocaleDateString(locale, options)}, ${startDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })} – ${endDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${startDate.toLocaleDateString(locale, options)}, ${startDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })} – ${endDate.toLocaleDateString(locale, options)}, ${endDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`;
    }
}

export function formatEventParts(start_datetime, end_datetime) {
  const startDate = new Date(start_datetime);
  const endDate = new Date(end_datetime);

  const locale = i18next.language;
  const weekday = startDate.toLocaleDateString(locale, { weekday: 'long' });
  const month = startDate.toLocaleDateString(locale, { month: 'long' });
  const day = startDate.getDate();
  const startTime = startDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  const endTime = endDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

  return { weekday, month, day, startTime, endTime };
}