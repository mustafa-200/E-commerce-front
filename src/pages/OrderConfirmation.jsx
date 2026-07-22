import React from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { formatCurrency } from "../utils/currency";

export default function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;

  // لو المستخدم فتح اللينك مباشرة من غير ما يعدي بعملية شراء فعلية
  // (يعني مفيش order في الـ state)، نرجّعه للرئيسية بدل ما يشوف صفحة فاضية
  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div dir="rtl" className="max-w-2xl mx-auto px-4 py-12 md:py-20 min-h-[70vh]">
      {/* أيقونة النجاح */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center animate-fade-in">
          <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">تم استلام طلبك بنجاح!</h1>
        <p className="text-gray-500">شكراً لتسوقك معنا، سيتم التواصل معك قريباً لتأكيد التوصيل.</p>
      </div>

      {/* رقم الطلب والإجمالي */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 flex items-center justify-between mb-6">
        <div className="text-right">
          <p className="text-xs text-teal-700 mb-1">رقم الطلب</p>
          <p className="font-bold text-teal-900 text-lg">#{order.order_number}</p>
        </div>
        <div className="text-left">
          <p className="text-xs text-teal-700 mb-1">الإجمالي</p>
          <p className="font-bold text-teal-900 text-lg">{formatCurrency(order.total)}</p>
        </div>
      </div>

      {/* تفاصيل المنتجات */}
      {order.items?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
          <h2 className="text-sm font-bold text-gray-700 mb-3 text-right">المنتجات ({order.items.length})</h2>
          <div className="flex flex-col gap-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl p-3">
                <div className="text-right flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.product_name}</p>
                  {item.variant && <p className="text-xs text-gray-500">{item.variant}</p>}
                  <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-gray-800 flex-shrink-0">{formatCurrency(item.total_price)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ملخص السعر */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 text-sm space-y-2">
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
        <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
          <span>الإجمالي</span>
          <span className="text-teal-600">{formatCurrency(order.total)}</span>
        </div>
      </div>

      {/* العنوان وطريقة الدفع */}
      {order.address && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 text-sm text-gray-600 space-y-1.5 text-right">
          <p>
            <span className="font-semibold text-gray-800">عنوان التوصيل: </span>
            {order.address.street}، {order.address.area}، {order.address.city}
          </p>
          <p>
            <span className="font-semibold text-gray-800">طريقة الدفع: </span>
            {order.payment_method === "cod" ? "الدفع عند الاستلام" : order.payment_method}
          </p>
        </div>
      )}

      {/* أزرار */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/account"
          className="flex-1 text-center bg-teal-600 text-white py-3.5 rounded-full font-semibold hover:bg-teal-700 transition-all active:scale-95"
        >
          تتبع طلبي
        </Link>
        <Link
          to="/"
          className="flex-1 text-center border border-gray-300 text-gray-700 py-3.5 rounded-full font-semibold hover:bg-gray-50 transition-all active:scale-95"
        >
          العودة للرئيسية
        </Link>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}