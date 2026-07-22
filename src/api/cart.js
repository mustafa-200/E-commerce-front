import api from "./axios";

const GUEST_SESSION_KEY = "guest_session_id";

export function getGuestSessionId() {
  let sessionId = localStorage.getItem(GUEST_SESSION_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(GUEST_SESSION_KEY, sessionId);
  }

  return sessionId;
}

function guestHeaders() {
  const token = localStorage.getItem("token");

  if (token) return {};

  return {
    "X-Guest-Session-ID": getGuestSessionId(),
  };
}

export async function fetchCart() {
  const { data } = await api.get("/cart", {
    headers: guestHeaders(),
  });

  return data.data;
}

export async function addItemToCart(productVariantId, quantity = 1) {
  const { data } = await api.post(
    "/cart",
    {
      product_variant_id: productVariantId,
      quantity,
    },
    {
      headers: guestHeaders(),
    }
  );

  return data.data;
}

export async function updateCartItem(cartItemId, quantity) {
  const { data } = await api.put(
    `/cart/${cartItemId}`,
    {
      quantity,
    },
    {
      headers: guestHeaders(),
    }
  );

  return data.data;
}

export async function removeCartItem(cartItemId) {
  await api.delete(`/cart/${cartItemId}`, {
    headers: guestHeaders(),
  });
}

export async function mergeGuestCart() {
  const sessionId = localStorage.getItem(GUEST_SESSION_KEY);

  // هنا عكس القاعدة العادية: لازم نبعت الـ Guest Session ID حتى لو
  // فيه توكن، لأن الهدف من الطلب ده تحديدًا هو الربط بين الاتنين
  const headers = sessionId ? { "X-Guest-Session-ID": sessionId } : {};

  const { data } = await api.post("/cart/merge", {}, { headers });
  return data.data;
}