import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaComments, FaUserAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";
import Chat from "./pages/Chat";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen text-gray-900 font-sans">
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold tracking-tight">ГДЕ?</Link>

            {/* Navigation visible on all devices, icons with labels on md and up */}
            <nav className="flex space-x-6">
              <Link to="/" className="text-sm hover:underline flex items-center gap-2">
                <FaHome />
                <span className="hidden md:inline">Мероприятия</span>
              </Link>
              <Link to="/calendar" className="text-sm hover:underline flex items-center gap-2">
                <FaCalendarAlt />
                <span className="hidden md:inline">Календарь</span>
              </Link>
              <Link to="/chat" className="text-sm hover:underline flex items-center gap-2">
                <FaComments />
                <span className="hidden md:inline">Чаты</span>
              </Link>
              <Link to="/profile" className="text-sm hover:underline flex items-center gap-2">
                <FaUserAlt />
                <span className="hidden md:inline">Аккаунт</span>
              </Link>
            </nav>

            {/* Auth buttons with icons and labels on md and up */}
            <div className="flex space-x-2">
              <Link to="/login" className="px-4 py-1 border border-teal-600 text-teal-600 rounded hover:bg-teal-50 text-sm flex items-center gap-2">
                <FaSignInAlt />
                <span className="hidden md:inline">Войти</span>
              </Link>
              <Link to="/register" className="px-4 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 text-sm flex items-center gap-2">
                <FaUserPlus />
                <span className="hidden md:inline">Регистрация</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/event/:id" element={<EventDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}