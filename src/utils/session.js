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
