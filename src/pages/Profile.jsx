import React, { useState, useEffect } from "react";
import { apiFetch } from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    apiFetch("/auth/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.status === 401) {
          // Token expired or invalid – log out
          localStorage.removeItem("token");
          window.location.replace("/"); // выполняет редирект
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
        <button
          onClick={() => setShowUpload(true)}
          className="w-24 h-24 rounded-full overflow-hidden relative"
        >
          <img
            src={user.avatar_url || user.avatar || 'https://cdn-icons-png.freepik.com/512/6858/6858441.png'}
            alt={user.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm">
            Изменить
          </span>
        </button>
        <div>
          <h3 className="text-xl font-semibold">{user.name}</h3>
          {/* <p className="text-sm text-gray-500">{user.city}</p> */}
          {/* <p className="mt-2 text-sm text-gray-700">{user.bio}</p> */}
        </div>
      </div>

      {showUpload && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Загрузить новый аватар</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const formData = new FormData();
                  formData.append("avatar", file);
                  apiFetch("/auth/me/avatar", {
                    method: "POST",
                    body: formData,
                  })
                    .then(res => {
                      if (!res.ok) throw new Error("Ошибка загрузки");
                      return res.json();
                    })
                    .then(data => {
                      setUser(prev => ({ ...prev, avatar_url: data.avatar_url }));
                      setShowUpload(false);
                    })
                    .catch(err => alert(err.message));
                }
              }}
            />
            <button
              className="mt-4 px-4 py-2 bg-gray-300 rounded"
              onClick={() => setShowUpload(false)}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

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