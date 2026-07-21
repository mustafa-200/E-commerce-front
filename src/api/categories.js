import api from "./axios";
import { CATEGORIES } from "../data/mockData";

export async function fetchCategories() {
  try {
    const { data } = await api.get(`/categories`);
    return data.data ?? data;
  } catch (err) {
    return CATEGORIES;
  }
}

// -------- Admin (Dashboard) --------

// نفس فكرة buildProductFormData بالظبط — بنبني FormData عشان نقدر
// نبعت ملف الصورة فعليًا، مش رابط نصي
function buildCategoryFormData(payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (key === "image") {
      // لو المستخدم اختار ملف فعلي من جهازه، نبعته. لو لسه String
      // (يعني معدلش الصورة)، منبعتش الحقل خالص عشان الباك اند يسيب
      // الصورة القديمة زي ما هي
      if (value instanceof File) formData.append("image", value);
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
  // نفس الحل اللي استخدمناه في Products: POST + _method=PUT
  // عشان مشكلة PHP المعروفة مع PUT + multipart/form-data
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