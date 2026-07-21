import React, { useEffect, useState } from "react";
import { fetchCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from "../../api/categories";
import ImageWithFallback from "../../components/ui/ImageWithFallback";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Alert from "../../components/ui/Alert";

const emptyForm = { name: "", slug: "", image: null };

export default function DashboardCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const load = () => {
    setLoading(true);
    fetchCategories().then(setCategories).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImagePreview(null);
    setEditingId(null);
    setFormOpen(false);
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setForm({ name: c.name || "", slug: c.slug || "", image: null });
    setImagePreview(c.image || null); // الصورة القديمة تتعرض، من غير ما تتبعت تاني لحد ما يغيّرها
    setFormOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, image: file });
    setImagePreview(URL.createObjectURL(file)); // معاينة فورية للصورة المختارة
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      if (editingId) await adminUpdateCategory(editingId, form);
      else await adminCreateCategory(form);
      setMessage({ type: "success", text: editingId ? "تم حفظ التعديلات بنجاح" : "تمت إضافة القسم بنجاح" });
      resetForm();
      load();
    } catch (err) {
      const msg = err?.response?.data?.message || "تعذر حفظ القسم - تأكد من اتصال الـ backend (Laravel API).";
      setMessage({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل تريد حذف هذا القسم؟ لن يكون بإمكانك حذفه لو فيه منتجات مرتبطة به.")) return;
    try {
      await adminDeleteCategory(id);
      setMessage({ type: "success", text: "تم حذف القسم" });
      load();
    } catch (err) {
      const msg = err?.response?.data?.message || "تعذر حذف القسم - تأكد إنه مش مرتبط بمنتجات، ومن اتصال الـ backend.";
      setMessage({ type: "error", text: msg });
    }
  };

  return (
    <div className="text-right">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">الأقسام {!loading && `(${categories.length})`}</h2>
        {!formOpen && (
          <button
            onClick={() => { setFormOpen(true); setEditingId(null); }}
            className="bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-teal-700 flex items-center gap-1.5"
          >
            إضافة قسم
          </button>
        )}
      </div>

      <Alert type={message?.type} message={message?.text} onClose={() => setMessage(null)} />

      {formOpen && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">{editingId ? "تعديل قسم" : "قسم جديد"}</h3>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600">إغلاق</button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <input required placeholder="اسم القسم (بالعربي)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-right" />
            <input required placeholder="slug بالإنجليزي (مثال: shoes)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-right" dir="ltr" />
          </div>

          {/* ⚠️ التغيير الأساسي هنا: input نوعه file دلوقتي مش text */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">صورة القسم</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="border border-gray-300 rounded-lg px-3 py-2 w-full" />
          </div>

          {imagePreview && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-gray-500">معاينة:</span>
              <ImageWithFallback src={imagePreview} alt="معاينة" className="w-14 h-14 rounded-lg object-cover border border-gray-200" />
            </div>
          )}

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-60">
              {saving ? "جارِ الحفظ..." : editingId ? "حفظ التعديل" : "إضافة قسم"}
            </button>
            <button type="button" onClick={resetForm} className="border border-gray-300 px-6 py-2 rounded-lg font-semibold">إلغاء</button>
          </div>
        </form>
      )}

      {loading ? (
        <Spinner label="جارِ تحميل الأقسام..." />
      ) : categories.length === 0 ? (
        <EmptyState title="لا توجد أقسام بعد" description='اضغط على "إضافة قسم" لإنشاء أول قسم في المتجر.' />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
              <ImageWithFallback src={c.image} alt={c.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{c.name}</p>
                <p className="text-xs text-gray-500" dir="ltr">/{c.slug}</p>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button onClick={() => handleEdit(c)} className="text-teal-600 text-sm font-semibold hover:underline">تعديل</button>
                <button onClick={() => handleDelete(c.id)} className="text-red-500 text-sm font-semibold hover:underline">حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}