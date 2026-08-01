import React, { useState } from "react"; 
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useCategories } from "../../context/CategoryContext";


export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { categories } = useCategories();
  const { count } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { to: "/", label: "الرئيسية", end: true },
    ...categories
      .filter((c) => c.is_active && !c.parent_id)
      .map((c) => ({
        to: `/category/${c.slug}`,
        label: c.name,
      })),
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold pb-1 border-b-2 transition-colors ${isActive ? "text-amber-400 border-amber-400" : "text-gray-200 border-transparent hover:text-amber-400"
    }`;

  return (
    <header className="shadow-sm sticky top-0 z-50" style={{ backgroundColor: "#072224" }}>
      <div className="flex justify-between items-center w-full px-4 md:px-10 max-w-7xl mx-auto h-20 gap-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="/ph1.png" alt="Fakher" className="h-16 w-auto" />
        </Link>

        <nav className="hidden lg:flex gap-8 items-center">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white/10 px-4 py-2 rounded-full">
            <input
              className="bg-transparent border-none focus:ring-0 text-right text-sm w-40 lg:w-48 text-white placeholder-gray-300"
              placeholder="ابحث عن منتجات..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" aria-label="بحث" className="text-gray-300 hover:text-amber-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <button onClick={() => setIsSearchOpen((v) => !v)} className="md:hidden p-2 text-gray-200 hover:text-amber-400 rounded-full hover:bg-white/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
          </button>

          <Link to={isAuthenticated ? "/account" : "/login"} className="p-2 text-gray-200 hover:text-amber-400 rounded-full hover:bg-white/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>

          <Link to="/cart" className="relative p-2 text-gray-200 hover:text-amber-400 rounded-full hover:bg-white/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-0.5 -left-0.5 bg-amber-400 text-[#072224] text-[10px] font-bold rounded-full w-4.5 h-4.5 min-w-[18px] h-[18px] flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          <button onClick={() => setIsMenuOpen((v) => !v)} className="lg:hidden p-2 text-gray-200 hover:text-amber-400 rounded-full hover:bg-white/10">
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <form onSubmit={handleSearch} className="md:hidden px-4 pb-4 border-t border-white/10 pt-3">
          <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
            <input
              className="bg-transparent border-none focus:ring-0 text-right text-sm w-full text-white placeholder-gray-300"
              placeholder="ابحث..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" aria-label="بحث" className="text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      )}

      {isMenuOpen && (
        <nav className="lg:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `text-right px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive ? "bg-white/10 text-amber-400" : "text-gray-200 hover:bg-white/5"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}