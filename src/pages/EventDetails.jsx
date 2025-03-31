import React from "react";
import { useParams } from "react-router-dom";

export default function EventDetails() {
  const { id } = useParams();

  // Пример — в реальности ты бы получала данные с бэка
  const event = {
    id,
    title: "Фото-прогулка по Москве",
    date: "2025-04-10",
    time: "12:00",
    location: "ВДНХ, Москва",
    organizer: "Анна Петрова",
    description: `
      Присоединяйтесь к дружеской прогулке с фотоаппаратами! 📷<br/>
      Мы исследуем парк ВДНХ, пообщаемся, попрактикуем фотографию и обменяемся идеями.
    `,
    image: "https://source.unsplash.com/800x400/?moscow,park",
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-64 object-cover rounded mb-4"
      />

      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>

      <div className="text-gray-600 mb-4">
        <p>
          <strong>Дата:</strong> {event.date} в {event.time}
        </p>
        <p>
          <strong>Место:</strong> {event.location}
        </p>
        <p>
          <strong>Организатор:</strong> {event.organizer}
        </p>
      </div>

      <div
        className="prose prose-sm text-gray-800 mb-6"
        dangerouslySetInnerHTML={{ __html: event.description }}
      />

      <button className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700">
        Принять участие
      </button>
    </div>
  );
}