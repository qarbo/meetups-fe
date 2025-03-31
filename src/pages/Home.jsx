import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const events = [
    {
      id: 1,
      title: "Семинар Web-дизайна",
      date: "4 мая",
      location: "м. Охотный Ряд",
      image: "https://cdnwebkul.webkul.com/wp-content/uploads/2023/03/Poster-1024x1024.jpeg",
      day: "25",
      month: "Сен"
    },
    {
      id: 2,
      title: "Мастер-класс фотографии",
      date: "4 мая",
      location: "Вавилова 19",
      image: "https://www.masterclass.com/course-images/attachments/12prcdxk3l15fr6dolnnls25n9ga",
      day: "23",
      month: "Авг"
    },
    {
      id: 3,
      title: "Поход по парку",
      date: "10 мая",
      location: "м. Авиамоторная",
      image: "https://nordski.ru/images/blog/kak-splanirovat-byudzhetnyy-pokhod-1.jpg",
      day: "4",
      month: "Мая"
    }
  ];

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
            <Link to="/create"
                className="inline-block bg-teal-600 text-white px-5 py-2 rounded hover:bg-teal-700"
            >
                + Создать мероприятие
            </Link>
        </div>
        

        {/* Популярное */}
        <div>
          <h3 className="text-xl font-bold mb-4">Популярное в вашем районе</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded shadow overflow-hidden">
                <div className="relative">
                  <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
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
              </div>
            ))}
          </div>
        </div>

        {/* Группы */}
        <div>
          <h3 className="text-xl font-bold mb-4">Группы для всех интересов</h3>
          <a href="#\" className="text-teal-600 text-sm hover:underline\">Просмотреть все группы →</a>
          {/* Тут позже добавим карточки групп */}
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
          <button className="bg-teal-600 text-white w-full py-2 rounded hover:bg-teal-700">Зарегистрироваться</button>
        </div>
      </aside>
    </div>
  );
}