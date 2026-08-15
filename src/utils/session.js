import api from "@/api";

export function getSessionAccount() {
  try {
    const raw = localStorage.getItem("session");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function hasActiveSession() {
  if (localStorage.getItem("sessionToken")) return true;

  const account = getSessionAccount();
  return account && account.type === "office";
}

export function clearAdminSession() {
  localStorage.removeItem("session");
  localStorage.removeItem("sessionToken");
}

// Solo el admin tiene token en el backend; las sucursales siguen siendo locales.
export async function isAdminSessionValid() {
  if (!localStorage.getItem("sessionToken")) return true;

  try {
    const { data } = await api.auth.SESSION();
    return !(data && data.error);
  } catch (e) {
    const status = e && e.response && e.response.status;
    if (status === 401 || status === 403) return false;
    // Ante fallos de red no expulsamos para no cortar la sesión por un corte momentáneo.
    return true;
  }
}

export async function enforceAdminSession() {
  const valid = await isAdminSessionValid();
  if (valid) return true;

  clearAdminSession();
  if (window.location.pathname !== "/login") window.location.replace("/login");
  return false;
}
