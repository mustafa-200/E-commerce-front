import React from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../../context/CategoryContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { categories } = useCategories();

  const footerCategoryLinks = categories
    .filter((c) => c.is_active && !c.parent_id)
    .map((c) => ({
      to: `/category/${c.slug}`,
      label: c.name,
    }));

  return (
    <footer className="w-full py-16 mt-20 pb-32 md:pb-16 border-t border-white/10" style={{ backgroundColor: "#072224" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-10">

        {/* الشعار والوصف على اليمين، الروابط في الوسط والشمال - ترتيب RTL طبيعي */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-12">

          <div className="text-right flex-1">
            <div className="mb-6">
              <img src="/ph1.png" alt="Fakher" className="h-16 w-auto object-contain" />
            </div>
            <p className="text-sm text-gray-300 max-w-sm leading-6">**اكتشف عالمًا من الجودة والتميز**

متجرنا وجهتك للتسوق المتنوع، حيث نقدم تشكيلة واسعة من المنتجات المميزة التي تم اختيارها بعناية لتجمع بين الجودة، التصميم العصري، والقيمة العالية. نسعى لتوفير تجربة شراء متكاملة تجمع بين سهولة التسوق، تنوع الاختيارات، وخدمة ترضي تطلعات عملائنا.
</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-16 flex-[2] w-full">

            <div className="text-right">
              <h4 className="text-sm font-bold text-white mb-6">روابط سريعة</h4>
              <div className="flex flex-col gap-4">
                <Link className="text-xs text-gray-300 hover:text-amber-400 transition-all" to="/about-us">من نحن</Link>
                <Link className="text-xs text-gray-300 hover:text-amber-400 transition-all" to="/contact-us">تواصل معنا</Link>
                <Link className="text-xs text-gray-300 hover:text-amber-400 transition-all" to="/shipping-policy">سياسة الشحن</Link>
                
              </div>
            </div>

            <div className="text-right">
              <h4 className="text-sm font-bold text-white mb-6">الأقسام</h4>
              <div className="flex flex-col gap-4">
                {footerCategoryLinks.map((link) => (
                  <Link
                    key={link.to}
                    className="text-xs text-gray-300 hover:text-amber-400 transition-all"
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link className="text-xs text-gray-300 hover:text-amber-400 transition-all" to="/latest-products">أحدث المنتجات</Link>
              </div>
            </div>

            <div className="text-right">
              <h4 className="text-sm font-bold text-white mb-6">تابعنا</h4>
              <div className="flex gap-3 mb-8">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-gray-300 hover:bg-amber-400 hover:text-[#072224] hover:border-amber-400 transition-all shadow-sm hover:shadow-lg hover:scale-110">
                  <span className="text-lg">f</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-gray-300 hover:bg-amber-400 hover:text-[#072224] hover:border-amber-400 transition-all shadow-sm hover:shadow-lg hover:scale-110">
                  <span className="text-lg">𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-gray-300 hover:bg-amber-400 hover:text-[#072224] hover:border-amber-400 transition-all shadow-sm hover:shadow-lg hover:scale-110">
                  <span className="text-lg">📷</span>
                </a>
              </div>

              <div className="text-right">
                <h4 className="text-xs font-bold text-white mb-3">تواصل معنا</h4>
                <div className="flex flex-col gap-2">
                  <a href="tel:+201037419260" className="text-xs text-gray-300 hover:text-amber-400 transition">📞 +201037419260</a>
                  <a href="https://wa.me/201037419260?text=مرحباً" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-300 hover:text-amber-400 transition">💬 واتساب</a>
                  <a href="mailto:ahmedhany234567op@gmail.com" className="text-xs text-gray-300 hover:text-amber-400 transition">✉️ ahmedhany234567op@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10"></div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-300">© {year} Fakher. جميع الحقوق محفوظة.</p>

          <div className="flex items-center gap-6">
            <div className="flex gap-3 items-center">
              <span className="text-xs text-gray-300 font-semibold">طرق الدفع:</span>
              <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 6h18v2H3V6m0 3h18v2H3V9m0 3h18v2H3v-2m0 3h18v2H3v-2z" />
              </svg>
              <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 8H4V4h16m0 12H4v-4h16m0 6H4v-2h16z" />
              </svg>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-300">
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