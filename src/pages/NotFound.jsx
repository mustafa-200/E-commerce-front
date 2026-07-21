import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div dir="rtl" className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-teal-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-8">الصفحة المطلوبة غير موجودة</p>
      <Link to="/" className="bg-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-teal-700">العودة للرئيسية</Link>
    </div>
  );
}
