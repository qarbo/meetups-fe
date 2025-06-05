import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";
import defaultEventImage from "../assets/invitation.png";

export default function Profile() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [events, setEvents] = useState([]);

  // Format date/time for events
  function formatEventDateTime(start, end) {
    if (!start) return "";
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;
    const optionsDate = { day: "2-digit", month: "2-digit", year: "numeric" };
    const optionsTime = { hour: "2-digit", minute: "2-digit" };
    let str = startDate.toLocaleDateString(undefined, optionsDate) + " " + startDate.toLocaleTimeString(undefined, optionsTime);
    if (endDate) {
      // Если дата окончания совпадает с датой начала, показать только время окончания
      if (
        startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === endDate.getDate()
      ) {
        str += " — " + endDate.toLocaleTimeString(undefined, optionsTime);
      } else {
        str += " — " + endDate.toLocaleDateString(undefined, optionsDate) + " " + endDate.toLocaleTimeString(undefined, optionsTime);
      }
    }
    return str;
  }

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
      .then(data => {
        setUser(data);
        apiFetch("/me/events")
          .then(res => {
            if (!res.ok) throw new Error("Failed to fetch events");
            return res.json();
          })
          .then(data => setEvents(data))
          .catch(err => console.error("Error loading events:", err));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>{t('profile.loading')}</p>;
  }
  if (error) {
    return <p className="text-red-500">{t('profile.error')}: {error}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">{t('profile.title')}</h2>

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
            {t('profile.changeAvatar')}
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
            <h2 className="text-xl font-bold mb-4">{t('profile.uploadTitle')}</h2>
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
              {t('profile.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Группы */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">{t('profile.groups')}</h4>
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
        <h4 className="text-lg font-semibold mb-2">{t('profile.organizedEvents')}</h4>
        {events.length === 0 ? (
          <p className="text-gray-500">{t('profile.noEvents')}</p>
        ) : (
          <ul className="space-y-3">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/event-overview/${event.id}`}
                className="block"
              >
                <div className="bg-white rounded-lg p-4 flex items-start justify-between gap-4 shadow-sm hover:shadow transition">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-400 flex items-center gap-1">
                      <span role="img" aria-label="Календарь">📅</span>
                      {formatEventDateTime(event.start_datetime, event.end_datetime)}
                    </div>
                    <h2 className="text-lg font-semibold mb-1 truncate">{event.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span role="img" aria-label="Локация">📍</span>
                      <span className="truncate">{event.online_link}</span>
                    </div>
                  </div>
                  <img
                    src={event.cover_image_url || defaultEventImage}
                    alt={event.title}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                  />
                </div>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}