import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaComments, FaUserAlt, FaSignInAlt, FaUserPlus, FaSearch, FaBell } from "react-icons/fa";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";
import Chat from "./pages/Chat";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import LandingPage from "./pages/LandingPage";
import RegisterModal from "./components/RegisterModal";
import LoginModal from "./components/LoginModal";

const isAuthenticated = Boolean(localStorage.getItem("token"));

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetch("http://localhost:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setUserName(data.name || "Без имени");
          setUserEmail(data.email || "");
        });
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <Router>
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      <div className="min-h-screen text-gray-900 font-sans">
        <header>
          <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
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
            </nav>

            {/* Auth buttons with icons and labels on md and up */}
            <div className="flex items-center space-x-4 relative">
              {isAuthenticated ? (
                <>
                  <span className="hidden md:inline text-sm text-gray-600">
                    {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: false })}
                  </span>
                  <Link to="/create" className="text-sm font-medium hover:underline">
                    Создать встречу
                  </Link>
                  <button className="text-xl hover:text-gray-600"><FaSearch /></button>
                  <button className="text-xl hover:text-gray-600"><FaBell /></button>
                  <div ref={menuRef} className="relative">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="w-8 h-8 rounded-full overflow-hidden">
                      <img src="https://cdn-icons-png.freepik.com/512/6858/6858441.png" alt="User" />
                    </button>
                    {menuOpen && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg py-2 text-left z-50">
                        <div className="px-4 py-2 border-b">
                          <p className="font-semibold">{userName}</p>
                          <p className="text-xs text-gray-500">{userEmail}</p>
                        </div>
                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">View Profile</Link>
                        <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                        <button onClick={() => { localStorage.removeItem("token"); window.location.reload(); }} className="w-full text-left px-4 py-2 hover:bg-gray-100">Sign Out</button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => setShowLoginModal(true)} className="px-4 py-1 bg-black text-white rounded hover:bg-gray-800 text-sm flex items-center gap-2">
                    <FaSignInAlt />
                    <span className="hidden md:inline">Войти</span>
                  </button>
                  <button onClick={() => setShowRegisterModal(true)} className="px-4 py-1 bg-black text-white rounded hover:bg-gray-800 text-sm flex items-center gap-2">
                    <FaUserPlus />
                    <span className="hidden md:inline">Регистрация</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            {isAuthenticated ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create" element={<CreateEvent />} />
                <Route path="/event/:id" element={<EventDetails />} />
              </>
            ) : (
              <Route path="*" element={<LandingPage />} />
            )}
            {/* <Route path="/" element={<Home />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}