import React, { useEffect, useState, useContext, useRef } from "react";
import { FaUpload } from "react-icons/fa";
import "../styles/emojiBackground.css";

import RegisterModal from "../components/RegisterModal";
import { AuthContext } from "../context/AuthContext";
import defaultEventImage from "../assets/default-event.jpg";

export default function CreateEvent() {
  // Вычисляем завтрашнюю дату и время (14:00)
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(14, 0, 0, 0); // 14:00

  const formattedDate = tomorrow.toISOString().split("T")[0];
  const formattedTime = tomorrow.toTimeString().split(":").slice(0, 2).join(":");
  const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [calendarType, setCalendarType] = useState("personal");
  const [visibility, setVisibility] = useState("public");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(formattedDate);
  const [startTime, setStartTime] = useState(formattedTime);
  const [endDate, setEndDate] = useState(formattedDate);
  const [endTime, setEndTime] = useState("15:00");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [tickets, setTickets] = useState("free");
  const [requireApproval, setRequireApproval] = useState(false);
  const [capacity, setCapacity] = useState("");
  const [image, setImage] = useState(null);
  const [timezone, setTimezone] = useState(detectedTimeZone);

  // Suggestions for location
  const [suggestions, setSuggestions] = useState([]);
  const suggestBoxRef = useRef(null);

  const { isAuthenticated } = useContext(AuthContext);
  const [forceShowModal, setForceShowModal] = useState(false);

  const commonTimeZones = [
    "UTC",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Moscow",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Asia/Kolkata",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Australia/Sydney",
  ];

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
  
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);
  
    const emojis = ["⚽️", "🥅", "🔥", "🚀"];
    const particles = new Array(30).fill(0).map(() => ({
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speedY: 0.3 + Math.random() * 0.7,
      speedX: (Math.random() - 0.5) * 0.5,
      size: 20 + Math.random() * 20,
    }));
  
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      for (let p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;
  
        if (p.y > window.innerHeight) {
          p.y = -50;
          p.x = Math.random() * window.innerWidth;
        }
  
        ctx.font = `${p.size}px serif`;
        ctx.fillText(p.emoji, p.x, p.y);
      }
  
      animationId = requestAnimationFrame(animate);
    };
  
    animate();
  
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setForceShowModal(true);
    }
  }, [isAuthenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      calendarType,
      visibility,
      title,
      startDate,
      startTime,
      endDate,
      endTime,
      location,
      description,
      tickets,
      requireApproval,
      capacity,
      image,
      timezone,
    };
    console.log("Создано мероприятие:", newEvent);
    // Здесь можно добавить логику отправки на сервер
  };

  // Handler for location input change with Yandex suggest
  const handleLocationChange = async (e) => {
    const value = e.target.value;
    setLocation(value);

    if (value.length > 2) {
      try {
        const res = await fetch(
          `https://search-maps.yandex.ru/v1/?text=${encodeURIComponent(value)}&type=geo&lang=ru_RU&apikey=d867a192-39e6-43bc-81fe-3465999ac6ce`
        );
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch (err) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <>
      {forceShowModal && (
        <RegisterModal
          onClose={() => {}}
          forceOpen={true}
        />
      )}
    <div style={{ position: "relative" }}>
      <canvas id="canvas" style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100vw",
        height: "100vh"
      }} />
      <div className="min-h-screen px-6 pb-6 text-[#1A1A1A]">
        <div className="max-w-5xl mx-auto rounded-xl p-1 flex flex-col lg:flex-row gap-6 items-start">
        {/* Левый столбец: изображение и выбор календаря */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full max-w-md flex flex-col gap-4">
          {/* Верхняя панель с выбором календаря и публичности */}
          <div className="flex justify-between">
            <select
              className="rounded px-2 py-1 bg-white/30 backdrop-blur-md text-[#1A1A1A] placeholder:text-[#999999]"
              value={calendarType}
              onChange={(e) => setCalendarType(e.target.value)}
            >
              <option value="personal">Личный календарь</option>
              <option value="work">Рабочий календарь</option>
            </select>

            <select
              className="rounded px-2 py-1 bg-white/30 backdrop-blur-md text-[#1A1A1A] placeholder:text-[#999999]"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="public">Публичное</option>
              <option value="private">Приватное</option>
            </select>
          </div>

          {/* Загрузка изображения */}
          <div>
            <div className="relative w-full">
              <img
                src={image ? URL.createObjectURL(image) : defaultEventImage}
                alt="preview"
                className="w-full aspect-square object-cover rounded shadow-sm"
              />
              <label className="absolute bottom-2 right-2 cursor-pointer bg-[#FFD5DC] text-[#1A1A1A] p-2 rounded-full hover:bg-[#E0E0E0]">
                <FaUpload />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setImage(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          </div>
          {/* Отступ снизу для мобильных устройств */}
          <div className="lg:hidden"></div>
          </div>
        </div>

        {/* Правый столбец: все остальные поля формы */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-2 w-full flex flex-col items-center lg:items-stretch">
          <div className="w-full max-w-md">
            {/* Название события */}
            <div className="mb-2">
              <input
                type="text"
                className="w-full rounded bg-white/30 backdrop-blur-md text-[#1A1A1A] placeholder:text-[#999999] px-3 py-2"
                placeholder="Название события"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Дата и время начала и окончания */}
            <div className="mb-2">
              <div className="flex flex-col lg:flex-row rounded bg-white/30 backdrop-blur-md shadow space-y-2 lg:space-y-0">
                {/* Left labels */}
                {/* <div className="flex flex-col justify-center items-center px-4 py-3 space-y-8 border-r border-[#E5E5E5] min-w-[60px]">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#1A1A1A]"></div>
                    <span className="text-sm text-gray-500">Start</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#1A1A1A]"></div>
                    <span className="text-sm text-gray-500">End</span>
                  </div>
                </div> */}

                {/* Middle date/time inputs */}
                <div className="flex flex-col justify-center px-4 py-3 space-y-2 w-full">
                  {/* Start row */}
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <input
                      type="date"
                      className="rounded bg-white/30 backdrop-blur-md px-3 py-2 text-[#1A1A1A]"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                      type="time"
                      className="rounded bg-white/30 backdrop-blur-md px-3 py-2 text-[#1A1A1A]"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  {/* End row */}
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <input
                      type="date"
                      className="rounded bg-white/30 backdrop-blur-md px-3 py-2 text-[#1A1A1A]"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <input
                      type="time"
                      className="rounded bg-white/30 backdrop-blur-md px-3 py-2 text-[#1A1A1A]"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* Right timezone selector */}
                {/* <div className="flex flex-col justify-center items-center px-4 py-3 border-t lg:border-t-0 lg:border-l border-[#E5E5E5] w-full lg:w-auto text-sm text-gray-500">
                  <select
                    className="bg-[#FFD5DC] text-[#1A1A1A] rounded px-2 py-1 ring-1 ring-[#E5E5E5]"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    {commonTimeZones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div> */}
              </div>
            </div>

            {/* Локация */}
            <div className="mb-2"> 
              <div className="relative" ref={suggestBoxRef}>
                <input
                  type="text"
                  className="w-full rounded bg-white/30 backdrop-blur-md text-[#1A1A1A] placeholder:text-[#999999] px-3 py-2"
                  placeholder="Офлайн место или ссылка для онлайн"
                  value={location}
                  onChange={handleLocationChange}
                />
                {suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 bg-white border rounded shadow mt-1 z-50 max-h-60 overflow-y-auto">
                    {suggestions.map((s, idx) => (
                      <li
                        key={idx}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setLocation(s.title.text);
                          setSuggestions([]);
                        }}
                      >
                        {s.title.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Описание */}
            <div>
              <textarea
                className="w-full rounded bg-white/30 backdrop-blur-md text-[#1A1A1A] placeholder:text-[#999999] px-3 py-2"
                placeholder="Дополнительная информация"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Опции события */}
            <div className="border-t pt-4 space-y-4 border-[#E5E5E5]">
              {/* Билеты */}
              <div className="flex items-center justify-between">
                <label className="block text-sm mb-1">Билеты</label>
                <select
                  className="rounded px-2 py-1 bg-white/30 backdrop-blur-md text-[#1A1A1A] placeholder:text-[#999999]"
                  value={tickets}
                  onChange={(e) => setTickets(e.target.value)}
                >
                  <option value="free">Бесплатно</option>
                  <option value="paid">Платно</option>
                </select>
              </div>

              {/* Требуется подтверждение */}
              <div className="flex items-center justify-between">
                <label className="block text-sm mb-1">
                  Требуется подтверждение
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={requireApproval}
                    onChange={(e) => setRequireApproval(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-[#E5E5E5] rounded-full peer peer-focus:ring-2 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A1A1A] border border-[#E5E5E5]"></div>
                </label>
              </div>

              {/* Вместимость */}
              <div className="flex items-center justify-between">
                <label className="block text-sm mb-1">Вместимость</label>
                <input
                  type="text"
                  className="w-24 rounded bg-white/30 backdrop-blur-md text-[#1A1A1A] placeholder:text-[#999999] px-3 py-1"
                  placeholder="Без ограничения"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
            </div>

            {/* Кнопка создания */}
            <button
              type="submit"
              className="w-full bg-white text-[#1A1A1A] py-2 rounded shadow-sm hover:bg-[#FFC8D4]"
            >
              Создать событие
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
    </>
  );
}