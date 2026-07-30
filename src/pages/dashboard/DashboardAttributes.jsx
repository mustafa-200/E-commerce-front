import React, { useEffect, useState } from "react";
import {
  fetchAttributes,
  adminCreateAttribute,
  adminUpdateAttribute,
  adminDeleteAttribute,
  adminAddAttributeValue,
  adminDeleteAttributeValue,
} from "../../api/attributes";
import { fetchCategories } from "../../api/categories";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Alert from "../../components/ui/Alert";

const emptyForm = { name: "", slug: "", category_id: "" };

export default function DashboardAttributes() {
  const [attributes, setAttributes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [newValueDrafts, setNewValueDrafts] = useState({}); // { [attributeId]: "قيمة جديدة" }
  const [busyValueId, setBusyValueId] = useState(null);

  const load = () => {
    setLoading(true);
    fetchAttributes().then(setAttributes).finally(() => setLoading(false));
  };
  useEffect(load, []);
  useEffect(() => { fetchCategories().then(setCategories); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(false);
  };

  const handleEdit = (attr) => {
    setEditingId(attr.id);
    setForm({ name: attr.name || "", slug: attr.slug || "", category_id: attr.category_id ?? "" });
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || undefined,
        category_id: form.category_id || null,
      };
      if (editingId) await adminUpdateAttribute(editingId, payload);
      else await adminCreateAttribute(payload);
      setMessage({ type: "success", text: editingId ? "تم حفظ التعديلات بنجاح" : "تمت إضافة الخاصية بنجاح" });
      resetForm();
      load();
    } catch (err) {
      const errors = err?.response?.data?.errors;
      const msg = errors
        ? Object.values(errors).flat().join(" - ")
        : err?.response?.data?.message || "تعذر حفظ الخاصية";
      setMessage({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل تريد حذف هذه الخاصية؟ هيتم حذف كل قيمها المرتبطة بيها.")) return;
    try {
      await adminDeleteAttribute(id);
      setMessage({ type: "success", text: "تم حذف الخاصية" });
      load();
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || "تعذر حذف الخاصية" });
    }
  };

  const handleAddValue = async (attributeId) => {
    const value = (newValueDrafts[attributeId] || "").trim();
    if (!value) return;
    setBusyValueId(`add-${attributeId}`);
    try {
      await adminAddAttributeValue(attributeId, value);
      setNewValueDrafts((d) => ({ ...d, [attributeId]: "" }));
      load();
    } catch (err) {
      setMessage({ type: "error", text: "تعذر إضافة القيمة" });
    } finally {
      setBusyValueId(null);
    }
  };

  const handleDeleteValue = async (attributeValueId) => {
    setBusyValueId(attributeValueId);
    try {
      await adminDeleteAttributeValue(attributeValueId);
      load();
    } catch (err) {
      setMessage({ type: "error", text: "تعذر حذف القيمة" });
    } finally {
      setBusyValueId(null);
    }
  };

  return (
    <div className="text-right">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">الخصائص (الألوان / المقاسات / الوزن...) {!loading && `(${attributes.length})`}</h2>
        {!formOpen && (
          <button
            onClick={() => { setFormOpen(true); setEditingId(null); setForm(emptyForm); }}
            className="bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-teal-700"
          >
            + إضافة خاصية
          </button>
        )}
      </div>

      <Alert type={message?.type} message={message?.text} onClose={() => setMessage(null)} />

      {formOpen && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">{editingId ? "تعديل خاصية" : "خاصية جديدة"}</h3>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600">إغلاق</button>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mb-2">
            <input required placeholder="اسم الخاصية (مثال: اللون)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-right" />
            <input placeholder="slug (اختياري)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-right" dir="ltr" />
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-right">
              <option value="">عامة لكل الأقسام</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>خاصة بقسم: {c.name}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-500 mb-4">لو سبت "عامة لكل الأقسام" الخاصية هتظهر في كل المنتجات. لو اخترت قسم معين، هتظهر بس في منتجات القسم ده (زي "الوزن" لقسم المواد الغذائية).</p>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-60">
              {saving ? "جارِ الحفظ..." : editingId ? "حفظ التعديل" : "إضافة خاصية"}
            </button>
            <button type="button" onClick={resetForm} className="border border-gray-300 px-6 py-2 rounded-lg font-semibold">إلغاء</button>
          </div>
        </form>
      )}

      {loading ? (
        <Spinner label="جارِ تحميل الخصائص..." />
      ) : attributes.length === 0 ? (
        <EmptyState title="لا توجد خصائص بعد" description='اضغط على "إضافة خاصية" لإنشاء أول خاصية (زي اللون أو المقاس).' />
      ) : (
        <div className="grid gap-4">
          {attributes.map((attr) => (
            <div key={attr.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{attr.name}</p>
                  <p className="text-xs text-gray-500">
                    {attr.category ? `خاصة بقسم: ${attr.category.name}` : "عامة لكل الأقسام"}
                    {" · "}<span dir="ltr">/{attr.slug}</span>
                  </p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button onClick={() => handleEdit(attr)} className="text-teal-600 text-sm font-semibold hover:underline">تعديل</button>
                  <button onClick={() => handleDelete(attr.id)} className="text-red-500 text-sm font-semibold hover:underline">حذف</button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {(attr.values ?? []).map((v) => (
                  <span key={v.id} className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700">
                    {v.value}
                    <button
                      onClick={() => handleDeleteValue(v.id)}
                      disabled={busyValueId === v.id}
                      className="text-gray-400 hover:text-red-500 disabled:opacity-50"
                      aria-label="حذف القيمة"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {(attr.values ?? []).length === 0 && (
                  <span className="text-xs text-gray-400">لا توجد قيم بعد</span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  placeholder="قيمة جديدة (مثال: أخضر)"
                  value={newValueDrafts[attr.id] || ""}
                  onChange={(e) => setNewValueDrafts((d) => ({ ...d, [attr.id]: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddValue(attr.id); } }}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-right flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleAddValue(attr.id)}
                  disabled={busyValueId === `add-${attr.id}`}
                  className="bg-gray-800 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-900 disabled:opacity-60"
                >
                  إضافة
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
