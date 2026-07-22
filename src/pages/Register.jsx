import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.password_confirmation) {
      setError("كلمة المرور غير متطابقة.");
      return;
    }
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError("تعذر إنشاء الحساب. تأكد من صحة البيانات.");
    }
  };

  return (
    <div dir="rtl" className="max-w-md mx-auto px-4 py-16 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-right">إنشاء حساب جديد</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-right">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">الاسم</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">البريد الإلكتروني</label>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">كلمة المرور</label>
          <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">تأكيد كلمة المرور</label>
          <input required type="password" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="bg-teal-600 disabled:bg-gray-300 text-white py-3 rounded-full font-semibold hover:bg-teal-700 transition-all active:scale-95">
          {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
        </button>
      </form>
      <p className="text-sm text-gray-600 text-center mt-6">
        لديك حساب بالفعل؟ <Link to="/login" className="text-teal-600 font-semibold hover:underline">تسجيل الدخول</Link>
      </p>
    </div>
  );
}
