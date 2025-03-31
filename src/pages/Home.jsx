import React, { useState } from "react";
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
  const [events] = useState([
    {
      id: 1,
      title: "Семинар Web-дизайна",
      date: "2025-05-04", // год-месяц-день
      location: "м. Охотный Ряд",
      image: "https://cdnwebkul.webkul.com/wp-content/uploads/2023/03/Poster-1024x1024.jpeg",
      day: "25",
      month: "Сен",
      category: "activism",
    },
    {
      id: 2,
      title: "Мастер-класс фотографии",
      date: "2025-05-04",
      location: "Вавилова 19",
      image: "https://www.masterclass.com/course-images/attachments/12prcdxk3l15fr6dolnnls25n9ga",
      day: "23",
      month: "Авг",
      category: "hobbies",
    },
    {
      id: 3,
      title: "Поход по парку",
      date: "2025-05-10",
      location: "м. Авиамоторная",
      image: "https://nordski.ru/images/blog/kak-splanirovat-byudzhetnyy-pokhod-1.jpg",
      day: "4",
      month: "Мая",
      category: "outdoors",
    },
  ]);

  // Список категорий для переключения
  const categories = [
    { label: "Все", value: "all" },
    { label: "Сегодня", value: "today" },
    { label: "Завтра", value: "tomorrow" },
    { label: "Выходные", value: "weekend" },
    { label: "Активизм", value: "activism" },
    { label: "Хобби", value: "hobbies" },
    { label: "Прогулки/походы", value: "outdoors" },
    // Добавляйте свои варианты…
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  // Функция фильтрации
  const filteredEvents = events.filter((event) => {
    switch (selectedCategory) {
      case "all":
        return true;
      case "today":
        return isToday(event.date);
      case "tomorrow":
        return isTomorrow(event.date);
      case "weekend":
        return isThisWeekend(event.date);
      default:
        // Если это одна из "тематических" категорий
        return event.category === selectedCategory;
    }
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Левая основная колонка */}
      <div className="lg:col-span-2 space-y-8">
        {/* Поисковый блок */}
        <div>
          <h2 className="text-3xl font-bold mb-4">Найдите свое следующее мероприятие</h2>
          <div className="flex gap-4 max-w-xl">
            <input
              type="text"
              placeholder="Искать мероприятия"
              className="w-full border rounded px-4 py-2"
            />
            <input
              type="text"
              placeholder="Местоположение"
              className="w-full border rounded px-4 py-2"
            />
            <button className="bg-teal-600 text-white px-6 rounded hover:bg-teal-700">Поиск</button>
          </div>
        </div>

        {/* Создать мероприятие */}
        <div className="mt-4">
          <Link
            to="/create"
            className="inline-block bg-teal-600 text-white px-5 py-2 rounded hover:bg-teal-700"
          >
            + Создать мероприятие
          </Link>
        </div>

        {/* Блок с кнопками-фильтрами */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded ${
                selectedCategory === cat.value
                  ? "bg-teal-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Популярное (или просто список) */}
        <div>
          <h3 className="text-xl font-bold mb-4">Мероприятия</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="bg-white rounded shadow overflow-hidden hover:shadow-md transition block"
              >
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                    <div className="font-bold leading-none text-center">{event.day}</div>
                    <div className="text-xs leading-none">{event.month}</div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-gray-600">{event.location}</p>
                  <p className="text-sm text-gray-600">{event.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Правая колонка */}
      <aside className="space-y-6">
        <div>
          <h3 className="text-lg font-bold mb-2">Недавние события</h3>
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
            <li>24 участника присоединились к «Бег в парке»</li>
            <li>«Книжный клуб» создал новое мероприятие</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">Присоединяйтесь к нам!</h3>
          <button className="bg-teal-600 text-white w-full py-2 rounded hover:bg-teal-700">
            Зарегистрироваться
          </button>
        </div>
      </aside>
    </div>
  );
}