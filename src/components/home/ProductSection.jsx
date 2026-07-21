import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../ui/ProductCard";
import Spinner from "../ui/Spinner";
import { fetchLatestProducts } from "../../api/products";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/currency";
import { adaptProduct } from "../../utils/productAdapter"; // جديد

export default function ProductSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchLatestProducts(8).then((data) => {
      setProducts(data.map(adaptProduct)); // التحويل بيحصل هنا مرة واحدة بس
      setLoading(false);
    });
  }, []);

  return (
    <section className="px-margin-mobile md:px-lg py-xl bg-surface-container-low/50">
      <div className="flex justify-between items-center mb-lg">
        <div className="text-right">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">أحدث المنتجات</h2>
        </div>
        <Link to="/latest-products" className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline">
          عرض الكل
          <span className="material-symbols-outlined text-sm rtl-flip">arrow_forward</span>
        </Link>
      </div>

      {loading ? (
        <Spinner label="جاري تحميل المنتجات..." />
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 py-12">لا توجد منتجات لعرضها حالياً.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-md">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.slug}
              image={product.image}
              category={product.category}
              title={product.title}
              price={formatCurrency(product.price)}
              oldPrice={product.oldPrice ? formatCurrency(product.oldPrice) : null}
              discount={
                product.oldPrice
                  ? `-${Math.round((1 - product.price / product.oldPrice) * 100)}%`
                  : null
              }
              alt={product.title}
              onAddToCart={() => addToCart(product.variantId, 1)}
            />
          ))}
        </div>
      )}
    </section>
  );
}