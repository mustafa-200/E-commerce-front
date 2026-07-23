import api from "./axios";

export async function fetchCategories() {
  const { data } = await api.get("/categories");
  return data.data ?? [];
}

// -------- Admin (Dashboard) --------

function buildCategoryFormData(payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (key === "image") {
      if (value instanceof File) formData.append("image", value);
      return;
    }
    if (typeof value === "boolean") {
      formData.append(key, value ? "1" : "0");
      return;
    }
    formData.append(key, value);
  });
  return formData;
}

export async function adminCreateCategory(payload) {
  const formData = buildCategoryFormData(payload);
  const { data } = await api.post(`/admin/categories`, formData, {
    headers: { "Content-Type": undefined },
  });
  return data;
}

export async function adminUpdateCategory(id, payload) {
  const formData = buildCategoryFormData(payload);
  formData.append("_method", "PUT");
  const { data } = await api.post(`/admin/categories/${id}`, formData, {
    headers: { "Content-Type": undefined },
  });
  return data;
}

export async function adminDeleteCategory(id) {
  const { data } = await api.delete(`/admin/categories/${id}`);
  return data;
}