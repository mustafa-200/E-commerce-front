import api from "./axios";

// category_id اختياري: لو اتبعت، السيرفر بيرجع خصائص القسم ده + الخصائص العامة فقط
export async function fetchAttributes(categoryId) {
  const { data } = await api.get(`/admin/attributes`, {
    params: categoryId ? { category_id: categoryId } : {},
  });
  return data.data ?? data;
}

// -------- Admin (Dashboard) CRUD --------

export async function adminCreateAttribute(payload) {
  // payload: { name, slug?, category_id?: number|null, values?: string[] }
  const { data } = await api.post(`/admin/attributes`, payload);
  return data.data ?? data;
}

export async function adminUpdateAttribute(id, payload) {
  const { data } = await api.put(`/admin/attributes/${id}`, payload);
  return data.data ?? data;
}

export async function adminDeleteAttribute(id) {
  const { data } = await api.delete(`/admin/attributes/${id}`);
  return data;
}

export async function adminAddAttributeValue(attributeId, value) {
  const { data } = await api.post(`/admin/attributes/${attributeId}/values`, { value });
  return data.data ?? data;
}

export async function adminDeleteAttributeValue(attributeValueId) {
  const { data } = await api.delete(`/admin/attribute-values/${attributeValueId}`);
  return data;
}