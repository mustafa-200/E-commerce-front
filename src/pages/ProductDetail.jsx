import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchProduct, fetchProductsByCategory } from "../api/products";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ui/ProductCard";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import Spinner from "../components/ui/Spinner";
import { formatCurrency } from "../utils/currency";
import { adaptProduct, adaptProductDetail } from "../utils/productAdapter";

const STORE_WHATSAPP = "201037419260";

export default function ProductDetail() {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selections, setSelections] = useState({});
  const [tab, setTab] = useState("description");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setAdded(false);
    setQty(1);
    setActiveImage(0);

    fetchProduct(slug).then(async (raw) => {
      if (!alive || !raw) {
        setLoading(false);
        return;
      }
      const p = adaptProductDetail(raw);
      setProduct(p);

      const defaultVariant = p.variants.find((v) => v.isDefault) ?? p.variants[0];
      const initialSelections = {};
      defaultVariant?.attributes.forEach((a) => {
        initialSelections[a.attribute] = a.value;
      });
      setSelections(initialSelections);
      setLoading(false);

      if (raw.category?.id) {
        const list = await fetchProductsByCategory(raw.category.id);
        if (alive) {
          setRelated(
            list
              .map(adaptProduct)
              .filter((x) => String(x.id) !== String(p.id))
              .slice(0, 4)
          );
        }
      }
    });

    return () => {
      alive = false;
    };
  }, [slug]);

  const attributeGroups = useMemo(() => {
    if (!product) return [];
    const groups = {};
    product.variants.forEach((v) => {
      v.attributes.forEach((a) => {
        if (!groups[a.attribute]) groups[a.attribute] = new Set();
        groups[a.attribute].add(a.value);
      });
    });
    return Object.entries(groups).map(([name, set]) => ({ name, values: [...set] }));
  }, [product]);

  const selectedVariant = useMemo(() => {
    if (!product) return null;
    const match = product.variants.find(
      (v) =>
        v.attributes.length === Object.keys(selections).length &&
        v.attributes.every((a) => selections[a.attribute] === a.value)
    );
    return match ?? product.variants.find((v) => v.isDefault) ?? product.variants[0];
  }, [product, selections]);

  if (loading) {
    return <Spinner label="جاري التحميل..." className="min-h-[50vh] flex-col justify-center" />;
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-xl font-bold text-on-surface">المنتج غير موجود</p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary text-on-primary px-6 py-2 rounded-full font-semibold hover:opacity-90"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const price = selectedVariant?.price ?? 0;
  const oldPrice = selectedVariant?.hasDiscount ? selectedVariant.originalPrice : null;
  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : null;
  const stock = selectedVariant?.stock ?? 0;
  const lowStock = stock > 0 && stock <= 5;
  const outOfStock = !selectedVariant || stock === 0;

  const handleAdd = () => {
    if (!selectedVariant) return;

    addToCart(selectedVariant.id, qty);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const selectionLines = Object.entries(selections)
    .map(([k, v]) => k + ": " + v)
    .join("\n");
  const whatsappMessage = encodeURIComponent(
    "مرحباً، أرغب في طلب المنتج التالي:\n" +
      product.title +
      "\n" +
      selectionLines +
      "\nالكمية: " +
      qty +
      "\nالسعر: " +
      formatCurrency(price)
  );
  const whatsappLink = "https://wa.me/" + STORE_WHATSAPP + "?text=" + whatsappMessage;

  return (
    <div dir="rtl" className="max-w-[1280px] mx-auto px-margin-mobile md:px-lg py-md md:py-xl">
      <nav className="flex items-center gap-xs mb-md text-on-surface-variant font-label-sm text-label-sm">
        <Link to="/" className="hover:text-primary">
          الرئيسية
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_left</span>
        <Link to={`/category/${product.categorySlug}`} className="hover:text-primary">
          {product.category}
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_left</span>
        <span className="text-primary font-bold">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-28 space-y-md">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-sm border border-outline-variant group">
              <ImageWithFallback
                src={product.images[activeImage]}
                alt={product.title}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                iconClassName="w-16 h-16"
              />
              <div className="absolute top-4 right-4 bg-primary text-on-primary px-3 py-1 rounded-full font-label-md text-label-md">
                جديد
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-sm overflow-x-auto scrollbar-hide pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img + idx}
                    onClick={() => setActiveImage(idx)}
                    className={
                      "flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all " +
                      (idx === activeImage
                        ? "border-primary ring-2 ring-primary-container ring-offset-2"
                        : "border-outline-variant opacity-70 hover:opacity-100")
                    }
                  >
                    <ImageWithFallback src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">{product.title}</h1>
          </div>

          <div className="bg-surface-container-low p-md rounded-xl">
            <div className="flex items-center gap-md flex-wrap">
              <span className="font-headline-xl text-headline-xl text-primary">{formatCurrency(price)}</span>
              {oldPrice && (
                <span className="font-body-lg text-body-lg text-on-surface-variant line-through">
                  {formatCurrency(oldPrice)}
                </span>
              )}
              {discount && (
                <span className="bg-primary-container/20 text-primary px-2 py-0.5 rounded font-label-md text-label-md">
                  -{discount}%
                </span>
              )}
            </div>
            <div className="mt-xs flex items-center gap-xs text-primary font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>شامل ضريبة القيمة المضافة</span>
            </div>
          </div>

          {attributeGroups.map((group) => (
            <div key={group.name} className="space-y-sm">
              <div className="flex justify-between items-center">
                <span className="font-label-md text-label-md text-on-surface">
                  {group.name}: <span className="text-on-surface-variant">{selections[group.name]}</span>
                </span>
              </div>
              <div className="grid grid-cols-4 gap-sm">
                {group.values.map((val) => (
                  <button
                    key={val}
                    onClick={() => setSelections((s) => ({ ...s, [group.name]: val }))}
                    className={
                      "py-2 rounded-lg font-label-md text-label-md transition-colors " +
                      (selections[group.name] === val
                        ? "border-2 border-primary bg-primary-container/10 font-bold text-primary"
                        : "border border-outline-variant hover:border-primary")
                    }
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-xs">
            <span
              className={
                "w-2.5 h-2.5 rounded-full " + (!outOfStock ? "bg-primary animate-pulse" : "bg-error")
              }
            />
            <span
              className={"font-label-md text-label-md " + (!outOfStock ? "text-primary" : "text-error")}
            >
              {outOfStock
                ? "غير متوفر حالياً"
                : lowStock
                ? "متوفر في المخزون (" + stock + " قطع فقط!)"
                : "متوفر في المخزون"}
            </span>
          </div>

          <div className="flex items-center gap-md">
            <span className="font-label-md text-label-md text-on-surface">الكمية:</span>
            <div className="flex items-center border border-outline-variant rounded-full overflow-hidden">
              <button
                className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-low"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="px-4 font-semibold">{qty}</span>
              <button
                className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-low"
                onClick={() => setQty((q) => Math.min(stock || 99, q + 1))}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-sm mt-md">
            <div className="flex gap-sm">
              <button
                onClick={handleAdd}
                disabled={outOfStock}
                className="flex-1 bg-primary disabled:bg-outline-variant text-on-primary py-4 rounded-xl font-headline-md text-headline-md flex items-center justify-center gap-sm hover:opacity-90 transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                {added ? "تمت الإضافة" : "إضافة للسلة"}
              </button>
              <button className="w-14 h-14 flex items-center justify-center border-2 border-outline-variant rounded-xl text-on-surface-variant hover:border-error hover:text-error transition-all">
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white py-4 rounded-xl font-headline-md text-headline-md flex items-center justify-center gap-sm hover:brightness-95 transition-all active:scale-[0.98]"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.222-4.032c1.503.893 3.129 1.364 4.791 1.365 5.223 0 9.474-4.25 9.476-9.475.001-2.533-1.007-4.915-2.839-6.748-1.832-1.833-4.214-2.842-6.748-2.842-5.225 0-9.476 4.251-9.478 9.477-.001 1.761.488 3.48 1.415 4.974l-.942 3.442 3.522-.923zm10.224-6.963c-.273-.137-1.613-.797-1.863-.888-.249-.09-.431-.137-.613.137-.182.273-.706.888-.865 1.07-.158.182-.317.204-.59.068-.273-.137-1.15-.424-2.191-1.354-.809-.721-1.355-1.612-1.514-1.885-.159-.272-.017-.42.119-.556.124-.122.273-.318.409-.477.136-.159.182-.273.272-.454.091-.182.045-.341-.023-.477-.068-.136-.613-1.477-.84-2.023-.222-.534-.446-.462-.613-.471l-.523-.01c-.182 0-.477.068-.727.341-.249.273-.954.932-.954 2.272 0 1.341.977 2.636 1.114 2.818.136.182 1.922 2.935 4.656 4.114.65.281 1.157.448 1.552.573.653.208 1.248.178 1.717.108.523-.078 1.613-.659 1.841-1.295.227-.636.227-1.182.159-1.295-.068-.113-.25-.181-.523-.318z" />
              </svg>
              اطلب عبر واتساب
            </a>
          </div>

          <div className="border-t border-outline-variant pt-md flex flex-col items-center gap-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant">طرق دفع آمنة وسهلة</span>
            <div className="flex gap-md text-on-surface-variant">
              <span className="material-symbols-outlined">credit_card</span>
              <span className="material-symbols-outlined">account_balance</span>
              <span className="material-symbols-outlined">phone_iphone</span>
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-xl">
        <div className="border-b border-outline-variant flex gap-xl overflow-x-auto scrollbar-hide">
          {[
            { key: "description", label: "الوصف" },
            { key: "specs", label: "المواصفات" },
            { key: "reviews", label: "التقييمات" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "pb-4 font-headline-md text-headline-md whitespace-nowrap transition-all border-b-2 -mb-px " +
                (tab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-primary")
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="py-xl">
          {tab === "description" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
              <div className="space-y-md">
                <h2 className="font-headline-lg text-headline-lg text-on-surface">{product.title}</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  {product.description || "لا يوجد وصف تفصيلي لهذا المنتج حالياً."}
                </p>
              </div>
              {product.images[activeImage] && (
                <div className="rounded-2xl overflow-hidden shadow-lg h-80">
                  <ImageWithFallback
                    src={product.images[activeImage]}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          )}

          {tab === "specs" && (
            <div className="max-w-2xl bg-white border border-outline-variant rounded-2xl overflow-hidden">
              <div className="grid grid-cols-2 p-md border-b border-outline-variant bg-surface-container-low">
                <span className="font-label-md text-label-md font-bold">القسم</span>
                <span className="font-body-md text-body-md">{product.category}</span>
              </div>
              <div className="grid grid-cols-2 p-md border-b border-outline-variant">
                <span className="font-label-md text-label-md font-bold">السعر</span>
                <span className="font-body-md text-body-md">{formatCurrency(price)}</span>
              </div>
              {attributeGroups.map((group, i) => (
                <div
                  key={group.name}
                  className={
                    "grid grid-cols-2 p-md border-b border-outline-variant " +
                    (i % 2 === 0 ? "bg-surface-container-low" : "")
                  }
                >
                  <span className="font-label-md text-label-md font-bold">{group.name}</span>
                  <span className="font-body-md text-body-md">{group.values.join(" / ")}</span>
                </div>
              ))}
              <div className="grid grid-cols-2 p-md">
                <span className="font-label-md text-label-md font-bold">الكمية المتوفرة</span>
                <span className="font-body-md text-body-md">{stock}</span>
              </div>
            </div>
          )}

          {tab === "reviews" && (
            <div className="text-center py-xl">
              <span className="material-symbols-outlined text-[64px] text-outline-variant mb-md">
                rate_review
              </span>
              <h3 className="font-headline-md text-headline-md">قريباً.. تقييمات العملاء الموثقة</h3>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-on-surface mb-6 text-right">منتجات مشابهة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                id={p.slug}
                image={p.image}
                category={p.category}
                title={p.title}
                price={formatCurrency(p.price)}
                oldPrice={p.oldPrice ? formatCurrency(p.oldPrice) : null}
                discount={p.oldPrice ? "-" + Math.round((1 - p.price / p.oldPrice) * 100) + "%" : null}
                onAddToCart={() => addToCart(p.variantId, 1)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}