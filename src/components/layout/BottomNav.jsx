import React from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const TABS = [
  {
    to: "/",
    label: "الرئيسية",
    icon: (active) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: "/category/clothing",
    label: "الأقسام",
    icon: (active) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
  {
    to: "/cart",
    label: "السلة",
    icon: (active) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    showBadge: true,
  },
  {
    to: "/account",
    label: "حسابي",
    icon: (active) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const { count } = useCart();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 flex justify-around items-center h-16 px-2">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === "/"}
          className={({ isActive }) => `relative flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs font-semibold transition-colors ${isActive ? "text-teal-600" : "text-gray-500"}`}
        >
          {({ isActive }) => (
            <>
              <span className="relative">
                {tab.icon(isActive)}
                {tab.showBadge && count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-teal-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </span>
              {tab.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
