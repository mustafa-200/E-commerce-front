import React, { useState } from "react";
import emailjs from "@emailjs/browser";

// ⚠️ لو الإرسال مش شغال، تأكد من القيم دي من حسابك على emailjs.com
const EMAILJS_SERVICE_ID = "service_owgrhnl";
const EMAILJS_TEMPLATE_ID = "template_uhctfvq";
const EMAILJS_PUBLIC_KEY = "GEWI7OT82iZtB0AyT";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);

    try {
      // ✅ بيبعت الرسالة كإيميل مباشرة على إيميلك المسجل في EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY
      );

      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError("حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div dir="rtl" className="max-w-5xl mx-auto px-4 md:px-10 py-16 min-h-[60vh]">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-right">تواصل معنا</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* بيانات التواصل */}
        <div className="text-right flex flex-col gap-6">
          <p className="text-gray-600 leading-7">
            يسعدنا تواصلك معنا في أي وقت. فريقنا جاهز للرد على استفساراتك ومساعدتك بخصوص طلباتك
            أو منتجاتنا.
          </p>

          <div className="flex flex-col gap-4">
            <a href="tel:+201001234567" className="flex items-center gap-3 justify-end text-gray-700 hover:text-teal-600 transition">
              <span>01001234567+ 20</span>
              <span>📞</span>
            </a>
            <a href="mailto:info@fakher.com" className="flex items-center gap-3 justify-end text-gray-700 hover:text-teal-600 transition">
              <span>info@fakher.com</span>
              <span>✉️</span>
            </a>
            <div className="flex items-center gap-3 justify-end text-gray-700">
              <span>جمهورية مصر العربية</span>
              <span>📍</span>
            </div>
            <div className="flex items-center gap-3 justify-end text-gray-700">
              <span>يومياً من 10 صباحاً حتى 10 مساءً</span>
              <span>🕐</span>
            </div>
          </div>
        </div>

        {/* نموذج التواصل */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-right bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 mb-2">أرسل لنا رسالة</h2>

          {sent && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
              تم إرسال رسالتك بنجاح، سنتواصل معك قريباً.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">الاسم</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">البريد الإلكتروني</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">الرسالة</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="bg-teal-600 disabled:bg-gray-300 text-white py-3 rounded-full font-semibold hover:bg-teal-700 transition-all active:scale-95"
          >
            {sending ? "جاري الإرسال..." : "إرسال"}
          </button>
        </form>
      </div>
    </div>
  );
}