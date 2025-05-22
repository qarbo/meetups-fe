import React, { useState, useEffect } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/auth/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.status === 401) {
          // Token expired or invalid – log out
          localStorage.removeItem("token");
          window.location.href = "/";
          return Promise.reject("Unauthorized");
        }
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Загрузка профиля...</p>;
  }
  if (error) {
    return <p className="text-red-500">Ошибка: {error}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Профиль</h2>

      {/* Профиль пользователя */}
      <div className="bg-white p-6 rounded shadow flex items-center gap-6 mb-6">
        {/* <img
          src={user.avatarUrl || user.avatar}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover"
        /> */}
        <div>
          <h3 className="text-xl font-semibold">{user.name}</h3>
          {/* <p className="text-sm text-gray-500">{user.city}</p> */}
          {/* <p className="mt-2 text-sm text-gray-700">{user.bio}</p> */}
        </div>
      </div>

      {/* Группы */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Участник групп</h4>
        {/* <ul className="flex flex-wrap gap-2 text-sm">
          {user.groups.map((group, idx) => (
            <li
              key={idx}
              className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full"
            >
              {group}
            </li>
          ))}
        </ul> */}
      </div>

      {/* Мероприятия */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Организованные мероприятия</h4>
        {/* <ul className="space-y-3">
          {user.events.map((event, idx) => (
            <li key={idx} className="bg-white p-4 rounded shadow">
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-gray-600">
                {event.date} — {event.location}
              </p>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
}