import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductsByCategory } from "../api/products";
import { fetchCategories } from "../api/categories";
import ProductCard from "../components/ui/ProductCard";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";
import { adaptProduct } from "../utils/productAdapter";

export default function CategoryPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    fetchCategories().then(async (cats) => {
      if (!alive) return;

      const matched = cats.find((c) => c.slug === slug) || null;
      setCategory(matched);

      if (!matched) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // نستخدم الـ id بتاع التصنيف اللي لقيناه، مش الـ slug مباشرة
      const rawProducts = await fetchProductsByCategory(matched.id);
      if (alive) {
        setProducts(rawProducts.map(adaptProduct)); // ← لازم نحول شكل البيانات زي باقي الصفحات
        setLoading(false);
      }
    });

    return () => { alive = false; };
  }, [slug]);

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 md:px-10 py-10 min-h-[60vh]">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-teal-600">الرئيسية</Link>
        <span>/</span>
        <span className="text-gray-700">{category?.name || "القسم"}</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-right">{category?.name || "المنتجات"}</h1>

      {loading ? (
        <Spinner label="جاري تحميل المنتجات..." className="py-20" />
      ) : products.length === 0 ? (
        <EmptyState title="لا توجد منتجات في هذا القسم حالياً" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.slug}
              image={p.image}
              category={p.category}
              title={p.title}
              price={formatCurrency(p.price)}
              oldPrice={p.oldPrice ? formatCurrency(p.oldPrice) : null}
              discount={p.oldPrice ? `-${Math.round((1 - p.price / p.oldPrice) * 100)}%` : null}
              onAddToCart={() => addToCart(p.variantId, 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}