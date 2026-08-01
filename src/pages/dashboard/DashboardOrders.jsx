import React, { useEffect, useMemo, useState } from "react";
import { adminListOrders, adminUpdateOrderStatus, adminUpdateShippingCost } from "../../api/orders";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Alert from "../../components/ui/Alert";
import { formatCurrency } from "../../utils/currency";

const STATUSES = ["pending", "confirmed", "preparing", "packed", "shipped", "delivered", "cancelled"];

const STATUS_LABELS = {
  pending: "قيد الانتظار",
  confirmed: "تم التأكيد",
  preparing: "قيد التجهيز",
  packed: "تم التغليف",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-cyan-50 text-cyan-700",
  preparing: "bg-blue-50 text-blue-700",
  packed: "bg-purple-50 text-purple-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-600",
};

const TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["packed"],
  packed: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const SHIPPING_LOCKED_STATUSES = ["delivered", "cancelled"];

function ShippingCostInline({ order, onShippingUpdated }) {
  const [value, setValue] = useState(order.shipping_cost ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isLocked = SHIPPING_LOCKED_STATUSES.includes(order.order_status);

  useEffect(() => {
    setValue(order.shipping_cost ?? "");
  }, [order.shipping_cost]);

  const handleBlurOrSave = async () => {
    setError(null);
    const numericValue = Number(value);

    if (numericValue === Number(order.shipping_cost ?? 0)) return;

    if (value === "" || isNaN(numericValue) || numericValue < 0) {
      setError("قيمة غير صحيحة");
      setValue(order.shipping_cost ?? "");
      return;
    }

    setSaving(true);
    try {
      const updatedOrder = await adminUpdateShippingCost(order.id, numericValue);
      onShippingUpdated(updatedOrder);
    } catch (err) {
      setError(err?.response?.data?.message || "تعذر تحديث سعر الشحن");
      setValue(order.shipping_cost ?? "");
    } finally {
      setSaving(false);
    }
  };

  if (isLocked) {
    return (
      <div className="text-xs text-gray-500 text-center">
        <p className="mb-0.5">الشحن</p>
        <p className="font-semibold text-gray-700">{formatCurrency(order.shipping_cost)}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[11px] text-gray-500">الشحن</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          disabled={saving}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlurOrSave}
          onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
          className="border border-gray-300 rounded-lg px-2 py-1 w-20 text-sm text-center disabled:opacity-50"
          placeholder="0.00"
        />
      </div>
      {error && <span className="text-[10px] text-red-600">{error}</span>}
    </div>
  );
}

function OrderRow({ order, onStatusChange, updating, onShippingUpdated }) {
  const [expanded, setExpanded] = useState(false);
  const items = order.items || [];
  const address = order.address;
  const allowedNext = TRANSITIONS[order.order_status] || [];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setExpanded((v) => !v)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <svg className={`w-5 h-5 transition-transform ${expanded ? "-rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="text-right">
            <p className="font-bold text-gray-900">طلب #{order.order_number ?? order.id}</p>
            <p className="text-xs text-gray-500">
              {order.created_at ? new Date(order.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" }) : ""}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-semibold text-gray-800">{address?.full_name ?? "—"}</p>
          <p className="text-xs text-gray-500">{address?.phone ?? "—"}</p>
        </div>

        <p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>

        <ShippingCostInline order={order} onShippingUpdated={onShippingUpdated} />

        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.order_status] || "bg-gray-100 text-gray-600"}`}>
          {STATUS_LABELS[order.order_status] || order.order_status}
        </span>

        <select
          value={order.order_status}
          disabled={updating || allowedNext.length === 0}
          onChange={(e) => onStatusChange(order.id, e.target.value)}
          className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm disabled:opacity-50"
        >
          <option value={order.order_status}>{STATUS_LABELS[order.order_status]}</option>
          {allowedNext.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/60 p-4">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">المنتجات ({items.length})</p>
              {items.length === 0 ? (
                <p className="text-sm text-gray-400">لا توجد تفاصيل منتجات لهذا الطلب.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 bg-white border border-gray-100 rounded-lg p-2">
                      <div className="flex-1 text-right min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.product_name}</p>
                        {item.variant && (
                          <p className="text-xs text-gray-500">{item.variant}</p>
                        )}
                        <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 flex-shrink-0">{formatCurrency(item.total_price)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="text-right text-sm text-gray-600 space-y-2">
              <p><span className="font-semibold text-gray-800">العنوان: </span>{address ? `${address.street}، ${address.area}، ${address.city}` : "—"}</p>
              <p><span className="font-semibold text-gray-800">طريقة الدفع: </span>{order.payment_method === "cod" ? "الدفع عند الاستلام" : order.payment_method}</p>
              <p><span className="font-semibold text-gray-800">الإجمالي الفرعي: </span>{formatCurrency(order.subtotal)}</p>
              {order.discount > 0 && (
                <p><span className="font-semibold text-gray-800">الخصم: </span>{formatCurrency(order.discount)}</p>
              )}
              <p><span className="font-semibold text-gray-800">الشحن: </span>{formatCurrency(order.shipping_cost)}</p>
              <p className="pt-2 border-t border-gray-200"><span className="font-semibold text-gray-800">الإجمالي الكلي: </span>{formatCurrency(order.total)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState(null);

  const load = () => {
    setLoading(true);
    adminListOrders()
      .then((data) => { setOrders(data); setConnected(true); })
      .catch(() => setConnected(false))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const updatedOrder = await adminUpdateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? updatedOrder : o)));
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "تعذر تحديث حالة الطلب.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleShippingUpdated = (updatedOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "all" || o.order_status === statusFilter;
      const matchesSearch =
        !search.trim() ||
        o.address?.full_name?.toLowerCase().includes(search.trim().toLowerCase()) ||
        String(o.order_number ?? o.id).includes(search.trim());
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  if (!connected && !loading) {
    return (
      <Alert type="error" message="لا يوجد اتصال بالـ Laravel API حالياً (GET /api/v1/admin/orders). لن تظهر الطلبات إلا بعد تشغيل الـ backend." />
    );
  }

  return (
    <div className="text-right">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-lg font-bold text-gray-900">الطلبات {!loading && `(${orders.length})`}</h2>
      </div>

      <Alert type={message?.type} message={message?.text} onClose={() => setMessage(null)} />

      {!loading && orders.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <input
            placeholder="ابحث برقم الطلب أو اسم العميل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-right flex-1 min-w-[200px]"
          />
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${statusFilter === "all" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              الكل
            </button>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${statusFilter === s ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <Spinner label="جارِ تحميل الطلبات..." />
      ) : orders.length === 0 ? (
        <EmptyState title="لا توجد طلبات بعد" description="هتظهر هنا أول ما العملاء يبدأوا يطلبوا." />
      ) : filtered.length === 0 ? (
        <EmptyState title="لا توجد طلبات مطابقة" description="جرب تغيير الفلتر أو كلمة البحث." />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((o) => (
            <OrderRow
              key={o.id}
              order={o}
              onStatusChange={handleStatusChange}
              updating={updatingId === o.id}
              onShippingUpdated={handleShippingUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}