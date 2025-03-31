import React, { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Alice", text: "Привет!" },
    { id: 2, sender: "Bob", text: "Привет, как дела?" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "You",
        text: newMessage,
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar with chats or contacts */}
      <aside className="w-1/4 border-r p-4">
        <h2 className="text-xl font-bold mb-4">Чаты</h2>
        <ul>
          <li className="mb-2 cursor-pointer hover:underline">Общий чат</li>
          <li className="mb-2 cursor-pointer hover:underline">Рабочий чат</li>
          <li className="mb-2 cursor-pointer hover:underline">Приватные</li>
        </ul>
      </aside>
      {/* Main chat window */}
      <main className="flex-1 flex flex-col p-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Общий чат</h2>
        </div>
        <div className="flex-1 border rounded p-4 overflow-y-auto mb-4">
          {messages.map((message) => (
            <div key={message.id} className="mb-2">
              <span className="font-bold">{message.sender}: </span>
              <span>{message.text}</span>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-1 border rounded px-4 py-2"
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <button onClick={handleSendMessage} className="ml-2 bg-teal-600 text-white px-4 rounded">
            Отправить
          </button>
        </div>
      </main>
    </div>
  );
}