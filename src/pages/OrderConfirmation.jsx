import React from "react";
import { useLocation, Link } from "react-router-dom";
import { formatCurrency } from "../utils/currency";

export default function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div dir="rtl" className="max-w-2xl mx-auto px-4 py-24 text-center min-h-[60vh]">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">تم استلام طلبك بنجاح!</h1>
      <p className="text-gray-600 mb-2">شكراً لتسوقك معنا. سيتم التواصل معك قريباً لتأكيد التوصيل.</p>
      {order?.order_number && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 inline-flex flex-col gap-1 mb-8">
          <p className="text-gray-500">رقم الطلب: <span className="font-semibold text-gray-800">#{order.order_number}</span></p>
          {order.total != null && <p className="text-gray-500">الإجمالي: <span className="font-semibold text-gray-800">{formatCurrency(order.total)}</span></p>}
        </div>
      )}
      <div>
        <Link to="/" className="inline-block bg-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-teal-700">العودة للرئيسية</Link>
      </div>
    </div>
  );
}
