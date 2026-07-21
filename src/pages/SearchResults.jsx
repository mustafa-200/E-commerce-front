import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../api/products";
import ProductCard from "../components/ui/ProductCard";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";
import { adaptProduct } from "../utils/productAdapter";

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const { addToCart } = useCart();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    searchProducts(query).then((data) => {
      setResults(data.map(adaptProduct));
      setLoading(false);
    });
  }, [query]);

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 md:px-10 py-10 min-h-[60vh]">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 text-right">
        نتائج البحث عن: <span className="text-teal-600">"{query}"</span>
      </h1>

      {loading ? (
        <Spinner label="جاري البحث..." className="py-20" />
      ) : results.length === 0 ? (
        <EmptyState title="لا توجد نتائج مطابقة" description={`لم نجد منتجات تطابق "${query}"، جرب كلمات بحث أخرى.`} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map((p) => (
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