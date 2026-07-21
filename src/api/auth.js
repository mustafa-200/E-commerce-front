import api from "./axios";
import { clearGuestSessionId } from "../utils/guestSession";

export async function login(email, password) {
  const guestSessionId = localStorage.getItem("guest_session_id");

  const { data } = await api.post("/auth/login", {
    email,
    password,
    guest_session_id: guestSessionId,
  });

  // clearGuestSessionId();

  return data.data;
}

export async function register(payload) {
  const { data } = await api.post("/auth/register", payload);

  return data.data;
}

export async function logout() {
  try {
    await api.post(`/auth/logout`);
  } catch (err) { }
}

export async function fetchMe() {
  const { data } = await api.get(`/auth/me`);
  return data.data ?? data;
}