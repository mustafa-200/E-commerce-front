import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import BottomNav from "./components/layout/BottomNav";

import Home from "./pages/Home";
import LatestProducts from "./pages/LatestProducts";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import SearchResults from "./pages/SearchResults";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardProducts from "./pages/dashboard/DashboardProducts";
import DashboardCategories from "./pages/dashboard/DashboardCategories";
import DashboardOrders from "./pages/dashboard/DashboardOrders";
import DashboardSliders from "./pages/dashboard/DashboardSliders";

import { ProtectedRoute, AdminRoute } from "./components/common/ProtectedRoute";

import "./index.css";
import { Import } from "lucide-react";

function App() {
  return (
    <div dir="rtl" lang="ar" className="bg-background text-on-background antialiased overflow-x-hidden min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pb-24 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/latest-products" element={<LatestProducts />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="//order-confirmation" element={<OrderConfirmation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />

          <Route path="/dashboard" element={<AdminRoute><DashboardLayout /></AdminRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="products" element={<DashboardProducts />} />
            <Route path="categories" element={<DashboardCategories />} />
            <Route path="orders" element={<DashboardOrders />} />
            <Route path="sliders" element={<DashboardSliders />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

export default App;
