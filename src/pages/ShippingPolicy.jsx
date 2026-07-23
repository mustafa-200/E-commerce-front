import React from "react";

export default function ShippingPolicy() {
  return (
    <div dir="rtl" className="max-w-4xl mx-auto px-4 md:px-10 py-16 min-h-[60vh]">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-right">سياسة الشحن</h1>

      <div className="flex flex-col gap-8 text-right text-gray-700 leading-8">
        <section>
          <h2 className="font-bold text-gray-900 text-lg mb-2">مدة التوصيل</h2>
          <p>
            يتم توصيل الطلبات خلال مدة تتراوح من 2 إلى 5 أيام عمل داخل المدن الرئيسية، وقد تصل إلى
            7 أيام عمل في بعض المناطق النائية، وذلك حسب موقع العميل.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 text-lg mb-2">تكلفة الشحن</h2>
          <p>
            تختلف تكلفة الشحن حسب المنطقة الجغرافية للعميل، ويتم عرض قيمة الشحن بشكل واضح أثناء
            إتمام عملية الشراء قبل تأكيد الطلب.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 text-lg mb-2">طرق الدفع المتاحة</h2>
          <p>
            نوفر خيار الدفع عند الاستلام، بالإضافة إلى إمكانية تأكيد الطلب عبر واتساب للتواصل
            المباشر مع فريق المبيعات.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 text-lg mb-2">تتبع الطلب</h2>
          <p>
            بعد تأكيد الطلب، يمكنك متابعة حالة طلبك في أي وقت من خلال صفحة "حسابي" في الموقع.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 text-lg mb-2">الاستبدال والاسترجاع</h2>
          <p>
            يحق للعميل طلب استبدال أو استرجاع المنتج خلال 14 يوماً من تاريخ الاستلام، بشرط أن يكون
            المنتج بحالته الأصلية ولم يتم استخدامه.
          </p>
        </section>

        <p className="text-sm text-gray-500 border-t border-gray-200 pt-6">
          لأي استفسار بخصوص الشحن أو طلبك، يسعدنا تواصلك معنا عبر صفحة{" "}
          <a href="/contact-us" className="text-teal-600 hover:underline">تواصل معنا</a>.
        </p>
      </div>
    </div>
  );
}