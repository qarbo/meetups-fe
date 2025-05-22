// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      // Load Telegram login widget
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.async = true;
      script.setAttribute('data-telegram-login', 'SocialAppAuthBot'); // replace with your bot username
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-userpic', 'false');
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-onauth', 'onTelegramAuth');
      const container = document.getElementById('telegram-login-button');
      if (container) {
        container.appendChild(script);
      }

      // Define the callback for Telegram auth
      window.onTelegramAuth = function(user) {
        fetch('/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        }).then(response => {
          // handle authentication response
          setShowModal(false);
        }).catch(err => {
          console.error('Telegram auth error', err);
        });
      };
    }
  }, [showModal]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f3] to-[#eef2ff] text-center px-4">
      <div>
        <h1 className="text-4xl font-bold mb-4">
          Незабываемые события <span className="text-pink-500">начинаются здесь.</span>
        </h1>
        <p className="text-lg mb-6">
          Создайте страницу мероприятия, пригласите друзей и продавайте билеты. Проведите незабываемое событие уже сегодня.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
        >
          Создать первое мероприятие
        </button>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-xl font-semibold mb-2">Добро пожаловать</h2>
              <p className="mb-4 text-sm text-gray-600">Пожалуйста, войдите или зарегистрируйтесь ниже.</p>
              <input
                type="email"
                placeholder="you@email.com"
                className="w-full border px-3 py-2 mb-3 rounded"
              />
              <button className="w-full bg-black text-white py-2 rounded mb-3">
                Продолжить с почтой
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 rounded flex items-center justify-center gap-2">
                <span className="text-lg">G</span> Войти через Google
              </button>
              <div id="telegram-login-button" className="w-full mt-3 flex items-center justify-center"></div>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 text-sm text-gray-500 underline"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}