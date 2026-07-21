# Fakher — واجهة المتجر (React + Vite + Tailwind)

## ⚠️ بخصوص ملف my-react-app.rar
معنديش أداة فك ضغط `.rar` ولا اتصال إنترنت في بيئة التنفيذ، فمعرفتش أفتح الملف ده أو أشوف اللي جواه. لو ده كان فيه الـ backend بتاعك أو كود تاني مهم، ابعته تاني كـ `.zip` وأنا أدمجه فوراً. المجلد `backend/` المرفق هنا هو Laravel API skeleton كامل مبنى من الصفر عشان يشتغل مع الفرونت إند من غير ما نستنى.

---

## اللي كان فيه مشاكل وتم إصلاحه

1. **البَج الأساسي:** `src/main.jsx` كان بيستورد `Home.jsx` باسم `App` بدل `App.jsx` الحقيقي — يعني الـ Navbar/Footer/BottomNav وأي Routing متعملهاش استخدام فعلي، والصفحة كانت بترندر Home مباشرة. اتصلح: `main.jsx` بقى يستورد `App.jsx` صح وبقى فيه Router حقيقي.

2. **الضغط على منتج كان بيوديك لصفحة تانية غلط:** الـ `ProductCard` مكنش فيه أي `Link`، والصفحة الوحيدة الموجودة غير الرئيسية محدش كان مربوطها صح. اتصلح: كل منتج دلوقتي بيودي لصفحة تفاصيل منتج حقيقية `/product/:id`، وصفحة الحساب `/account` بقت منفصلة تماماً وبتفتح من أيقونة البروفايل في الـ Navbar بس.

3. **تكرار قسم الأصناف:** كان فيه مكونين مختلفين (`CategorySection.jsx` و `prod_Section.jsx`) بيعرضوا نفس فكرة "تسوق حسب الفئة" مرتين في نفس الصفحة بأسلوبين مختلفين. اتصلح: اتشال المكرر (`prod_Section.jsx`) وباقي مكون واحد بس مربوط بروابط الأقسام الصحيحة.

4. **`BottomNav.jsx` كان فيه اسم غلط:** المكون كان اسمه الداخلي `Footer` وبيرندر فوتر تاني بالظبط زي `Footer.jsx` الأصلي (تكرار كامل بدل شريط تنقل سفلي للموبايل). اتصلح: بقى شريط تبويبات حقيقي (الرئيسية / الأقسام / السلة / حسابي) مع عداد للسلة.

5. **مفيش عربة تسوق (Cart) فعلية:** زرار "أضف للسلة" في كروت المنتجات مكنش موصول بأي حاجة. اتصلح: اتضاف `CartContext` كامل (يحفظ في localStorage)، صفحة `/cart`، و`/checkout` لإتمام الطلب.

6. **مفيش Dashboard:** اتضافت لوحة تحكم كاملة `/dashboard` (محمية لليوزر اللي `role = admin` بس) فيها: نظرة عامة (إحصائيات)، إدارة المنتجات، إدارة الأقسام، إدارة الطلبات.

7. **مفيش تسجيل دخول/حساب:** اتضاف `AuthContext` + صفحات تسجيل دخول/تسجيل جديد/حساب شخصي، وربط كل ده بتوكن Laravel Sanctum.

8. **axios متسخدمش بس مكنش مكتوب في `package.json`:** كان هيفشل التثبيت. اتضاف كـ dependency.

## اللي اتضاف من الصفر

- `src/context/CartContext.jsx`, `src/context/AuthContext.jsx`
- `src/api/products.js`, `categories.js`, `auth.js`, `orders.js` (كل الاستدعاءات بتكلم Laravel API، ولو السيرفر مش شغال بترجع بيانات تجريبية عشان الواجهة تفضل شغالة)
- `src/data/mockData.js` (بيانات تجريبية بنفس شكل استجابة الـ API)
- صفحات: `ProductDetail`, `CategoryPage`, `SearchResults`, `Cart`, `Checkout`, `OrderConfirmation`, `Login`, `Register`, `Account`, `NotFound`
- `src/pages/dashboard/*` (لوحة تحكم كاملة)
- `src/components/common/ProtectedRoute.jsx` (حماية صفحات الحساب ولوحة التحكم)
- مجلد `backend/` بالكامل: Laravel API skeleton (Models, Controllers, Migrations, Seeder, Routes) — راجع `backend/README.md` لخطوات التركيب بالتفصيل

## التشغيل

```bash
npm install
cp .env.example .env   # وغيّر VITE_API_BASE_URL لو الـ backend شغال على رابط مختلف
npm run dev
```

من غير ما تشغل أي backend، الموقع هيشتغل بالكامل ببيانات تجريبية (mock) عشان تقدر تجرب كل حاجة: التصفح بالأقسام، فتح منتج، إضافة للسلة، الشراء، تسجيل الدخول (شكلياً). لما تشغل الـ Laravel backend (شوف `backend/README.md`)، هيسحب البيانات الحقيقية أوتوماتيك من غير أي تعديل في الكود.
