import api from "./axios";

export async function createOrder(payload) {
  const { data } = await api.post(`/orders`, payload);
  return data.data ?? data;
}

export async function fetchMyOrders() {
  try {
    const { data } = await api.get(`/orders`);
    return data.data ?? data;
  } catch (err) {
    return [];
  }
}

// -------- Admin (Dashboard) --------
export async function adminListOrders() {
  const { data } = await api.get(`/admin/orders`);
  return data.data ?? data;
}

export async function adminUpdateOrderStatus(id, status, note = null) {
  const { data } = await api.put(`/admin/orders/${id}/status`, { status, note });
  return data.data ?? data;
}

export async function adminFetchStats() {
  const { data } = await api.get(`/admin/stats`);
  return data.data ?? data;
}

export async function adminUpdateShippingCost(orderId, shippingCost) {
  const response = await api.patch(`/admin/orders/${orderId}/shipping-cost`, {
    shipping_cost: shippingCost,
  });
  return response.data.data;
}