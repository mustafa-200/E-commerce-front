import React from "react";
import Hero from "../components/home/Hero";
import CategorySection from "../components/home/CategorySection";
import ProductSection from "../components/home/ProductSection";

export default function Home() {
  return (
    <div dir="rtl">
      <Hero />
      <CategorySection />
      <ProductSection />
    </div>
  );
}
