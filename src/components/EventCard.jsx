import React, { useRef, useEffect, useState } from "react";
import CanvasTheme from "./CanvasTheme";
import { formatEventDateTime } from "../utils/dateUtils";
import defaultEventImage from "../assets/invitation.png";

export default function EventCard({ event }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    const rect = cardRef.current.getBoundingClientRect();
    if (cardRef.current) {
    //   const rect = cardRef.current.getBoundingClientRect();
      setCoords({ x: 0, y: 0, width: rect.width, height: rect.height });
    }
  }, []);

  const themeData = event.theme ? JSON.parse(event.theme) : {};
  const textColorClass = themeData.colorScheme === "dark" ? "text-white" : "text-black";

  return (
    <div ref={cardRef} className={`max-w-80 bg-green-100 p-4 rounded-lg shadow-lg mx-auto relative overflow-hidden flex ${textColorClass}`}>
      <CanvasTheme
        selectedTheme={event.theme ? JSON.parse(event.theme).theme : null}
        selectedEmoji={event.theme ? JSON.parse(event.theme).emoji : null}
        canvasColor={event.theme ? JSON.parse(event.theme).canvasColor : null}
        colorScheme={event.theme ? JSON.parse(event.theme).colorScheme : "light"}
        style={{
          position: "absolute",
          zIndex: 0,
          width: "100%",
          height: "100%"
        }}
        forCard={true}
        coords={coords}
      />
      <div className="rounded-lg overflow-hidden relative z-10 flex-none">
        <img
          src={event.cover_image_url || defaultEventImage}
          alt={event.title}
          className="aspect-square object-cover max-h-20 max-w-20"
        />
      </div>
      <div className="relative z-10 ml-4 flex-1">
        <h2 className="text-s font-bold">{event.title}</h2>
        <p className="text-xs text-gray-500">
          {formatEventDateTime(event.start_datetime, event.end_datetime)}
        </p>
        <p className="mt-2 text-xs">{event.description || "Без описания"}</p>
        <div className="mt-4 flex space-x-2">
        </div>
      </div>
    </div>
  );
}