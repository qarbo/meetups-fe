import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import { FaUpload } from "react-icons/fa";
import "../styles/emojiBackground.css";

import RegisterModal from "../components/RegisterModal";
import CustomDropdown from "../components/CustomDropdown";
import InviteThemeModal from "../components/InviteThemeModal";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [locationError, setLocationError] = useState(false);
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

  // Canvas color state and options
  const [canvasColor, setCanvasColor] = useState("bg-white");
  const colorOptions = [
    { id: "gray", color: "bg-gray-200" },
    { id: "pink", color: "bg-pink-200" },
    { id: "purple", color: "bg-purple-200" },
    { id: "blue", color: "bg-blue-200" },
    { id: "green", color: "bg-green-200" },
    { id: "yellow", color: "bg-yellow-200" },
    { id: "orange", color: "bg-orange-200" },
    { id: "red", color: "bg-red-200" },
    { id: "rainbow", color: "bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500" },
  ];

  // Theme modal states
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const themes = [
    { id: "minimal", name: "Confetti", image: "https://images.lumacdn.com/themes/thumb/minimal.jpg" },
    { id: "emoji", name: "Emoji", image: "https://images.lumacdn.com/themes/thumb/emoji.jpg" },
    { id: "pattern", name: "Warp", image: "https://images.lumacdn.com/themes/thumb/pattern.jpg" },
    // Можно добавить другие темы
  ];

  // Suggestions for location
  const [suggestions, setSuggestions] = useState([]);
  const suggestBoxRef = useRef(null);

  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
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

  const uploadImageToServer = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await apiFetch("/images/upload/", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Image upload failed");
    }
    const data = await response.json();
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    if (!location.trim()) {
      setLocationError(true);
      return;
    }
    let imageUrl = null;
    let imageId = null;
    if (image) {
      try {
        const uploadResult = await uploadImageToServer(image);
        imageUrl = uploadResult.url;
        imageId = uploadResult.id;
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
    // Combine date and time into ISO strings
    const start_datetime = `${startDate}T${startTime}`;
    const end_datetime = `${endDate}T${endTime}`;
    const newEvent = {
      title,
      description,
      visibility,
      start_datetime,
      end_datetime,
      online_link: location,
      ticket_type: tickets,
      requires_confirmation: requireApproval,
      capacity: capacity ? parseInt(capacity, 10) : null,
      cover_image_id: imageId,
      cover_image_url: imageUrl,
    };
    try {
      const res = await apiFetch("/events/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      if (!res.ok) {
        throw new Error("Event creation failed");
      }
      const created = await res.json();
      navigate(`/events/${created.id}`);
    } catch (err) {
      console.error(err);
    }
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
      <canvas
        id="canvas"
        className={`${canvasColor}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
          width: "100vw",
          height: "100vh"
        }}
      />
      <div className="min-h-screen px-6 pb-6 text-[#1A1A1A]">
        <div className="max-w-5xl mx-auto rounded-xl p-1 flex flex-col lg:flex-row gap-6 items-start">
        {/* Левый столбец: изображение и выбор календаря */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full max-w-md flex flex-col gap-4">

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
          {/* Кнопка выбора темы приглашения (перемещено сюда) */}
          <div className="mt-2 flex items-center">
            <button
              type="button"
              onClick={() => setShowThemeModal(true)}
              className="bg-white/40 backdrop-blur-md text-[#1A1A1A] px-3 py-2 rounded hover:bg-white/70"
            >
              Выбрать тему приглашения
            </button>
            {selectedTheme && (
              <span className="ml-3 text-sm flex items-center">
                <img src={selectedTheme.image} alt={selectedTheme.name} className="w-8 h-8 rounded mr-2" />
                {selectedTheme.name}
              </span>
            )}
          </div>
          </div>
        </div>

        {/* Правый столбец: все остальные поля формы */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-2 w-full flex flex-col items-center lg:items-stretch">
          {/* Верхняя панель с выбором календаря и публичности */}
          <div className="flex justify-between">
            <CustomDropdown
              options={[
                { value: "public", label: "🌐 Публичное", description: "Показывается в календаре и может быть выделено." },
                { value: "private", label: "✨ Приватное", description: "Не отображается в календаре. Только по ссылке." }
              ]}
              selected={visibility}
              setSelected={setVisibility}
              align='left'
            />
          </div>
          <div className="w-full max-w-md">
            {/* Название события */}
            <div className="mb-2">
              <input
                type="text"
                className={`w-full rounded ${titleError ? 'border border-red-500' : ''} bg-white/30 backdrop-blur-md text-[#1A1A1A] placeholder:text-[#999999] px-3 py-2`}
                placeholder="Название события"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) setTitleError(false);
                }}
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
                  className={`w-full rounded ${locationError ? 'border border-red-500' : ''} bg-white/30 backdrop-blur-md text-[#1A1A1A] placeholder:text-[#999999] px-3 py-2`}
                  placeholder="Офлайн место или ссылка для онлайн"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (locationError) setLocationError(false);
                  }}
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
      {/* Модалка выбора темы приглашения */}
      {showThemeModal && (
        <InviteThemeModal
          themes={themes}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          onClose={() => setShowThemeModal(false)}
          onColorChange={(color) => setCanvasColor(color)}
          colorOptions={colorOptions}
        />
      )}
    </div>
    </>
  );
}