import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError("بيانات الدخول غير صحيحة، تأكد من البريد وكلمة المرور.");
    }
  };

  return (
    <div dir="rtl" className="max-w-md mx-auto px-4 py-16 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-right">تسجيل الدخول</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-right">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">البريد الإلكتروني</label>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">كلمة المرور</label>
          <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="bg-teal-600 disabled:bg-gray-300 text-white py-3 rounded-full font-semibold hover:bg-teal-700 transition-all active:scale-95">
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
      <p className="text-sm text-gray-600 text-center mt-6">
        ليس لديك حساب؟ <Link to="/register" className="text-teal-600 font-semibold hover:underline">إنشاء حساب جديد</Link>
      </p>
    </div>
  );
}
