// بيانات تجريبية (Fallback) — نفس شكل استجابة Laravel API بالضبط
// بمجرد ربط الـ backend، الدوال في src/api/*.js هترجع نفس الشكل ده من السيرفر

export const CATEGORIES = [
  { id: 1, slug: "clothing", name: "ملابس", badge: "الأكثر طلباً", image: "https://images.unsplash.com/photo-1556821552-5bcf782cdeae?w=600&h=600&fit=crop" },
  { id: 2, slug: "shoes", name: "أحذية", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop" },
  { id: 3, slug: "accessories", name: "إكسسوارات", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop" },
  { id: 4, slug: "food", name: "أطعمة", image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=600&fit=crop" },
];

export const PRODUCTS = [
  { id: 1, category_id: 1, category: "ملابس", title: "قميص قطني مريح", description: "قميص قطني 100% مريح ومناسب للاستخدام اليومي، متوفر بعدة مقاسات وألوان.", price: 195, old_price: null, stock: 24, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop" },
  { id: 2, category_id: 2, category: "أحذية", title: "حذاء رياضي عصري", description: "حذاء رياضي خفيف الوزن بتصميم عصري مناسب للجري والاستخدام اليومي.", price: 450, old_price: null, stock: 12, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop" },
  { id: 3, category_id: 3, category: "إكسسوارات", title: "حقيبة جلدية فاخرة", description: "حقيبة جلد طبيعي فاخرة، تصميم أنيق يناسب كل الإطلالات.", price: 249, old_price: 320, stock: 8, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop" },
  { id: 4, category_id: 4, category: "أطعمة", title: "مجموعة توابل فاخرة", description: "تشكيلة توابل مختارة بعناية من أجود المصادر العربية والعالمية.", price: 85, old_price: 95, stock: 40, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop" },
  { id: 5, category_id: 3, category: "إكسسوارات", title: "ساعة يد كلاسيكية", description: "ساعة يد أنيقة بتصميم كلاسيكي وحزام جلدي فاخر.", price: 380, old_price: null, stock: 15, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&h=800&fit=crop" },
  { id: 6, category_id: 1, category: "ملابس", title: "جاكيت شتوي دافئ", description: "جاكيت شتوي عازل للبرودة بتصميم عملي وأنيق.", price: 520, old_price: 610, stock: 6, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop" },
  { id: 7, category_id: 2, category: "أحذية", title: "حذاء جلدي كلاسيك", description: "حذاء جلدي رسمي مناسب للمناسبات والعمل.", price: 340, old_price: null, stock: 18, image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&h=800&fit=crop" },
  { id: 8, category_id: 4, category: "أطعمة", title: "عسل طبيعي فاخر", description: "عسل نحل طبيعي 100% بدون إضافات.", price: 120, old_price: null, stock: 30, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=800&fit=crop" },
];

export function getProductById(id) {
  return PRODUCTS.find((p) => String(p.id) === String(id));
}

export function getProductsByCategorySlug(slug) {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return [];
  return PRODUCTS.filter((p) => p.category_id === cat.id);
}
