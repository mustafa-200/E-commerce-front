import React from "react";
import CategoryCard from "../ui/CategoryCard";
import Spinner from "../ui/Spinner";
import { useCategories } from "../../context/CategoryContext";

// شكل العرض (كام عمود/صف يشغل كل قسم) بيتحدد حسب ترتيبه، مش بيانات ثابتة عن القسم نفسه
const LAYOUT = [
  { colSpan: "col-span-2", rowSpan: "md:row-span-2" },
  { rowSpan: "md:row-span-1" },
  { rowSpan: "md:row-span-2" },
  { rowSpan: "md:row-span-1" },
];

export default function CategorySection() {

  const { categories, loading } = useCategories();

  return (
    <section className="px-margin-mobile md:px-lg py-xl">
      <div className="flex justify-between items-end mb-lg">
        <div className="text-right">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">تسوق حسب الفئة</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">اختر ما يناسب ذوقك من تشكيلتنا الواسعة</p>
        </div>
      </div>

      {loading ? (
        <Spinner label="جاري تحميل الأقسام..." />
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-400 py-12">لا توجد أقسام متاحة حالياً.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-sm md:gap-md md:h-[500px]">
          {categories.slice(0, 4).map((cat, idx) => (
            <CategoryCard
              key={cat.id ?? cat.slug}
              slug={cat.slug}
              image={cat.image}
              title={cat.name}
              badge={cat.badge}
              colSpan={LAYOUT[idx]?.colSpan}
              rowSpan={LAYOUT[idx]?.rowSpan}
              alt={cat.name}
            />
          ))}
        </div>
      )}
    </section>
  );
}
