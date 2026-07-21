import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";

const links = [
  {
    to: "/dashboard", label: "نظرة عامة", end: true,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    to: "/dashboard/products", label: "المنتجات",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  },
  {
    to: "/dashboard/categories", label: "الأقسام",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" /></svg>,
  },
  {
    to: "/dashboard/orders", label: "الطلبات",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  },
  {
    to: "/dashboard/sliders", label: "السلايدرز",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>,
  }
];

export default function DashboardLayout() {
  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 md:px-10 py-8 min-h-[70vh]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 text-right">لوحة التحكم</h1>
        <Link to="/" className="text-sm text-teal-600 hover:underline flex items-center gap-1">
          العودة للمتجر
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <nav className="md:w-56 flex-shrink-0 flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
          {links.map((l) => (
            <NavLink
              key={l.to} to={l.to} end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-semibold text-right transition-colors ${
                  isActive ? "bg-teal-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {l.icon}
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-200 p-5 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
