import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";
import { apiFetch } from "../api";

export default function RegisterModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", "SocialAppAuthBot"); // Замените на своего бота
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "onTelegramAuth");

    const container = document.getElementById("telegram-login-button");
    if (container) {
      container.innerHTML = ""; // Очистим, чтобы не было дублей
      container.appendChild(script);
    }

    window.onTelegramAuth = function (user) {
      fetch(`${window.location.protocol}//${window.location.hostname}:3000/auth/telegram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
        .then((response) => {
          if (response.ok) {
            onClose();
            window.location.reload();
          }
        })
        .catch((err) => {
          console.error("Telegram auth error", err);
        });
    };

    return () => {
      delete window.onTelegramAuth;
    };
  }, []);

  const handleEmailRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch(`/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token || data.token);
        onClose();
        window.location.reload();
      } else {
        const err = await response.json();
        setError(err.detail || "Ошибка регистрации");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEmailRegister();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-2">Добро пожаловать</h2>
        <p className="mb-4 text-sm text-gray-600">Пожалуйста зарегистрируйтесь ниже.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 mb-3 rounded"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 mb-3 rounded"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded mb-3 disabled:opacity-50"
          >
            {loading ? "Загрузка..." : "Регистрация по почте"}
          </button>
        </form>
        <div id="telegram-login-button" className="w-full mt-3 flex items-center justify-center"></div>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 underline"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}