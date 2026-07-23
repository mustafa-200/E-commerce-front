import api from "./axios";

// -------- Storefront (Public) --------
export async function fetchLatestProducts(limit = 8) {
  const { data } = await api.get(`/products`, { params: { featured: true, limit } });
  return data.data ?? [];
}

export async function fetchProductsByCategory(categoryId, sort = null) {
  const { data } = await api.get(`/products`, { params: { category_id: categoryId, sort } });
  return data.data ?? [];
}

export async function fetchProduct(slug) {
  const { data } = await api.get(`/products/${slug}`);
  return data.data ?? null;
}

export async function searchProducts(query) {
  const { data } = await api.get(`/products`, { params: { search: query } });
  return data.data ?? [];
}

// -------- Admin: Product --------
export async function adminListProducts() {
  const { data } = await api.get(`/admin/products`);
  return data.data ?? [];
}

export async function adminGetProduct(id) {
  const { data } = await api.get(`/admin/products/${id}`);
  return data.data ?? null;
}

export async function adminCreateProduct(product) {
  const { data } = await api.post(`/admin/products`, product);
  return data.data ?? data;
}

export async function adminUpdateProduct(id, product) {
  const { data } = await api.put(`/admin/products/${id}`, product);
  return data.data ?? data;
}

export async function adminDeleteProduct(id) {
  const { data } = await api.delete(`/admin/products/${id}`);
  return data;
}

export async function adminToggleFeatured(id) {
  const { data } = await api.patch(`/admin/products/${id}/toggle-featured`);
  return data;
}

// -------- Admin: Variants --------
export async function adminCreateVariant(productId, variant) {
  const { data } = await api.post(`/admin/products/${productId}/variants`, variant);
  return data.data ?? data;
}

export async function adminUpdateVariant(variantId, variant) {
  const { data } = await api.put(`/admin/variants/${variantId}`, variant);
  return data.data ?? data;
}

export async function adminDeleteVariant(variantId) {
  await api.delete(`/admin/variants/${variantId}`);
}

// -------- Admin: Images --------
export async function adminAddProductImage(productId, file, isPrimary = false) {
  const formData = new FormData();
  formData.append("image", file);
  if (isPrimary) formData.append("is_primary", "1");
  const { data } = await api.post(`/admin/products/${productId}/images`, formData, {
    headers: { "Content-Type": undefined },
  });
  return data.data ?? data;
}

export async function adminDeleteProductImage(imageId) {
  await api.delete(`/admin/product-images/${imageId}`);
}