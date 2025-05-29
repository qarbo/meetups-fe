import React from "react";
import useCanvasAnimation from "../hooks/useCanvasAnimation";

export default function CanvasTheme({ selectedTheme, selectedEmoji, canvasColor, colorScheme, style, forCard = false, coords = null }) {
    const colorOptions = [
        { id: "gray", color: "bg-gray-200", darkColor: "bg-gray-900"},
        { id: "pink", color: "bg-pink-200", darkColor: "bg-pink-900" },
        { id: "purple", color: "bg-purple-200", darkColor: "bg-purple-900" },
        { id: "blue", color: "bg-blue-200", darkColor: "bg-blue-900" },
        { id: "green", color: "bg-green-200", darkColor: "bg-green-900" },
        { id: "yellow", color: "bg-yellow-200", darkColor: "bg-yellow-900" },
        { id: "orange", color: "bg-orange-200", darkColor: "bg-orange-900" },
        { id: "red", color: "bg-red-200", darkColor: "bg-red-900" },
        { id: "rainbow", color: "bg-gradient-to-r from-pink-200 via-yellow-200 to-blue-200", darkColor: "bg-gradient-to-r from-pink-900 via-yellow-900 to-blue-900" },
        ];

  useCanvasAnimation(selectedTheme, selectedEmoji, forCard, coords);

  const selectedColor = colorOptions.find(c => c.id === canvasColor) || { color: "bg-gray-200", darkColor: "bg-gray-900" };
  const bgColor = colorScheme === "light" ? selectedColor?.color : selectedColor?.darkColor;

  return (
    <canvas
      id="canvas"
      className={bgColor}
      style={style || {
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}