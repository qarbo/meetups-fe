// src/pages/LandingPage.jsx
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f3] to-[#eef2ff] text-center px-4"
    style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100vw",
        height: "100vh"
      }}>
      <div>
        <h1 className="text-4xl font-bold mb-4">
          Незабываемые события <span className="text-pink-500">начинаются здесь.</span>
        </h1>
        <p className="text-lg mb-6">
          Создайте страницу мероприятия, пригласите друзей и продавайте билеты. Проведите незабываемое событие уже сегодня.
        </p>
        <button
          onClick={() => navigate('/create')}
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
        >
          Создать первое мероприятие
        </button>
      </div>
    </div>
  );
}