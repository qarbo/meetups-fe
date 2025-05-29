export function formatEventDateTime(start_datetime, end_datetime) {
    const startDate = new Date(start_datetime);
    const endDate = new Date(end_datetime);
    const options = { weekday: 'long', month: 'long', day: 'numeric', locale: 'ru-RU' }; // Формат: день недели, месяц, число на русском
  
    if (startDate.toLocaleDateString('ru-RU') === endDate.toLocaleDateString('ru-RU')) {
      return `${startDate.toLocaleDateString('ru-RU', options)}, ${startDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} – ${endDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${startDate.toLocaleDateString('ru-RU', options)}, ${startDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} – ${endDate.toLocaleDateString('ru-RU', options)}, ${endDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    }
  }