import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function InviteThemeModal({ themes, selectedTheme, setSelectedTheme, selectedColorScheme, onClose, onColorChange, onThemeChange, colorOptions, onFontChange }) {
  const colors = [
    { id: "gray", color: "bg-gray-500" },
    { id: "pink", color: "bg-pink-500" },
    { id: "purple", color: "bg-purple-500" },
    { id: "blue", color: "bg-blue-500" },
    { id: "green", color: "bg-green-500" },
    { id: "yellow", color: "bg-yellow-500" },
    { id: "orange", color: "bg-orange-500" },
    { id: "red", color: "bg-red-500" },
    { id: "rainbow", color: "bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500" },
  ];
  const fonts = [
    { id: "default", name: "Default", style: "font-sans" },
    { id: "museo", name: "Museo", style: "font-serif" },
    { id: "factoria", name: "Factoria", style: "font-mono" },
    { id: "garamond", name: "Garamond", style: "font-serif" },
    { id: "roc", name: "Roc", style: "font-serif" },
    { id: "nunito", name: "Nunito", style: "font-sans" },
    { id: "pearl", name: "Pearl", style: "font-sans" },
    { id: "departure", name: "Departure", style: "font-mono" },
  ];
  const [selectedFont, setSelectedFont] = useState(fonts[0].id);
  const [colorScheme, setColorScheme] = useState("light");

  const [selectedColor, setSelectedColor] = useState("gray");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);

  const colorPickerRef = useRef(null);
  const fontPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
      if (fontPickerRef.current && !fontPickerRef.current.contains(event.target)) {
        setShowFontPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        className={`relative ${colorScheme === "light" ? "text-[#1A1A1A]" : "text-white"} backdrop-blur-md bg-white/10 rounded-t-lg p-6 max-w-3xl w-full shadow`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Выберите тему приглашения</h2>
        <div className="grid grid-cols-4 gap-2">
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                selectedTheme === theme.id ? "border-blue-500" : "border-transparent"
              }`}
            >
              <img src={theme.image} alt={theme.name} className="w-full h-16 object-cover" />
              <div className="text-center text-xs">{theme.name}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="relative inline-block" ref={colorPickerRef}>
            <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="mt-2 w-full max-w-full h-12 rounded bg-white/30 backdrop-blur-md text-sm shadow flex items-center gap-2 justify-center"
            >
            <div className={`w-4 h-4 rounded-full ${colors.find(c => c.id === selectedColor)?.color}`}></div>
            Выбрать цвет
            </button>
            {showColorPicker && (
                <div className="absolute z-50 bottom-full mb-2 bg-white rounded-lg shadow-md p-2 grid grid-cols-9 gap-2 min-w-[20rem] max-w-[20rem]">
                {colors.map((col) => (
                    <div
                    key={col.id}
                    onClick={() => {
                      setSelectedColor(col.id);
                      const selectedColorObj = colorOptions.find(c => c.id === col.id);
                      if (onColorChange && selectedColorObj) {
                        onColorChange(selectedColorObj.id);
                      }
                    }}
                    className={`w-6 h-6 rounded-full cursor-pointer ${col.color} ${
                        selectedColor === col.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    ></div>
                ))}
                </div>
            )}
            </div>
            <div className="relative inline-block" ref={fontPickerRef}>
              <button onClick={() => setShowFontPicker(!showFontPicker)} 
                  className="mt-2 w-full max-w-full h-12 rounded bg-white/30 backdrop-blur-md text-sm shadow flex items-center gap-2 justify-center">
                <span className={`text-lg ${fonts.find(f => f.id === selectedFont)?.style}`}>Ag</span>
                {fonts.find(f => f.id === selectedFont)?.name}
              </button>
              {showFontPicker && (
                <div className="absolute z-50 bottom-full mb-2 bg-white rounded-lg shadow-md p-2 grid grid-cols-4 gap-2 min-w-[20rem] max-w-[20rem]">
                  {fonts.map((font) => (
                    <div
                      key={font.id}
                      onClick={() => {
                        setSelectedFont(font.id);
                        setShowFontPicker(false);
                        if (onFontChange) onFontChange(font.id);
                      }}
                      
                      className={`cursor-pointer p-2 rounded border ${
                        selectedFont === font.id ? "border-blue-500" : "border-transparent"
                      }`}
                    >
                      <div className={`text-lg ${font.style}`}>Ag</div>
                      <div className="text-xs text-center">{font.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow`}
        >
          &times;
        </button>
        <button
          onClick={() => {
            const newColorScheme = colorScheme === "light" ? "dark" : "light";
            setColorScheme(newColorScheme);
            if (onThemeChange) onThemeChange(newColorScheme);
          }}
          className="mt-4 w-full h-12 rounded bg-white/30 backdrop-blur-md text-sm shadow flex items-center gap-2 justify-center"
        >
          {colorScheme === "light" ? "☀️ Светлая тема" : "🌙 Тёмная тема"}
        </button>
      </motion.div>
    </div>
  );
}