import React from "react";
import { motion } from "framer-motion";

export default function InviteThemeModal({ themes, selectedTheme, setSelectedTheme, onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-end justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white/30 backdrop-blur-md rounded-t-lg p-6 max-w-3xl w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Выберите тему приглашения</h2>
        <div className="grid grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                selectedTheme === theme.id ? "border-blue-500" : "border-transparent"
              }`}
            >
              <img src={theme.image} alt={theme.name} className="w-full h-24 object-cover" />
              <div className="text-center py-1">{theme.name}</div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Закрыть
        </button>
      </motion.div>
    </div>
  );
}