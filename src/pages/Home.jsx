import React, { useState, useEffect } from "react";
import { apiFetch } from "../api";
import { Link } from "react-router-dom";

// Функции-помощники для сравнения дат
function isToday(dateString) {
  const today = new Date();
  const eventDate = new Date(dateString);
  return (
    eventDate.getFullYear() === today.getFullYear() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getDate() === today.getDate()
  );
}

function isTomorrow(dateString) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const eventDate = new Date(dateString);
  return (
    eventDate.getFullYear() === tomorrow.getFullYear() &&
    eventDate.getMonth() === tomorrow.getMonth() &&
    eventDate.getDate() === tomorrow.getDate()
  );
}

function isThisWeekend(dateString) {
  // Для простоты считаем, что выходные — это суббота/воскресенье текущей недели
  const eventDate = new Date(dateString);
  const day = eventDate.getDay(); // 0 - воскресенье, 6 - суббота
  return day === 0 || day === 6;
}

export default function Home() {
  // Здесь в каждом объекте есть поле category и дата в формате YYYY-MM-DD
  const [events, setEvents] = useState([]);

  useEffect(() => {
    apiFetch("/events/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load events");
        return res.json();
      })
      .then((data) => setEvents(data))
      .catch(console.error);
  }, []);

  // Получаем текущую дату для отображения
  const today = new Date();
  const daysOfWeek = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
  const dayName = daysOfWeek[today.getDay()];
  const options = { day: "numeric", month: "long" };
  const formattedDate = today.toLocaleDateString("ru-RU", options);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-2">Что происходит в Москве</h1>
      <p className="text-gray-600 mb-6">Сегодня, {dayName}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="space-y-6">
            {events.map((event) => {
              const formattedTime = new Date(event.date).toLocaleTimeString("ru-RU", { hour: '2-digit', minute: '2-digit' });
              return (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg p-4 flex items-start justify-between gap-4 shadow-sm hover:shadow transition">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-400">{formattedTime}</div>
                      <h2 className="text-lg font-semibold mb-1 truncate">{event.title}</h2>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <span role="img" aria-label="Организатор">👤</span>
                        <span>Организатор: {event.organizer.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span role="img" aria-label="Локация">📍</span>
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex mt-2 -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white" />
                        <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white" />
                        <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white" />
                        <span className="text-xs text-gray-500 ml-2">+361</span>
                      </div>
                    </div>
                    <img
                      src={event.cover_image_url}
                      alt={event.title}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <aside className="hidden md:block sticky top-8 space-y-4">
          <div className="bg-white rounded-lg p-4 shadow text-center">
            <div className="w-12 h-12 rounded-full mx-auto bg-teal-500 text-white flex items-center justify-center text-2xl">🌇</div>
            <h3 className="text-lg font-semibold mt-2">Москва</h3>
            <p className="text-sm text-gray-600">Следите за лучшими событиями в Москве и получайте уведомления первыми.</p>
            <button className="mt-4 w-full py-2 bg-gray-100 text-gray-600 rounded">Подписаны</button>
          </div>
          <img src="/moscow-map-placeholder.png" alt="Москва" className="rounded-lg shadow" />
        </aside>
      </div>
    </div>
  );
}