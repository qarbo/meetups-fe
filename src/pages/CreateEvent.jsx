import React, { useState } from "react";

export default function CreateEvent() {
  const [calendarType, setCalendarType] = useState("personal");
  const [visibility, setVisibility] = useState("public");
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState("minutes");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [tickets, setTickets] = useState("free");
  const [requireApproval, setRequireApproval] = useState(false);
  const [capacity, setCapacity] = useState("");
  const [image, setImage] = useState(null); // Стейт для изображения

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      calendarType,
      visibility,
      title,
      start,
      duration,
      durationUnit,
      location,
      description,
      tickets,
      requireApproval,
      capacity,
      image, // Можно отправить сам файл или его имя на сервер
    };
    console.log("Создано мероприятие:", newEvent);
    // Здесь можно добавить логику отправки на сервер
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto bg-gray-100 rounded-xl p-4 space-y-4">
        {/* Верхняя панель с выбором календаря и публичности */}
        <div className="flex justify-between">
          <select
            className="rounded px-2 py-1"
            value={calendarType}
            onChange={(e) => setCalendarType(e.target.value)}
          >
            <option value="personal">Личный календарь</option>
            <option value="work">Рабочий календарь</option>
          </select>

          <select
            className="rounded px-2 py-1"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Публичное</option>
            <option value="private">Приватное</option>
          </select>
        </div>

        {/* Форма создания события */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Загрузка изображения */}
          <div>
            <label className="block text-sm mb-1">
              Изображение для мероприятия
            </label>
            <div className="flex items-center gap-2">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded">
                  <span className="text-gray-500 text-sm">
                    Нет изображения
                  </span>
                </div>
              )}
              <label className="cursor-pointer bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400">
                Выбрать файл
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setImage(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Название события */}
          <div>
            <label className="block text-sm mb-1">Название события</label>
            <input
              type="text"
              className="w-full rounded bg-gray-100 px-3 py-2"
              placeholder="Название события"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Дата и время начала */}
          <div>
            <label className="block text-sm mb-1">
              Дата и время начала
            </label>
            <input
              type="datetime-local"
              className="w-full rounded px-3 py-2"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>

          {/* Продолжительность */}
          <div>
            <label className="block text-sm mb-1">Продолжительность</label>
            <div className="flex gap-2">
              <input
                type="number"
                className="w-full rounded px-3 py-2"
                placeholder="Введите число"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <select
                className="rounded px-2 py-1"
                value={durationUnit}
                onChange={(e) => setDurationUnit(e.target.value)}
              >
                <option value="minutes">Минут</option>
                <option value="hours">Часов</option>
              </select>
            </div>
          </div>

          {/* Локация */}
          <div>
            <label className="block text-sm mb-1">Место проведения</label>
            <input
              type="text"
              className="w-full rounded px-3 py-2"
              placeholder="Офлайн место или ссылка для онлайн"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm mb-1">Описание</label>
            <textarea
              className="w-full rounded px-3 py-2"
              placeholder="Дополнительная информация"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Опции события */}
          <div className="border-t pt-4 space-y-4">
            {/* Билеты */}
            <div className="flex items-center justify-between">
              <label className="block text-sm mb-1">Билеты</label>
              <select
                className="rounded px-2 py-1"
                value={tickets}
                onChange={(e) => setTickets(e.target.value)}
              >
                <option value="free">Бесплатно</option>
                <option value="paid">Платно</option>
              </select>
            </div>

            {/* Требуется подтверждение */}
            <div className="flex items-center justify-between">
              <label className="block text-sm mb-1">
                Требуется подтверждение
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={requireApproval}
                  onChange={(e) => setRequireApproval(e.target.checked)}
                />
                <div className="w-11 h-6 bg-green-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-green-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            {/* Вместимость */}
            <div className="flex items-center justify-between">
              <label className="block text-sm mb-1">Вместимость</label>
              <input
                type="text"
                className="w-24 rounded px-3 py-1"
                placeholder="Без ограничения"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>

          {/* Кнопка создания */}
          <button
            type="submit"
            className="w-full bg-gray-300 py-2 rounded hover:bg-gray-400"
          >
            Создать событие
          </button>
        </form>
      </div>
    </div>
  );
}