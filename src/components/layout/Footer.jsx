import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 w-full py-16 mt-20 pb-32 md:pb-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-10">

        {/* الشعار والوصف على اليمين، الروابط في الوسط والشمال - ترتيب RTL طبيعي */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-12">

          <div className="text-right flex-1">
            <div className="mb-6">
              <img src="/ph1.png" alt="Fakher" className="h-16 w-auto object-contain" />
            </div>
            <p className="text-sm text-gray-600 max-w-sm leading-6">
              متجر متخصص في الملابس والإكسسوارات الفاخرة. نقدم أفضل المنتجات العربية والعالمية بجودة عالية وأسعار منافسة.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-16 flex-[2] w-full">

            <div className="text-right">
              <h4 className="text-sm font-bold text-gray-900 mb-6">روابط سريعة</h4>
              <div className="flex flex-col gap-4">
                <Link className="text-xs text-gray-600 hover:text-teal-600 transition-all" to="/about-us">من نحن</Link>
                <Link className="text-xs text-gray-600 hover:text-teal-600 transition-all" to="/contact-us">تواصل معنا</Link>
                <Link className="text-xs text-gray-600 hover:text-teal-600 transition-all" to="/shipping-policy">سياسة الشحن</Link>

              </div>
            </div>

            <div className="text-right">
              <h4 className="text-sm font-bold text-gray-900 mb-6">الأقسام</h4>
              <div className="flex flex-col gap-4">
                <Link className="text-xs text-gray-600 hover:text-teal-600 transition-all" to="/category/clothing">ملابس</Link>
                <Link className="text-xs text-gray-600 hover:text-teal-600 transition-all" to="/category/shoes">أحذية</Link>
                <Link className="text-xs text-gray-600 hover:text-teal-600 transition-all" to="/category/accessories">إكسسوارات</Link>
                <Link className="text-xs text-gray-600 hover:text-teal-600 transition-all" to="/category/food">أطعمة</Link>
                <Link className="text-xs text-gray-600 hover:text-teal-600 transition-all" to="/latest-products">أحدث المنتجات</Link>
              </div>
            </div>

            <div className="text-right">
              <h4 className="text-sm font-bold text-gray-900 mb-6">تابعنا</h4>
              <div className="flex gap-3 mb-8">
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all shadow-sm hover:shadow-lg hover:scale-110">
                  <span className="text-lg">f</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all shadow-sm hover:shadow-lg hover:scale-110">
                  <span className="text-lg">𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all shadow-sm hover:shadow-lg hover:scale-110">
                  <span className="text-lg">📷</span>
                </a>
              </div>

              <div className="text-right">
                <h4 className="text-xs font-bold text-gray-900 mb-3">تواصل معنا</h4>
                <div className="flex flex-col gap-2">
                  <a href="tel:+201001234567" className="text-xs text-gray-600 hover:text-teal-600 transition">📞 01001234567+‏ 20</a>
                  <a href="mailto:info@fakher.com" className="text-xs text-gray-600 hover:text-teal-600 transition">✉️ info@fakher.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300"></div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-600">© {year} Fakher. جميع الحقوق محفوظة.</p>

          <div className="flex items-center gap-6">
            <div className="flex gap-3 items-center">
              <span className="text-xs text-gray-600 font-semibold">طرق الدفع:</span>
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 6h18v2H3V6m0 3h18v2H3V9m0 3h18v2H3v-2m0 3h18v2H3v-2z" />
              </svg>
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 8H4V4h16m0 12H4v-4h16m0 6H4v-2h16z" />
              </svg>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              آمن مصرح
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}