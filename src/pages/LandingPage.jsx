// src/pages/LandingPage.jsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import landingImage from "../assets/LandingImage.png";

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
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-screen text-center md:text-left gap-8 px-6 md:px-24 py-6 md:py-12">
        
        <div className="block md:hidden h-48" />
        
        <div className="md:w-1/2 order-1 md:order-1">
          <h1 className="text-3xl font-bold mb-4">
            Незабываемые события <span className="text-pink-500">начинаются здесь.</span>
          </h1>
          <p className="text-m mb-6">
            Создайте страницу мероприятия, пригласите друзей и продавайте билеты. Проведите незабываемое событие уже сегодня.
          </p>
          <button
            onClick={() => navigate('/create')}
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
          >
            Создать первое мероприятие
          </button>
        </div>
        <div className="md:w-1/2 order-2 md:order-2">
          <img
            src={landingImage}
            alt="event preview"
            className="mx-auto md:w-full rounded"
          />
        </div>
      </div>
    </div>
  );
}