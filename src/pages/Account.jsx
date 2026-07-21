import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchMyOrders } from "../api/orders";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import { formatCurrency } from "../utils/currency";

// خطوات العرض المبسطة للعميل (4 مراحل)، بندمج فيها حالات الباك اند الداخلية
const STEPS = [
  { key: "pending", label: "قيد الانتظار" },
  { key: "preparing", label: "قيد التجهيز" },
  { key: "shipped", label: "تم الشحن" },
  { key: "delivered", label: "تم التوصيل" },
];

// تحويل الحالة التفصيلية من الباك اند لمرحلة العرض المبسطة
function statusToStep(orderStatus) {
  switch (orderStatus) {
    case "pending":
      return "pending";
    case "confirmed":
    case "preparing":
      return "preparing";
    case "packed":
    case "shipped":
      return "shipped";
    case "delivered":
      return "delivered";
    default:
      return "pending";
  }
}

const STATUS_LABELS = {
  pending: "قيد الانتظار",
  confirmed: "تم التأكيد",
  preparing: "قيد التجهيز",
  packed: "تم التغليف",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

function OrderTimeline({ orderStatus }) {
  if (orderStatus === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2 text-sm font-semibold">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        تم إلغاء هذا الطلب
      </div>
    );
  }

  const currentStep = statusToStep(orderStatus);
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-start justify-between gap-1 py-2">
      {STEPS.map((step, idx) => {
        const done = idx <= currentIndex;
        const isLast = idx === STEPS.length - 1;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 text-center w-16">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                {done ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                )}
              </div>
              <span className={`text-[11px] leading-tight ${done ? "text-teal-700 font-semibold" : "text-gray-400"}`}>{step.label}</span>
            </div>
            {!isLast && <div className={`flex-1 h-0.5 mb-5 ${idx < currentIndex ? "bg-teal-600" : "bg-gray-200"}`} />}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const items = order.items || [];
  const address = order.address;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-start gap-4 flex-wrap mb-4">
        <div className="text-right">
          <p className="font-bold text-gray-900">طلب رقم #{order.order_number ?? order.id}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {order.created_at ? new Date(order.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }) : ""}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">{formatCurrency(order.total)}</p>
          <span className={`inline-block text-xs font-semibold mt-1 px-2.5 py-1 rounded-full ${order.order_status === "cancelled" ? "bg-red-50 text-red-600" :
              order.order_status === "delivered" ? "bg-green-50 text-green-700" : "bg-teal-50 text-teal-700"
            }`}>
            {STATUS_LABELS[order.order_status] || order.order_status}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-500 mb-1 text-right font-semibold">تتبع الحالة:</p>
        <OrderTimeline orderStatus={order.order_status} />
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full mt-2 bg-teal-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-teal-700 transition"
      >
        {expanded ? "إخفاء التفاصيل" : "عرض التفاصيل"}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
          {items.length === 0 && <p className="text-sm text-gray-400 text-center">لا توجد تفاصيل لعناصر هذا الطلب.</p>}
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
              {/* أيقونة placeholder بدل الصورة (مش متاحة في الباك اند) */}
              <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>

              <div className="flex-1 min-w-0 text-right">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.product_name}</p>

                <div className="flex items-center gap-2 mt-1.5 flex-wrap justify-end">
                  {item.variant && (
                    <span className="text-[11px] bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md">
                      {item.variant}
                    </span>
                  )}
                  <span className="text-[11px] bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md">
                    {item.quantity} × {formatCurrency(item.unit_price)}
                  </span>
                </div>
              </div>

              <p className="text-sm font-bold text-gray-900 flex-shrink-0">{formatCurrency(item.total_price)}</p>
            </div>
          ))}

          {/* ملخص الأسعار */}
          <div className="text-right text-sm space-y-1.5 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-gray-500">
              <span>الإجمالي الفرعي</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>الخصم</span>
                <span>- {formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>الشحن</span>
              <span>{order.shipping_cost > 0 ? formatCurrency(order.shipping_cost) : "مجاني"}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-1.5 border-t border-gray-100">
              <span>الإجمالي</span>
              <span className="text-teal-600">{formatCurrency(order.total)}</span>
            </div>
          </div>

          {/* العنوان وطريقة الدفع */}
          <div className="text-right text-xs text-gray-500 pt-3 border-t border-gray-100 space-y-1">
            <p>
              <span className="font-semibold text-gray-700">العنوان: </span>
              {address ? `${address.street}، ${address.area}، ${address.city}` : "—"}
            </p>
            <p>
              <span className="font-semibold text-gray-700">طريقة الدفع: </span>
              {order.payment_method === "cod" ? "الدفع عند الاستلام" : order.payment_method}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Account() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders().then((data) => { setOrders(data); setLoading(false); });
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const activeOrders = orders.filter((o) => !["delivered", "cancelled"].includes(o.order_status));
  const pastOrders = orders.filter((o) => ["delivered", "cancelled"].includes(o.order_status));

  return (
    <div dir="rtl" className="max-w-4xl mx-auto px-4 md:px-10 py-10 min-h-[60vh]">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">حسابي</h1>
        {activeOrders.length > 0 && (
          <div className="bg-teal-50 border border-teal-100 rounded-xl px-5 py-2.5 flex items-center gap-3">
            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <div className="text-right">
              <p className="text-xs text-teal-700">الطلبات النشطة</p>
              <p className="text-lg font-bold text-teal-800">{String(activeOrders.length).padStart(2, "0")}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-8 flex items-center justify-between flex-wrap gap-4">
        <div className="text-right">
          <p className="font-bold text-gray-900 text-lg">{user?.name}</p>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <Link to="/dashboard" className="border border-teal-600 text-teal-600 px-5 py-2 rounded-full text-sm font-semibold hover:bg-teal-50">لوحة التحكم</Link>
          )}
          <button onClick={handleLogout} className="border border-gray-300 text-gray-700 px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-100">تسجيل الخروج</button>
        </div>
      </div>

      {loading ? (
        <Spinner label="جارِ تحميل الطلبات..." />
      ) : orders.length === 0 ? (
        <EmptyState title="لا توجد طلبات سابقة" actionLabel="ابدأ التسوق" onAction={() => navigate("/")} />
      ) : (
        <>
          {activeOrders.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4 text-right">الطلبات الجارية</h2>
              <div className="flex flex-col gap-4">
                {activeOrders.map((o) => <OrderCard key={o.id} order={o} />)}
              </div>
            </div>
          )}

          {pastOrders.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 text-right">طلبات سابقة</h2>
              <div className="flex flex-col gap-4">
                {pastOrders.map((o) => <OrderCard key={o.id} order={o} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}