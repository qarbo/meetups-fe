import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";
import Chat from "./pages/Chat";
import CreateEvent from './pages/CreateEvent';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">ВМЕСТЕБУДЕМ</h1>
            <nav className="space-x-6">
              <Link to="/" className="text-sm hover:underline">Мероприятия</Link>
              <Link to="/calendar" className="text-sm hover:underline">Календарь</Link>
              <Link to="/chat" className="text-sm hover:underline">Чат</Link>
              <Link to="/profile" className="text-sm hover:underline">Профиль</Link>
            </nav>
            <div className="space-x-2">
              <button className="px-4 py-1 border border-teal-600 text-teal-600 rounded hover:bg-teal-50 text-sm">Регистрация</button>
              <button className="px-4 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 text-sm">Войти</button>
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}
