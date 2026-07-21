import React from "react";

// بديل أنيق لـ alert() المتصفح - تنبيه نجاح أو خطأ يتحط جوه الصفحة
export default function Alert({ type = "error", message, onClose }) {
  if (!message) return null;
  const styles = type === "success"
    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
    : "bg-red-50 border-red-200 text-red-600";

  return (
    <div className={`flex items-center justify-between gap-3 border rounded-lg px-4 py-3 text-sm mb-4 ${styles}`} role="alert">
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100 flex-shrink-0" aria-label="إغلاق">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
