import React, { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useParams, Link } from "react-router-dom";
import EventCard from "../components/EventCard";
import CanvasTheme from "../components/CanvasTheme";
import { formatEventDateTime } from '../utils/dateUtils';

export default function EventOverview() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    apiFetch(`/events/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Не удалось загрузить событие");
        return res.json();
      })
      .then(data => setEvent(data))
      .catch(console.error);
  }, [id]);

  if (!event) return <div className="p-4">Loading…</div>;

  return (
    <>
        <EventCard event={event} />
      <div className="max-w-4xl mx-auto  p-6 space-y-6">
        {/* Header: название + кнопка редактирования */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <Link
            to={`/events/${id}/edit`}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Редактировать мероприятие
          </Link>
        </div>

        {/* Основная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold">Когда и Где</h2>
            <p className="mt-2">
              {formatEventDateTime(event.start_datetime, event.end_datetime)}
            </p>
            <p className="mt-2">
              {event.online_link || <span className="italic text-gray-500">Место проведения не указано</span>}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Подробности</h2>
            <p className="mt-2">{event.description || "-"}</p>
          </div>
        </div>

        {/* Действия */}
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">Пригласить гостей</button>
          <button className="px-4 py-2 bg-purple-500 text-white rounded">Рассылка</button>
          <button className="px-4 py-2 bg-pink-500 text-white rounded">Поделиться мероприятием</button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={() => {
              if (window.confirm("Вы уверены, что хотите удалить это мероприятие?")) {
                apiFetch(`/events/${id}`, { method: 'DELETE' })
                  .then(() => window.location.href = "/")
                  .catch(err => alert("Ошибка удаления мероприятия"));
              }
            }}
          >
            Удалить мероприятие
          </button>
        </div>
      </div>
    </>
  );
}