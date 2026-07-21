import api from "./axios";

export async function fetchAddresses() {
  const { data } = await api.get("/addresses");
  return data.data;
}

export async function createAddress(payload) {
  const { data } = await api.post("/addresses", payload);
  return data.data;
}