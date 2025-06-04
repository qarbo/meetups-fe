import React, { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useParams } from "react-router-dom";
import EventCard from "../components/EventCard";
import { formatEventDateTime } from '../utils/dateUtils';
import defaultEventImage from "../assets/invitation.png";
import { useTranslation } from 'react-i18next';

export default function EventOverview() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    start_datetime: '',
    end_datetime: '',
    online_link: '',
    description: '',
    visibility: 'public'
  });

  useEffect(() => {
    apiFetch(`/events/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(t('eventOverview.loadError'));
        return res.json();
      })
      .then(data => {
        setEvent(data);
        setEditData({
          title: data.title || '',
          start_datetime: data.start_datetime || '',
          end_datetime: data.end_datetime || '',
          online_link: data.online_link || '',
          description: data.description || '',
          visibility: data.visibility || 'public'
        });
      })
      .catch(console.error);
  }, [id, t]);

  if (!event) return <div className="p-4">Loading…</div>;

  return (
    <>
        <EventCard event={event} />
      <div className="max-w-4xl mx-auto  p-6 space-y-6">
        {/* Header: название + кнопка редактирования */}
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <div className="mt-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => {
              apiFetch(`/events/${id}`)
                .then(res => {
                  if (!res.ok) throw new Error(t('eventOverview.loadError'));
                  return res.json();
                })
                .then(data => {
                  setEditData({
                    title: data.title || '',
                    start_datetime: data.start_datetime || '',
                    end_datetime: data.end_datetime || '',
                    online_link: data.online_link || '',
                    description: data.description || '',
                    visibility: data.visibility || 'public'
                  });
                  setShowEditModal(true);
                })
                .catch(err => {
                  alert(t('eventOverview.loadEditError') + ": " + err.message);
                });
            }}
          >
            {t('eventOverview.editButton')}
          </button>
        </div>

        {/* Основная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold">{t('eventOverview.whenWhere')}</h2>
            <p className="mt-2">
              {formatEventDateTime(event.start_datetime, event.end_datetime)}
            </p>
            <p className="mt-2">
              {event.online_link || <span className="italic text-gray-500">{t('eventOverview.noLocation')}</span>}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{t('eventOverview.details')}</h2>
            <p className="mt-2">{event.description || "-"}</p>
          </div>
        </div>

        {/* Действия */}
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 bg-pink-500 text-white rounded"
            onClick={() => {
              const eventUrl = `${window.location.origin}/events/${id}`;
              navigator.clipboard.writeText(eventUrl)
                .then(() => {
                  setShowCopyNotification(true);
                  setTimeout(() => setShowCopyNotification(false), 3000);
                })
                .catch(() => alert(t('eventOverview.loadError')));
            }}
          >
            {t('eventOverview.share')}
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={() => setShowDeletePopup(true)}
          >
            {t('eventOverview.delete')}
          </button>
        </div>
        {showCopyNotification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
            {t('eventOverview.linkCopied')}
          </div>
        )}
      </div>

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">{t('eventOverview.editTitle')}</h2>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                className="w-full rounded bg-white/30 backdrop-blur-md text-[#1A1A1A] placeholder:text-[#999999] px-3 py-2"
                placeholder={t('eventOverview.titlePlaceholder')}
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
              <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0">
                <input
                  type="datetime-local"
                  className="w-full rounded bg-white/30 backdrop-blur-md text-[#1A1A1A] placeholder:text-[#999999] px-3 py-2"
                  value={editData.start_datetime}
                  onChange={(e) => setEditData({ ...editData, start_datetime: e.target.value })}
                />
                <input
                  type="datetime-local"
                  className="w-full rounded bg-white/30 backdrop-blur-md text-[#1A1A1A] placeholder:text-[#999999] px-3 py-2"
                  value={editData.end_datetime}
                  onChange={(e) => setEditData({ ...editData, end_datetime: e.target.value })}
                />
              </div>
              <input
                type="text"
                className="w-full rounded bg-white/30 backdrop-blur-md text-[#1A1A1A] placeholder:text-[#999999] px-3 py-2"
                placeholder={t('eventOverview.locationPlaceholder')}
                value={editData.online_link}
                onChange={(e) => setEditData({ ...editData, online_link: e.target.value })}
              />
              <textarea
                className="w-full rounded bg-white/30 backdrop-blur-md text-[#1A1A1A] placeholder:text-[#999999] px-3 py-2"
                placeholder={t('eventOverview.descriptionPlaceholder')}
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              />
              <select
                className="w-full rounded bg-white/30 backdrop-blur-md text-[#1A1A1A] placeholder:text-[#999999] px-3 py-2"
                value={editData.visibility}
                onChange={(e) => setEditData({ ...editData, visibility: e.target.value })}
              >
                <option value="public">{t('eventOverview.public')}</option>
                <option value="private">{t('eventOverview.private')}</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => {
                  apiFetch(`/events/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editData)
                  })
                    .then(res => {
                      if (!res.ok) throw new Error(t('eventOverview.loadError'));
                      return res.json();
                    })
                    .then(updatedEvent => {
                      setEvent(updatedEvent);
                      setShowEditModal(false);
                    })
                    .catch(err => alert(err.message));
                }}
              >
                {t('eventOverview.save')}
              </button>
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowEditModal(false)}
              >
                {t('eventOverview.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-red-600">{t('eventOverview.confirmDeleteTitle')}</h2>
            <p>{t('eventOverview.confirmDeleteBody')}</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => {
                  apiFetch(`/events/${id}`, { method: 'DELETE' })
                    .then(() => window.location.href = "/")
                    .catch(err => alert(t('eventOverview.deleteError')));
                }}
              >
                {t('eventOverview.delete')}
              </button>
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowDeletePopup(false)}
              >
                {t('eventOverview.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}