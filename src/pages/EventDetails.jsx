import React, { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api";
import CanvasTheme from "../components/CanvasTheme";
import defaultEventImage from "../assets/invitation.png";
import "../styles/emojiBackground.css";
import { formatEventDateTime } from '../utils/dateUtils';
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

export default function ViewEvent() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [registrationError, setRegistrationError] = useState(null);
  const { user, isAuthenticated, setShowLogin } = useUser();

  useEffect(() => {
    async function fetchEvent() {
      const res = await apiFetch(`/events/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEventData(data);
        if (isAuthenticated) {
          try {
            const statusRes = await apiFetch(`/events/${id}/status`);
            if (statusRes.ok) {
              const statusData = await statusRes.json();
              setRegistrationStatus(statusData.status);  // "confirmed" | "pending" | etc.
            } else if (statusRes.status === 404) {
              setRegistrationStatus("not_registered");
            }
          } catch (e) {
            console.error("Failed to fetch registration status", e);
          }
        }
      }
    }
    fetchEvent();
  }, [id, isAuthenticated]);

  if (!eventData) return <div className="text-center py-10">{t('eventDetails.loading')}</div>;

  async function handleRegister() {
    try {
      const res = await apiFetch(`/events/${id}/register`, {
        method: 'POST',
      });
      if (res.ok) {
        const statusRes = await apiFetch(`/events/${id}/status`);
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setRegistrationStatus(statusData.status);
        }
      } else {
        setRegistrationError(t('eventDetails.registrationFailed'));
      }
    } catch (error) {
      alert(t('eventDetails.registrationError'));
      console.error(error);
    }
  }

  const {
    title,
    description,
    start_datetime,
    end_datetime,
    online_link,
    ticket_type,
    requires_confirmation,
    capacity,
    cover_image_url,
    theme
  } = eventData;

  const themeSettings = theme ? JSON.parse(theme) : {};
  const {
    canvasColor = "gray",
    colorScheme = "light",
    font = "font-sans",
    emoji = "😀",
    pattern = "pattern1"
  } = themeSettings;

  console.log(emoji, canvasColor, themeSettings.theme, colorScheme)

  const metaDescriptionDate = new Date(start_datetime).toLocaleDateString("ru-RU");

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={t('eventDetails.metaDescription', { date: metaDescriptionDate })} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={cover_image_url || defaultEventImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
      <div style={{ position: "relative" }}>
      <CanvasTheme
        selectedTheme={themeSettings.theme}
        selectedEmoji={emoji}
        canvasColor={canvasColor}
        colorScheme={colorScheme}
      />
      <div className={`min-h-screen px-6 pb-6 ${colorScheme === "light" ? "text-[#1A1A1A]" : "text-white"}`}>
        <div className="max-w-5xl mx-auto rounded-xl p-1 flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full max-w-md">
              <div className="relative w-4/5 sm:w-full mx-auto">
                <img
                  src={cover_image_url || defaultEventImage}
                  alt="preview"
                  className="w-full aspect-square object-cover rounded shadow-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-3 w-full flex flex-col items-start lg:items-stretch">
            <h1 className={`text-2xl font-bold ${font}`}>{title}</h1>
            <p className={`${font}`}>{description}</p>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-start w-12 h-12 rounded-lg shadow bg-white/50 border border-white/40 backdrop-blur-sm overflow-hidden">
                <div className="w-full bg-white/20 text-center text-xs py-1 tracking-wide backdrop-blur-sm">
                  {new Date(start_datetime).toLocaleString("ru-RU", { month: "short" })}
                </div>
                <div className="flex-1 flex items-center justify-center text-sm font-semibold">
                  {new Date(start_datetime).getDate()}
                </div>
              </div>
              <p className={`${font}`}>{formatEventDateTime(start_datetime, end_datetime)}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/50 text-[#1A1A1A] backdrop-blur-sm  border border-white/40">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className={`w-8 h-8 ${colorScheme === "light" ? "text-black" : "text-white"}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 6.854C2 11.02 7.04 15 8 15s6-3.98 6-8.146C14 3.621 11.314 1 8 1S2 3.62 2 6.854" />
                  <path d="M9.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                </svg>
              </div>
              <p className={`${font}`}>{online_link}</p>
            </div>
            <div className="w-full bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/30">
              <div className="text-sm font-mono mb-2 opacity-80">{t('eventDetails.registration')}</div>
              <div className="text-base mb-2">{t('eventDetails.registerPrompt')}</div>
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <img
                      src={user?.avatar_url || "/default-avatar.png"}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-semibold">{user?.name}</span>
                    <span className="text-sm opacity-70">{user?.email}</span>
                  </div>
                  {registrationError && (
                    <div className="text-red-600 font-semibold mb-2">{registrationError}</div>
                  )}
                  {registrationStatus === "confirmed" && (
                    <div className="text-green-600 font-semibold">{t('eventDetails.alreadyRegistered')}</div>
                  )}
                  {registrationStatus === "pending" && (
                    <div className="text-yellow-600 font-semibold">{t('eventDetails.pendingApproval')}</div>
                  )}
                  {registrationStatus === "not_registered" && (
                    <button
                      onClick={handleRegister}
                      className="w-full bg-white text-[#1A1A1A] py-2 rounded shadow-sm hover:bg-[#EEE] transition"
                    >
                      {t('eventDetails.registerButton')}
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="w-full bg-white text-[#1A1A1A] py-2 rounded shadow-sm hover:bg-[#EEE] transition"
                >
                  {t('eventDetails.loginRegister')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}