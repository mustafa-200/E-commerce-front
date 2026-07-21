import React from "react";

export default function EmptyState({ title = "لا توجد بيانات", description, actionLabel, onAction, icon }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
        {icon || (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h7m5-5v6m-3-3h6M9 8h6M9 12h3" />
          </svg>
        )}
      </div>
      <p className="font-semibold text-gray-700">{title}</p>
      {description && <p className="text-sm text-gray-400 max-w-sm">{description}</p>}
      {actionLabel && (
        <button onClick={onAction} className="mt-2 bg-teal-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-teal-700 transition">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
