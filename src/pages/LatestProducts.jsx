import React, { useEffect, useState } from "react";
import ProductCard from "../components/ui/ProductCard";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import { fetchLatestProducts } from "../api/products";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";

function getDefaultVariant(product) {
  return product.variants?.find((v) => v.is_default) ?? product.variants?.[0];
}
function getPrimaryImage(product) {
  return product.images?.find((i) => i.is_primary)?.image ?? product.images?.[0]?.image;
}

export default function LatestProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchLatestProducts(50).then((data) => { setProducts(data); setLoading(false); });
  }, []);

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 md:px-10 py-10">
      <div className="text-right mb-8">
        <h1 className="text-3xl font-bold text-gray-900">أحدث المنتجات</h1>
        <p className="text-gray-500 mt-1">كل الإضافات الجديدة والمنتجات المختارة في متجرنا</p>
      </div>

      {loading ? (
        <Spinner label="جاري تحميل المنتجات..." className="py-24" />
      ) : products.length === 0 ? (
        <EmptyState title="لا توجد منتجات حالياً" description="تابعنا قريباً، هنضيف منتجات جديدة باستمرار." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => {
            const variant = getDefaultVariant(product);
            const hasDiscount = variant?.sale_price && variant.sale_price < variant.price;
            const currentPrice = variant?.sale_price ?? variant?.price ?? 0;

            return (
              <ProductCard
                key={product.id}
                id={product.id}
                image={getPrimaryImage(product)}
                category={product.category?.name}
                title={product.name}
                price={formatCurrency(currentPrice)}
                oldPrice={hasDiscount ? formatCurrency(variant.price) : null}
                discount={hasDiscount ? `-${Math.round((1 - variant.sale_price / variant.price) * 100)}%` : null}
                alt={product.name}
                onAddToCart={() => variant && addToCart(variant.id, 1)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}