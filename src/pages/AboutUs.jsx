import React from "react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div dir="rtl" className="max-w-4xl mx-auto px-4 md:px-10 py-16 min-h-[60vh]">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-right">من نحن</h1>

      <div className="flex flex-col gap-6 text-right text-gray-700 leading-8">
        <p>
          <strong className="text-gray-900">فاخر</strong> هو متجر إلكتروني متخصص في تقديم أفضل تشكيلة
          من الملابس والإكسسوارات الفاخرة، بأسعار منافسة وجودة عالية تليق بذوقك.
        </p>

        <p>
          نسعى منذ انطلاقنا إلى أن نكون الوجهة الأولى لعشاق الموضة والأناقة، من خلال توفير منتجات
          مختارة بعناية من أفضل الماركات العربية والعالمية، مع تجربة تسوق سهلة وسريعة وآمنة.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="font-bold text-gray-900 mb-2">جودة عالية</h3>
            <p className="text-sm text-gray-600">منتجات مختارة بعناية من أفضل الموردين</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">🚚</div>
            <h3 className="font-bold text-gray-900 mb-2">شحن سريع</h3>
            <p className="text-sm text-gray-600">توصيل لجميع المحافظات في أسرع وقت</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-bold text-gray-900 mb-2">دعم دائم</h3>
            <p className="text-sm text-gray-600">فريق خدمة عملاء جاهز للرد على استفساراتك</p>
          </div>
        </div>

        <p>
          هدفنا هو رضاك التام، ولذلك نحرص على أن تصلك منتجاتك بأفضل حالة وفي أقرب وقت ممكن، مع
          إمكانية التواصل معنا في أي وقت لأي استفسار أو مساعدة.
        </p>
      </div>

      <div className="mt-10 text-right">
        <Link to="/contact-us" className="text-teal-600 font-semibold hover:underline">
          تواصل معنا ←
        </Link>
      </div>
    </div>
  );
}