import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import EmptyState from "../components/ui/EmptyState";
import { formatCurrency } from "../utils/currency";

export default function Cart() {
  const { items, updateQty, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div dir="rtl" className="max-w-3xl mx-auto px-4 py-16 min-h-[50vh]">
        <EmptyState
          title="سلتك فارغة"
          description="لم تقم بإضافة أي منتجات بعد."
          actionLabel="تصفح المنتجات"
          onAction={() => navigate("/")}
        />
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-5xl mx-auto px-4 md:px-10 py-10 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-right">سلة التسوق</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4"
            >
              <ImageWithFallback
                src={item.product?.image}
                alt={item.product?.name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />

              <div className="flex-1 text-right min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {item.product?.name ?? "منتج غير متاح"}
                </p>

                {item.variant?.attributes?.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {item.variant.attributes
                      .map((a) => `${a.attribute}: ${a.value}`)
                      .join(" · ")}
                  </p>
                )}

                <p className="text-sm text-gray-500 mt-1">
                  {formatCurrency(item.variant?.price ?? 0)}
                </p>
              </div>

              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden flex-shrink-0">
                <button
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                >
                  −
                </button>
                <span className="px-3 font-semibold">{item.quantity}</span>
                <button
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 text-sm font-semibold px-2 flex-shrink-0"
              >
                حذف
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-6 h-fit text-right">
          <h2 className="font-bold text-lg text-gray-900 mb-4">ملخص الطلب</h2>

          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>الإجمالي</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>الشحن</span>
            <span>يُحدد عند الدفع</span>
          </div>

          <div className="border-t border-gray-300 pt-4 flex justify-between font-bold text-gray-900 mb-6">
            <span>المجموع</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-teal-600 text-white py-3 rounded-full font-semibold hover:bg-teal-700 transition-all active:scale-95"
          >
            إتمام الشراء
          </button>
        </div>
      </div>
    </div>
  );
}