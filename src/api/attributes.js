import api from "./axios";

export async function fetchAttributes() {
  const { data } = await api.get(`/admin/attributes`);
  return data.data ?? data;
}