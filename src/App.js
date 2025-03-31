import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";
import Chat from "./pages/Chat";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">ХЗ НАЗВАНИЕ</h1>

            {/* Desktop nav */}
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-sm hover:underline">Мероприятия</Link>
              <Link to="/calendar" className="text-sm hover:underline">Календарь</Link>
              <Link to="/chat" className="text-sm hover:underline">Чаты</Link>
              <Link to="/profile" className="text-sm hover:underline">Аккаунт</Link>
            </nav>

            {/* Auth buttons */}
            <div className="hidden md:flex space-x-2">
              <Link to="/login" className="px-4 py-1 border border-teal-600 text-teal-600 rounded hover:bg-teal-50 text-sm">Войти</Link>
              <Link to="/register" className="px-4 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 text-sm">Регистрация</Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden px-4 pb-4 space-y-2">
              <Link to="/" className="block text-sm text-gray-700 hover:underline" onClick={() => setMobileMenuOpen(false)}>Мероприятия</Link>
              <Link to="/calendar" className="block text-sm text-gray-700 hover:underline" onClick={() => setMobileMenuOpen(false)}>Календарь</Link>
              <Link to="/chat" className="block text-sm text-gray-700 hover:underline" onClick={() => setMobileMenuOpen(false)}>Чаты</Link>
              <Link to="/profile" className="block text-sm text-gray-700 hover:underline" onClick={() => setMobileMenuOpen(false)}>Аккаунт </Link>
              <hr className="border-gray-200" />
              <Link to="/login" className="block text-sm text-teal-600 hover:underline" onClick={() => setMobileMenuOpen(false)}>Войти</Link>
              <Link to="/register" className="block text-sm text-teal-600 hover:underline" onClick={() => setMobileMenuOpen(false)}>Регистрация</Link>
            </div>
          )}
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