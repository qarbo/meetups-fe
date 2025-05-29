import React, { useRef, useEffect, useState } from "react";
import CanvasTheme from "./CanvasTheme";

export default function EventCard({ event }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState(null);
  const rect = cardRef.current.getBoundingClientRect()

  useEffect(() => {
    if (cardRef.current) {
    //   const rect = cardRef.current.getBoundingClientRect();
      setCoords({ x: 0, y: 0, width: rect.width, height: rect.height });
    }
  }, []);

  return (
    <div ref={cardRef} className="max-w-80 bg-green-100 p-4 rounded-lg shadow-lg mx-auto relative overflow-hidden flex">
      <CanvasTheme
        selectedTheme={event.theme ? JSON.parse(event.theme).theme : null}
        selectedEmoji={event.theme ? JSON.parse(event.theme).emoji : null}
        canvasColor={event.theme ? JSON.parse(event.theme).canvasColor : null}
        colorScheme={event.theme ? JSON.parse(event.theme).colorScheme : "light"}
        style={{
          position: "absolute",
          zIndex: 0,
          width: rect.width,
          height: rect.height
        }}
        forCard={true}
        coords={coords}
      />
      <div className="rounded-lg overflow-hidden relative z-10 flex-none">
        <img
          src={event.cover_image_url}
          alt={event.title}
          className="aspect-square object-cover max-h-20 max-w-20"
        />
      </div>
      <div className="relative z-10 ml-4 flex-1">
        <h2 className="text-s font-bold">{event.title}</h2>
        <p className="text-xs text-gray-500">
          {new Date(event.start_datetime).toLocaleString()} – {new Date(event.end_datetime).toLocaleString()}
        </p>
        <p className="mt-2 text-xs">{event.description || "No description available"}</p>
        <div className="mt-4 flex space-x-2">
        </div>
      </div>
    </div>
  );
}