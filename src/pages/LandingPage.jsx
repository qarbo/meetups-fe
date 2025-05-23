// src/pages/LandingPage.jsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = document.getElementById("landing-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#fdf6f3");
    gradient.addColorStop(1, "#eef2ff");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <canvas id="landing-canvas" style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100vw",
        height: "100vh"
      }} />
      <div className="relative z-10 flex items-center justify-center h-full text-center">
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
    </div>
  );
}