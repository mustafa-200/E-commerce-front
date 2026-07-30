import React, { useEffect, useState } from "react";
import { PRODUCTS as DEMO_PRODUCTS } from "../../data/mockData";
import {
  adminListProducts,
  adminGetProduct,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminToggleFeatured,
  adminCreateVariant,
  adminUpdateVariant,
  adminDeleteVariant,
  adminAddProductImage,
  adminDeleteProductImage,
} from "../../api/products";
import { fetchCategories } from "../../api/categories";
import { fetchAttributes } from "../../api/attributes";
import ImageWithFallback from "../../components/ui/ImageWithFallback";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Alert from "../../components/ui/Alert";
import { formatCurrency } from "../../utils/currency";

function emptyVariant() {
  return {
    tempId: crypto.randomUUID(),
    id: null,
    sku: "",
    price: "",
    sale_price: "",
    stock_quantity: "",
    attributeSelections: {}, // { [attribute_id]: value_id }
  };
}

function emptyForm() {
  return {
    title: "",
    title_en: "",
    category_id: "",
    description: "",
    is_featured: false,
    variants: [emptyVariant()],
    newImages: [], // File[] لسه ما اترفعتش
  };
}

function getDefaultVariant(p) {
  return p.variants?.find((v) => v.is_default) ?? p.variants?.[0];
}
function getPrimaryImage(p) {
  return p.images?.find((i) => i.is_primary)?.image ?? p.images?.[0]?.image;
}

export default function DashboardProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [existingImages, setExistingImages] = useState([]); // صور المنتج وقت التعديل
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState(null);

  const load = () => {
    setLoading(true);
    adminListProducts()
      .then((data) => { setProducts(data); setUsingDemoData(false); })
      .catch(() => { setProducts(DEMO_PRODUCTS); setUsingDemoData(true); })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);
  useEffect(() => { fetchCategories().then(setCategories); }, []);
  useEffect(() => { fetchAttributes().then(setAttributes); }, []);

  const resetForm = () => {
    setForm(emptyForm());
    setExistingImages([]);
    setEditingId(null);
    setFormOpen(false);
  };

  // -------- Variants handlers --------
  const addVariantRow = () => {
    setForm((f) => ({ ...f, variants: [...f.variants, emptyVariant()] }));
  };
  const removeVariantRow = (tempId) => {
    setForm((f) => ({ ...f, variants: f.variants.filter((v) => v.tempId !== tempId) }));
  };
  const updateVariantField = (tempId, field, value) => {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v) => (v.tempId === tempId ? { ...v, [field]: value } : v)),
    }));
  };
  const updateVariantAttribute = (tempId, attributeId, valueId) => {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v) =>
        v.tempId === tempId
          ? { ...v, attributeSelections: { ...v.attributeSelections, [attributeId]: valueId } }
          : v
      ),
    }));
  };

  // -------- Images handlers --------
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setForm((f) => ({ ...f, newImages: [...f.newImages, ...files] }));
  };
  const removeNewImage = (index) => {
    setForm((f) => ({ ...f, newImages: f.newImages.filter((_, i) => i !== index) }));
  };
  const removeExistingImage = async (imageId) => {
    if (!confirm("حذف هذه الصورة؟")) return;
    try {
      await adminDeleteProductImage(imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      setMessage({ type: "error", text: "تعذر حذف الصورة" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const productPayload = {
        name: form.title,
        name_en: form.title_en,
        category_id: form.category_id,
        description: form.description,
        is_featured: form.is_featured,
      };

      let productId = editingId;

      if (editingId) {
        await adminUpdateProduct(editingId, productPayload);
      } else {
        const created = await adminCreateProduct(productPayload);
        productId = created.id;
      }

      for (const [index, v] of form.variants.entries()) {
        const variantPayload = {
          sku: v.sku,
          price: v.price,
          sale_price: v.sale_price || null,
          stock_quantity: v.stock_quantity || 0,
          is_default: index === 0,
          attribute_value_ids: Object.values(v.attributeSelections).filter(Boolean),
        };

        if (v.id) await adminUpdateVariant(v.id, variantPayload);
        else await adminCreateVariant(productId, variantPayload);
      }

      for (const [index, file] of form.newImages.entries()) {
        const isPrimary = existingImages.length === 0 && index === 0;
        await adminAddProductImage(productId, file, isPrimary);
      }

      setMessage({ type: "success", text: editingId ? "تم حفظ التعديلات بنجاح" : "تمت إضافة المنتج بنجاح" });
      resetForm();
      load();
    } catch (err) {
      const errors = err?.response?.data?.errors;
      const msg = errors
        ? Object.values(errors).flat().join(" - ")
        : err?.response?.data?.message || "تعذر حفظ المنتج";
      setMessage({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (row) => {
    const p = await adminGetProduct(row.id);
    setEditingId(p.id);
    setFormOpen(true);
    setExistingImages(p.images ?? []);
    setForm({
      title: p.name,
      title_en: p.name_en,
      category_id: p.category?.id ?? "",
      description: p.description ?? "",
      is_featured: !!p.is_featured,
      variants: (p.variants ?? []).length
        ? p.variants.map((v) => ({
          tempId: crypto.randomUUID(),
          id: v.id,
          sku: v.sku,
          price: v.price,
          sale_price: v.sale_price ?? "",
          stock_quantity: v.stock_quantity ?? "",
          attributeSelections: Object.fromEntries(
            (v.attributes ?? []).map((a) => [a.attribute_id, a.value_id])
          ),
        }))
        : [emptyVariant()],
      newImages: [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    try {
      await adminDeleteProduct(id);
      setMessage({ type: "success", text: "تم حذف المنتج" });
      load();
    } catch (err) {
      setMessage({ type: "error", text: "تعذر حذف المنتج" });
    }
  };

  const handleToggleFeatured = async (id) => {
    setTogglingId(id);
    try {
      const res = await adminToggleFeatured(id);
      const updated = res.data;
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, is_featured: updated.is_featured } : p)));
    } catch (err) {
      setMessage({ type: "error", text: "تعذر تحديث حالة المنتج" });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="text-right">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">المنتجات {!loading && `(${products.length})`}</h2>
        {!formOpen && (
          <button
            onClick={() => { setFormOpen(true); setEditingId(null); setForm(emptyForm()); }}
            className="bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-teal-700 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            إضافة منتج
          </button>
        )}
      </div>

      <Alert type={message?.type} message={message?.text} onClose={() => setMessage(null)} />

      {usingDemoData && (
        <Alert type="error" message='لا يوجد اتصال بالـ Laravel API حالياً — البيانات المعروضة تجريبية فقط للعرض.' />
      )}

      {formOpen && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">{editingId ? "تعديل منتج" : "منتج جديد"}</h3>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* بيانات المنتج الأساسية */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
            <input required placeholder="اسم المنتج (عربي)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-right" />
            <input required placeholder="اسم المنتج (إنجليزي)" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-right" dir="ltr" />
            <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-right">
              <option value="">اختر القسم</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <textarea placeholder="وصف المنتج (اختياري)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right mb-4" />

          {/* Variants */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-700 text-sm">المتغيرات (السعر/المخزون/الألوان/المقاسات)</h4>
              <button type="button" onClick={addVariantRow} className="text-teal-600 text-xs font-semibold hover:underline">+ إضافة متغير</button>
            </div>

            {form.variants.map((v) => (
              <div key={v.tempId} className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-2 items-center bg-white p-2 rounded-lg border border-gray-200">
                {attributes
                  .filter((attr) => !attr.category_id || String(attr.category_id) === String(form.category_id))
                  .map((attr) => (
                  <select
                    key={attr.id}
                    value={v.attributeSelections[attr.id] || ""}
                    onChange={(e) => updateVariantAttribute(v.tempId, attr.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-xs"
                  >
                    <option value="">{attr.name}</option>
                    {(attr.values ?? []).map((val) => (
                      <option key={val.id} value={val.id}>{val.value}</option>
                    ))}
                  </select>
                ))}
                <input required placeholder="SKU" value={v.sku} onChange={(e) => updateVariantField(v.tempId, "sku", e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-xs" />
                <input required type="number" placeholder="السعر" value={v.price} onChange={(e) => updateVariantField(v.tempId, "price", e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-xs" />
                <input type="number" placeholder="سعر الخصم" value={v.sale_price} onChange={(e) => updateVariantField(v.tempId, "sale_price", e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-xs" />
                <input type="number" placeholder="المخزون" value={v.stock_quantity} onChange={(e) => updateVariantField(v.tempId, "stock_quantity", e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-xs" />
                {form.variants.length > 1 && (
                  <button type="button" onClick={() => removeVariantRow(v.tempId)} className="text-red-500 text-xs">حذف</button>
                )}
              </div>
            ))}
          </div>

          {/* الصور */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 text-sm mb-2">الصور</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {existingImages.map((img) => (
                <div key={img.id} className="relative">
                  <ImageWithFallback src={img.image} alt="صورة المنتج" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                  <button type="button" onClick={() => removeExistingImage(img.id)} className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
                </div>
              ))}
              {form.newImages.map((file, i) => (
                <div key={i} className="relative">
                  <ImageWithFallback src={URL.createObjectURL(file)} alt="صورة جديدة" className="w-16 h-16 object-cover rounded-lg border border-teal-300" />
                  <button type="button" onClick={() => removeNewImage(i)} className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
                </div>
              ))}
            </div>
            <label className="cursor-pointer bg-white border border-dashed border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 hover:border-teal-500 hover:text-teal-600 transition inline-block">
              إضافة صور
              <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="hidden" />
            </label>
          </div>

          <label className="flex items-center gap-2 mb-4 cursor-pointer w-fit">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-teal-600" />
            <span className="text-sm font-semibold text-gray-700">إظهار المنتج في قسم "أحدث المنتجات" بالصفحة الرئيسية</span>
          </label>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-60">
              {saving ? "جارِ الحفظ..." : editingId ? "حفظ التعديل" : "إضافة منتج"}
            </button>
            <button type="button" onClick={resetForm} className="border border-gray-300 px-6 py-2 rounded-lg font-semibold">إلغاء</button>
          </div>
        </form>
      )}

      {loading ? (
        <Spinner label="جارِ تحميل المنتجات..." />
      ) : products.length === 0 ? (
        <EmptyState title="لا توجد منتجات بعد" description='اضغط على "إضافة منتج" لإضافة أول منتج في المتجر.' />
      ) : (
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-2 px-2">الصورة</th><th className="py-2 px-2">المنتج</th><th className="py-2 px-2">القسم</th><th className="py-2 px-2">السعر</th><th className="py-2 px-2">المخزون</th><th className="py-2 px-2">أحدث المنتجات</th><th className="py-2 px-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const variant = getDefaultVariant(p);
                return (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                    <td className="py-3 px-2">
                      <ImageWithFallback src={getPrimaryImage(p)} alt={p.name} className="w-11 h-11 rounded-lg object-cover" iconClassName="w-5 h-5" />
                    </td>
                    <td className="py-3 px-2 font-semibold text-gray-800 max-w-[180px] truncate">{p.name}</td>
                    <td className="py-3 px-2 text-gray-600">{p.category?.name}</td>
                    <td className="py-3 px-2 text-gray-600">{formatCurrency(variant?.price ?? 0)}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${(variant?.stock_quantity ?? 0) > 5 ? "bg-gray-100 text-gray-600" : (variant?.stock_quantity ?? 0) > 0 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                        }`}>
                        {variant?.stock_quantity ?? 0}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleToggleFeatured(p.id)}
                        disabled={togglingId === p.id}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition disabled:opacity-50 ${p.is_featured ? "bg-teal-50 text-teal-700 hover:bg-teal-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                      >
                        {p.is_featured ? "ظاهر" : "غير ظاهر"}
                      </button>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-3 justify-end">
                        <button onClick={() => handleEdit(p)} className="text-teal-600 font-semibold hover:underline">تعديل</button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-500 font-semibold hover:underline">حذف</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}