function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

export function getGuestSessionId() {
  let id = localStorage.getItem("guest_session_id");
  if (!id) {
    id = generateId();
    localStorage.setItem("guest_session_id", id);
  }
  return id;
}

export function clearGuestSessionId() {
  localStorage.removeItem("guest_session_id");
}