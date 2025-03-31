import React, { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [inviteEnabled, setInviteEnabled] = useState(false);
  const [inviteEmails, setInviteEmails] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [inviteBody, setInviteBody] = useState("");

  const addEmail = (email) => {
    const cleaned = email.trim();
    if (
      cleaned &&
      /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/g.test(cleaned) &&
      !inviteEmails.includes(cleaned)
    ) {
      setInviteEmails([...inviteEmails, cleaned]);
    }
  };

  const handleEmailKey = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addEmail(emailInput);
      setEmailInput("");
    }
  };

  const removeEmail = (emailToRemove) => {
    setInviteEmails(inviteEmails.filter((e) => e !== emailToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      title,
      date,
      location,
      description,
      invites: inviteEnabled
        ? {
            emails: inviteEmails,
            body: inviteBody,
          }
        : null,
    };
    console.log("Создано мероприятие:", newEvent);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">Создать мероприятие</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Основные поля */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Название</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Дата и время</label>
          <input
            type="datetime-local"
            className="w-full border rounded px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Местоположение</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Описание</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Чекбокс + форма приглашения */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="invite"
            checked={inviteEnabled}
            onChange={() => setInviteEnabled(!inviteEnabled)}
          />
          <label htmlFor="invite" className="text-sm font-medium text-gray-700">
            Отправить приглашения
          </label>
        </div>

        {inviteEnabled && (
          <div className="border p-4 rounded bg-gray-50 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email-адреса
              </label>
              <div className="w-full border rounded px-3 py-2 flex flex-wrap gap-2 min-h-[50px]">
                {inviteEmails.map((email, idx) => (
                  <span
                    key={idx}
                    className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full flex items-center space-x-1 text-sm"
                  >
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                      className="ml-1 text-teal-700 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  className="flex-grow outline-none text-sm"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={handleEmailKey}
                  placeholder="Добавить email и нажать Enter"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Текст приглашения
              </label>
              <ReactQuill value={inviteBody} onChange={setInviteBody} />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700"
        >
          Создать мероприятие
        </button>
      </form>
    </div>
  );
}