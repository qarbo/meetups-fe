const API_PORT = process.env.REACT_APP_API_PORT || "8000";
export const API_BASE =
  window.location.hostname === "localhost"
    ? `${window.location.protocol}//${window.location.hostname}:${API_PORT}`
    : "/api";

export async function apiFetch(input, init = {}) {
  const response = await fetch(`${API_BASE}${input}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (response.status === 401 || response.status === 404) {
    localStorage.removeItem("token");          
    window.location.replace("/");
    return;
  }

  return response;
}
