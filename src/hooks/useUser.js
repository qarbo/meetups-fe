// src/hooks/useUser.js
import { useEffect, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext"; // Убедитесь, что путь корректный

export default function useUser() {
  const { isAuthenticated, setShowLogin } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          name: decoded.name || decoded.username || "Пользователь",
          email: decoded.email || "",
          avatar_url: decoded.avatar_url || "",
        });
      } catch (err) {
        console.error("Ошибка при декодировании токена:", err);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user && isAuthenticated,
    setShowLogin: setShowLogin || (() => {}),
  };
}