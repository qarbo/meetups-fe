import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";

export default function CreateEvent() {
  const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [calendarType, setCalendarType] = useState("personal");
  const [visibility, setVisibility] = useState("public");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [tickets, setTickets] = useState("free");
  const [requireApproval, setRequireApproval] = useState(false);
  const [capacity, setCapacity] = useState("");
  const [image, setImage] = useState(null);
  const [timezone, setTimezone] = useState(detectedTimeZone);

  const commonTimeZones = [
    "UTC",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Moscow",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Asia/Kolkata",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Australia/Sydney",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      calendarType,
      visibility,
      title,
      startDate,
      startTime,
      endDate,
      endTime,
      location,
      description,
      tickets,
      requireApproval,
      capacity,
      image,
      timezone,
    };
    console.log("Создано мероприятие:", newEvent);
    // Здесь можно добавить логику отправки на сервер
  };

  return (
    <div className="min-h-screen p-6 bg-[#FFFFFF] text-[#1A1A1A]">
      <div className="max-w-5xl mx-auto bg-white rounded-xl p-6 shadow-md flex gap-6 items-start">
        {/* Левый столбец: изображение и выбор календаря */}
        <div className="w-1/2 max-w-sm flex flex-col gap-4">
          {/* Верхняя панель с выбором календаря и публичности */}
          <div className="flex justify-between">
            <select
              className="rounded px-2 py-1 bg-[#F5F5F5] text-[#1A1A1A] placeholder:text-[#999999] ring-1 ring-[#E5E5E5]"
              value={calendarType}
              onChange={(e) => setCalendarType(e.target.value)}
            >
              <option value="personal">Личный календарь</option>
              <option value="work">Рабочий календарь</option>
            </select>

            <select
              className="rounded px-2 py-1 bg-[#F5F5F5] text-[#1A1A1A] placeholder:text-[#999999] ring-1 ring-[#E5E5E5]"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="public">Публичное</option>
              <option value="private">Приватное</option>
            </select>
          </div>

          {/* Загрузка изображения */}
          <div>
            <label className="block text-sm mb-1">
              Изображение для мероприятия
            </label>
            <div className="relative w-full">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-full h-64 object-cover rounded shadow-sm"
                />
              ) : (
                <div className="w-full h-64 bg-[#EFEFEF] flex items-center justify-center rounded shadow-sm">
                  <span className="text-[#999999] text-sm">Нет изображения</span>
                </div>
              )}
              <label className="absolute bottom-2 right-2 cursor-pointer bg-[#F5F5F5] text-[#1A1A1A] p-2 rounded-full ring-1 ring-[#E5E5E5] hover:bg-[#E0E0E0]">
                <FaUpload />
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
        </div>

        {/* Правый столбец: все остальные поля формы */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-2">
          {/* Название события */}
          <div>
            <label className="block text-sm mb-1">Название события</label>
            <input
              type="text"
              className="w-full rounded bg-[#F5F5F5] text-[#1A1A1A] placeholder:text-[#999999] px-3 py-2 ring-1 ring-[#E5E5E5]"
              placeholder="Название события"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Дата и время начала и окончания */}
          <div>
            <label className="block text-sm mb-1">Дата и время</label>
            <div className="flex rounded bg-[#F5F5F5] shadow ring-1 ring-[#E5E5E5]">
              {/* Left labels */}
              <div className="flex flex-col justify-center items-center px-4 py-3 space-y-8 border-r border-[#E5E5E5] min-w-[60px]">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#1A1A1A]"></div>
                  <span className="text-sm text-gray-500">Start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#1A1A1A]"></div>
                  <span className="text-sm text-gray-500">End</span>
                </div>
              </div>

              {/* Middle date/time inputs */}
              <div className="flex flex-col justify-center px-4 py-3 space-y-2 flex-1">
                {/* Start row */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    className="rounded bg-white px-3 py-2 ring-1 ring-[#E5E5E5] text-[#1A1A1A]"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <input
                    type="time"
                    className="rounded bg-white px-3 py-2 ring-1 ring-[#E5E5E5] text-[#1A1A1A]"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                {/* End row */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    className="rounded bg-white px-3 py-2 ring-1 ring-[#E5E5E5] text-[#1A1A1A]"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <input
                    type="time"
                    className="rounded bg-white px-3 py-2 ring-1 ring-[#E5E5E5] text-[#1A1A1A]"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Right timezone selector */}
              <div className="flex flex-col justify-center items-center px-4 py-3 border-l border-[#E5E5E5] min-w-[80px] text-sm text-gray-500">
                <select
                  className="bg-[#F5F5F5] text-[#1A1A1A] rounded px-2 py-1 ring-1 ring-[#E5E5E5]"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  {commonTimeZones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Локация */}
          <div>
            <label className="block text-sm mb-1">Место проведения</label>
            <input
              type="text"
              className="w-full rounded bg-[#F5F5F5] text-[#1A1A1A] placeholder:text-[#999999] px-3 py-2 ring-1 ring-[#E5E5E5]"
              placeholder="Офлайн место или ссылка для онлайн"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm mb-1">Описание</label>
            <textarea
              className="w-full rounded bg-[#F5F5F5] text-[#1A1A1A] placeholder:text-[#999999] px-3 py-2 ring-1 ring-[#E5E5E5]"
              placeholder="Дополнительная информация"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Опции события */}
          <div className="border-t pt-4 space-y-4 border-[#E5E5E5]">
            {/* Билеты */}
            <div className="flex items-center justify-between">
              <label className="block text-sm mb-1">Билеты</label>
              <select
                className="rounded px-2 py-1 bg-[#F5F5F5] text-[#1A1A1A] placeholder:text-[#999999] ring-1 ring-[#E5E5E5]"
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
                <div className="w-11 h-6 bg-[#E5E5E5] rounded-full peer peer-focus:ring-2 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A1A1A] border border-[#E5E5E5]"></div>
              </label>
            </div>

            {/* Вместимость */}
            <div className="flex items-center justify-between">
              <label className="block text-sm mb-1">Вместимость</label>
              <input
                type="text"
                className="w-24 rounded bg-[#F5F5F5] text-[#1A1A1A] placeholder:text-[#999999] px-3 py-1 ring-1 ring-[#E5E5E5]"
                placeholder="Без ограничения"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>

          {/* Кнопка создания */}
          <button
            type="submit"
            className="w-full bg-white text-[#1A1A1A] py-2 rounded ring-1 ring-[#E5E5E5] shadow-sm hover:bg-[#F5F5F5]"
          >
            Создать событие
          </button>
        </form>
      </div>
    </div>
  );
}