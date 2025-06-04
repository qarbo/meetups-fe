import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fonts } from "../utils/constants"
import { useTranslation } from "react-i18next";

export default function InviteThemeModal({ themes, selectedTheme, setSelectedTheme, selectedColorScheme, onClose, onColorChange, onThemeChange, colorOptions, onFontChange, selectedEmoji, setSelectedEmoji }) {
  const { t } = useTranslation();
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
  const [selectedFont, setSelectedFont] = useState(fonts[0].id);
  const [colorScheme, setColorScheme] = useState("light");

  const [selectedColor, setSelectedColor] = useState("gray");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);

  const [selectedPattern, setSelectedPattern] = useState("pattern1");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPatternPicker, setShowPatternPicker] = useState(false);

  const colorPickerRef = useRef(null);
  const fontPickerRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

  useEffect(() => {
    const savedColorScheme = localStorage.getItem("colorScheme");
    const savedColor = localStorage.getItem("selectedColor");
    const savedFont = localStorage.getItem("selectedFont");
    const savedEmoji = localStorage.getItem("selectedEmoji");
    const savedPattern = localStorage.getItem("selectedPattern");
    if (savedColorScheme) setColorScheme(savedColorScheme);
    if (savedColor) setSelectedColor(savedColor);
    if (savedFont) setSelectedFont(savedFont);
    if (savedEmoji) setSelectedEmoji(savedEmoji);
    if (savedPattern) setSelectedPattern(savedPattern);
  }, [setSelectedEmoji]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
      if (fontPickerRef.current && !fontPickerRef.current.contains(event.target)) {
        setShowFontPicker(false);
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) && emojiButtonRef.current && !emojiButtonRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
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
        <h2 className="text-lg font-bold mb-4">{t('inviteTheme.title')}</h2>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`cursor-pointer rounded-lg overflow-hidden border-2 max-w-[100px] ${
                selectedTheme === theme.id ? "border-blue-500" : "border-transparent"
              }`}
            >
              <img src={theme.image} alt={theme.name} className="w-full h-16 object-cover" />
              <div className="text-center text-xs">{theme.name}</div>
            </div>
          ))}
        </div>
        {/* Блок кнопок выбора: цвет, шрифт, emoji/pattern, цветовая схема */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mt-4">
          {/* Кнопка выбора цвета */}
          <div className="relative inline-block" ref={colorPickerRef}>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full h-12 rounded bg-white/30 backdrop-blur-md text-sm shadow flex items-center gap-2 justify-center"
            >
              <div className={`w-4 h-4 rounded-full ${colors.find(c => c.id === selectedColor)?.color}`}></div>
              {t('inviteTheme.pickColor')}
            </button>
            {showColorPicker && (
              <div className="absolute z-50 bottom-full mb-2 bg-white rounded-lg shadow-md p-2 grid grid-cols-9 gap-2 min-w-[20rem] max-w-[20rem]">
                {colors.map((col) => (
                  <div
                    key={col.id}
                    onClick={() => {
                      setSelectedColor(col.id);
                      localStorage.setItem("selectedColor", col.id);
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
          {/* Кнопка выбора шрифта */}
          <div className="relative inline-block" ref={fontPickerRef}>
            <button
              onClick={() => setShowFontPicker(!showFontPicker)}
              className="w-full h-12 rounded bg-white/30 backdrop-blur-md text-sm shadow flex items-center gap-2 justify-center"
            >
              <span className={`text-lg ${fonts.find(f => f.id === selectedFont)?.style}`}>Ag</span>
              {fonts.find(f => f.id === selectedFont)?.name}
            </button>
            {showFontPicker && (
              <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-md p-2 grid grid-cols-4 gap-2 w-max max-w-[90vw] max-h-[300px] overflow-y-auto">
                {fonts.map((font) => (
                  <div
                    key={font.id}
                    onClick={() => {
                      setSelectedFont(font.id);
                      localStorage.setItem("selectedFont", font.id);
                      setShowFontPicker(false);
                      if (onFontChange) onFontChange(font.id);
                    }}
                    className={`cursor-pointer p-2 rounded border ${
                      selectedFont === font.id ? "border-blue-500" : "border-transparent"
                    }`}
                  >
                    <div className={`text-lg text-black ${font.style}`}>Ag</div>
                    <div className="text-xs text-center text-black">{font.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Кнопка выбора emoji/pattern */}
          <div className="relative inline-block">
            <button
              ref={emojiButtonRef}
              className="w-full h-12 rounded bg-white/30 backdrop-blur-md text-sm shadow flex items-center gap-2 justify-center"
              disabled={selectedTheme === "minimal"}
              onClick={(e) => {
                e.stopPropagation(); // предотвращает всплытие события клика
                if (selectedTheme === "emoji") {
                  setShowPatternPicker(false);
                  setShowEmojiPicker(!showEmojiPicker);
                } else if (selectedTheme === "pattern") {
                  setShowEmojiPicker(false);
                  setShowPatternPicker(!showPatternPicker);
                }
              }}
            >
              {selectedTheme === "minimal"
                ? t('inviteTheme.disabled')
                : selectedTheme === "emoji"
                ? selectedEmoji
                : selectedTheme === "pattern"
                ? selectedPattern
                : t('inviteTheme.choose')}
            </button>
            {selectedTheme === "emoji" && showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute z-50 bottom-full mb-2 bg-white rounded-lg shadow-md p-2 grid grid-cols-6 gap-2 min-w-[20rem] max-w-[20rem]">
                {["😀", "🎉", "🚀", "🌈", "🔥", "💡", "🇷🇺", "🍕", "🍺", "🍸", "🫦", "♥️", "🏐", "🎾", "🏀", "⚽️", "🎱", "🌴"].map((emoji) => (
                  <div
                    key={emoji}
                    onClick={() => {
                      setSelectedEmoji(emoji);
                      localStorage.setItem("selectedEmoji", emoji);
                    }}
                    className={`cursor-pointer text-2xl flex items-center justify-center ${selectedEmoji === emoji ? "ring-2 ring-blue-500" : ""}`}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            )}
            {selectedTheme === "pattern" && showPatternPicker && (
              <div className="absolute z-50 bottom-full mb-2 bg-white rounded-lg shadow-md p-2 grid grid-cols-3 gap-2 min-w-[20rem] max-w-[20rem]">
                {["pattern1", "pattern2", "pattern3"].map((pattern) => (
                  <div
                    key={pattern}
                    onClick={() => {
                      setSelectedPattern(pattern);
                      localStorage.setItem("selectedPattern", pattern);
                      setShowPatternPicker(false);
                    }}
                    className={`cursor-pointer p-2 rounded border ${
                      selectedPattern === pattern ? "border-blue-500" : "border-transparent"
                    }`}
                  >
                    {pattern}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Кнопка выбора цветовой схемы */}
          <button
            onClick={() => {
              const newColorScheme = colorScheme === "light" ? "dark" : "light";
              setColorScheme(newColorScheme);
              localStorage.setItem("colorScheme", newColorScheme);
              if (onThemeChange) onThemeChange(newColorScheme);
            }}
            className="w-full h-12 rounded bg-white/30 backdrop-blur-md text-sm shadow flex items-center gap-2 justify-center"
          >
            {colorScheme === "light" ? t('inviteTheme.light') : t('inviteTheme.dark')}
          </button>
        </div>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow`}
        >
          &times;
        </button>
      </motion.div>
    </div>
  );
}