import React, { useEffect, useState } from "react";
import {
  adminFetchSliders,
  adminCreateSlider,
  adminUpdateSlider,
  adminDeleteSlider,
} from "../../api/sliders";
import ImageWithFallback from "../../components/ui/ImageWithFallback";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Alert from "../../components/ui/Alert";

const emptyForm = { title: "", link: "", sort_order: 0, is_active: true, image: null };

export default function DashboardSliders() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const load = () => {
    setLoading(true);
    adminFetchSliders().then(setSliders).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImagePreview(null);
    setEditingId(null);
    setFormOpen(false);
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setForm({
      title: s.title || "",
      link: s.link || "",
      sort_order: s.sort_order ?? 0,
      is_active: s.is_active,
      image: null,
    });
    setImagePreview(s.image || null);
    setFormOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      if (editingId) await adminUpdateSlider(editingId, form);
      else await adminCreateSlider(form);
      setMessage({ type: "success", text: editingId ? "تم حفظ التعديلات بنجاح" : "تمت إضافة السلايدر بنجاح" });
      resetForm();
      load();
    } catch (err) {
      const msg = err?.response?.data?.message || "تعذر حفظ السلايدر - تأكد من اتصال الـ backend.";
      setMessage({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل تريد حذف هذا السلايدر؟")) return;
    try {
      await adminDeleteSlider(id);
      setMessage({ type: "success", text: "تم حذف السلايدر" });
      load();
    } catch (err) {
      setMessage({ type: "error", text: "تعذر حذف السلايدر." });
    }
  };

  return (
    <div className="text-right">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">
          السلايدرز {!loading && `(${sliders.length})`}
        </h2>
        {!formOpen && (
          <button
            onClick={() => { setFormOpen(true); setEditingId(null); }}
            className="bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-teal-700"
          >
            + إضافة سلايدر
          </button>
        )}
      </div>

      <Alert type={message?.type} message={message?.text} onClose={() => setMessage(null)} />

      {formOpen && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">{editingId ? "تعديل سلايدر" : "سلايدر جديد"}</h3>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600">إغلاق</button>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              صورة السلايدر <span className="text-gray-400">(المقاس المفضّل: 1600×600 بكسل تقريبًا)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              required={!editingId}
              onChange={handleImageChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />
          </div>

          {imagePreview && (
            <div className="mb-4">
              <span className="text-xs text-gray-500 block mb-1">معاينة:</span>
              <ImageWithFallback
                src={imagePreview}
                alt="معاينة"
                className="w-full h-40 rounded-lg object-cover border border-gray-200"
              />
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <input
              placeholder="العنوان (اختياري)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-right"
            />
            <input
              placeholder="الرابط عند الضغط (اختياري، مثال: /category/shoes)"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-right"
              dir="ltr"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">ترتيب الظهور</label>
              <input
                type="number"
                min="0"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">مفعّل ويظهر في الموقع</label>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-60"
            >
              {saving ? "جارِ الحفظ..." : editingId ? "حفظ التعديل" : "إضافة سلايدر"}
            </button>
            <button type="button" onClick={resetForm} className="border border-gray-300 px-6 py-2 rounded-lg font-semibold">
              إلغاء
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <Spinner label="جارِ تحميل السلايدرز..." />
      ) : sliders.length === 0 ? (
        <EmptyState title="لا توجد سلايدرز بعد" description='اضغط على "إضافة سلايدر" لإنشاء أول سلايدر في الصفحة الرئيسية.' />
      ) : (
        <div className="flex flex-col gap-3">
          {sliders
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((s) => (
              <div key={s.id} className="border border-gray-200 rounded-xl p-3 flex items-center gap-4">
                <ImageWithFallback
                  src={s.image}
                  alt={s.title || "سلايدر"}
                  className="w-28 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{s.title || "بدون عنوان"}</p>
                  {s.link && <p className="text-xs text-gray-500 truncate" dir="ltr">{s.link}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      ترتيب: {s.sort_order}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full ${s.is_active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                        }`}
                    >
                      {s.is_active ? "مفعّل" : "معطّل"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button onClick={() => handleEdit(s)} className="text-teal-600 text-sm font-semibold hover:underline">
                    تعديل
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-500 text-sm font-semibold hover:underline">
                    حذف
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}