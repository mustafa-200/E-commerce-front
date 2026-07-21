import React, { useEffect, useState } from "react";
import { adminFetchStats } from "../../api/orders";
import { formatCurrency } from "../../utils/currency";

const ICONS = {
  products: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  orders: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  revenue: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2m9-8a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  customers: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 3c0-1.657-2.686-3-6-3s-6 1.343-6 3" /></svg>,
  categories: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>,
};

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    adminFetchStats()
      .then((data) => setStats(data))
      .catch(() => setConnected(false));
  }, []);

  const cards = [
    { key: "products", label: "إجمالي المنتجات", value: stats?.products_count },
    { key: "orders", label: "إجمالي الطلبات", value: stats?.orders_count },
    { key: "revenue", label: "الإيرادات", value: stats ? formatCurrency(stats.revenue) : null },
    { key: "customers", label: "العملاء", value: stats?.customers_count },
    { key: "categories", label: "الفئات", value: stats?.categories_count },
  ];

  return (
    <div>
      {!connected && (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-right mb-6">
          لا يوجد اتصال بالـ Laravel API حالياً — تأكد من تشغيل الـ backend لعرض الإحصائيات الحقيقية.
        </p>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.key} className="bg-white border border-gray-200 rounded-xl p-6 text-right flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500 mb-2">{c.label}</p>
              {c.value !== null && c.value !== undefined ? (
                <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              ) : (
                <div className="h-7 w-16 bg-gray-100 rounded animate-pulse" />
              )}
            </div>
            <div className="w-11 h-11 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
              {ICONS[c.key]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
