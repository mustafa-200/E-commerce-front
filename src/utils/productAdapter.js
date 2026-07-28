/**
 * يحول شكل بيانات المنتج الجاية من الباك اند لشكل مبسط
 * يقدر الفرونت يستخدمه مباشرة من غير ما يعرف تفاصيل Variants
 */
export function adaptProduct(product) {
  const mainVariant = product.variants?.find((v) => v.is_default) || product.variants?.[0] || {};

  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];

  return {
    id: product.id,
    slug: product.slug,
    title: product.name,
    category: product.category?.name || "",
    categorySlug: product.category?.slug || "",
    image: primaryImage?.image || null,
    price: mainVariant.sale_price ?? mainVariant.price ?? 0,
    oldPrice: mainVariant.sale_price ? mainVariant.price : null,
    stock: mainVariant.stock_quantity ?? 0,
    variantId: mainVariant.id ?? null, // مهم! هتحتاجه وقت Add to Cart
    attribute: mainVariant.attributes ?? [],
  };
}

// نسخة موسّعة لصفحة تفاصيل المنتج — محتاجة كل الـ variants (مش واحد بس)
// عشان اليوزر يقدر يختار لون/مقاس مختلف والسعر/المخزون يتغير تبعًا لاختياره
export function adaptProductDetail(product) {
  const base = adaptProduct(product);

  const images = (product.images ?? [])
    .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
    .map((img) => img.image);

  const variants = (product.variants ?? []).map((v) => ({
    id: v.id,
    sku: v.sku,
    price: v.sale_price ?? v.price,
    originalPrice: v.price,
    hasDiscount: !!v.sale_price && v.sale_price < v.price,
    stock: v.stock_quantity ?? 0,
    isDefault: !!v.is_default,
    // [{ attribute: "اللون", value: "أسود" }, { attribute: "المقاس", value: "L" }]
    attributes: v.attributes ?? [],
  }));

  return {
    ...base,
    description: product.description,
    images: images.length ? images : [base.image].filter(Boolean),
    variants,
  };
}