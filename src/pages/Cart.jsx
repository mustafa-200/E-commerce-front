import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import EmptyState from "../components/ui/EmptyState";
import { formatCurrency } from "../utils/currency";

export default function Cart() {
  const { items, updateQty, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  const [itemToDelete, setItemToDelete] = useState(null);

  const confirmDelete = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete.id);
      setItemToDelete(null);
    }
  };

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
    <div dir="rtl" className="max-w-5xl mx-auto px-4 md:px-10 py-6 md:py-10 min-h-[60vh]">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-right">
        سلة التسوق
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-center gap-4">
                <ImageWithFallback
                  src={item.product?.image}
                  alt={item.product?.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
                />

                <div className="flex-1 text-right min-w-0 sm:hidden">
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
              </div>

              <div className="hidden sm:block flex-1 text-right min-w-0">
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

              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 flex-shrink-0">
                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
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
                  onClick={() => setItemToDelete(item)}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold px-2 flex-shrink-0"
                >
                  حذف
                </button>
              </div>
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

      {/* ========================= */}
      {/* Delete Confirmation Modal */}
      {/* ========================= */}

      {itemToDelete && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setItemToDelete(null)}
        >
          <div
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2 text-right">
              تأكيد الحذف
            </h3>

            <p className="text-sm text-gray-600 mb-6 text-right">
              هل أنت متأكد أنك تريد حذف "
              <span className="font-semibold text-gray-800">
                {itemToDelete.product?.name ?? "هذا المنتج"}
              </span>
              " من السلة؟
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-all"
              >
                حذف
              </button>
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 border border-gray-300 py-2.5 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}