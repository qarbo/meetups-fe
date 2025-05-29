import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import '../styles/calendar.css';

export default function EventCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [popoverDate, setPopoverDate] = useState(null);

  const exampleEvents = {
    "2025-04-05": [
      { title: "Хакатон AI", location: "Москва" },
      { title: "Йога в парке", location: "СПБ" },
    ],
    "2025-04-06": [
      { title: "Концерт Indie-группы", location: "Новосибирск" },
    ],
    "2025-04-08": [
      { title: "Лекция по стартапам", location: "Онлайн" },
    ]
  };

  const formatDate = (date) => date.toISOString().split("T")[0];
  const events = exampleEvents[formatDate(selectedDate)] || [];

  return (
    <div className="max-w-3xl mx-auto relative">
      <h2 className="text-2xl font-bold mb-4">Календарь мероприятий</h2>

      <Calendar
        onChange={(value) => {
          setSelectedDate(value);
          setPopoverDate(null);
        }}
        value={selectedDate}
        className="rounded shadow"
        tileContent={({ date }) => {
          const formatted = formatDate(date);
          const hasEvents = exampleEvents[formatted];
          return hasEvents ? (
            <div className="relative flex justify-center mt-1">
              <button
                className="w-2 h-2 bg-teal-500 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setPopoverDate(formatted === popoverDate ? null : formatted);
                }}
              />
              {popoverDate === formatted && (
                <div className="absolute top-5 z-10 bg-white shadow-md rounded p-2 text-sm w-48">
                  <p className="font-semibold mb-1">События:</p>
                  <ul className="space-y-1">
                    {exampleEvents[formatted].map((ev, idx) => (
                      <li key={idx}>
                        <span className="font-medium">{ev.title}</span><br />
                        <span className="text-gray-500">{ev.location}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null;
        }}
      />

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">
          События на {selectedDate.toLocaleDateString("ru-RU")}
        </h3>
        {events.length > 0 ? (
          <ul className="space-y-2">
            {events.map((event, index) => (
              <li key={index} className="bg-white p-4 rounded shadow">
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-gray-600">{event.location}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">На этот день пока нет мероприятий.</p>
        )}
      </div>
    </div>
  );
}