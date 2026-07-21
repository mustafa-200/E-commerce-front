import api from "./axios";

export async function fetchSliders() {
  try {
    const { data } = await api.get("/sliders");
    return data.data ?? [];
  } catch (err) {
    return [];
  }
}

// -------- Admin (Dashboard) --------

export async function adminFetchSliders() {
  const { data } = await api.get("/admin/sliders");
  return data.data ?? [];
}

// نفس فكرة buildCategoryFormData بالظبط
function buildSliderFormData(payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (key === "image") {
      if (value instanceof File) formData.append("image", value);
      return;
    }

    // تحويل الـ boolean لـ 1/0 عشان Laravel validation بيرفض "true"/"false" كنص
    if (typeof value === "boolean") {
      formData.append(key, value ? "1" : "0");
      return;
    }

    formData.append(key, value);
  });
  return formData;
}

export async function adminCreateSlider(payload) {
  const formData = buildSliderFormData(payload);
  const { data } = await api.post("/admin/sliders", formData, {
    headers: { "Content-Type": undefined },
  });
  return data;
}

export async function adminUpdateSlider(id, payload) {
  const formData = buildSliderFormData(payload);
  formData.append("_method", "PUT");
  const { data } = await api.post(`/admin/sliders/${id}`, formData, {
    headers: { "Content-Type": undefined },
  });
  return data;
}

export async function adminDeleteSlider(id) {
  const { data } = await api.delete(`/admin/sliders/${id}`);
  return data;
}