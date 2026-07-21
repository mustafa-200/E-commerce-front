import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchSliders } from "../../api/sliders";

const DEFAULT_TITLE = "اكتشف رقي التسوق الرقمي";
const DEFAULT_DESCRIPTION = "نجمع لك أفضل المنتجات العربية والعالمية في مكان واحد بتجربة تسوق فريدة ومميزة.";
const DEFAULT_LINK = "/latest-products";

export default function Hero() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSliders().then((data) => {
      setSlides(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isAutoPlay || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  if (loading) {
    return (
      <section className="px-4 md:px-10 py-6">
        <div className="w-full h-[400px] md:h-[600px] rounded-2xl bg-gray-100 animate-pulse" />
      </section>
    );
  }

  const hasSlides = slides.length > 0;
  const activeSlide = hasSlides ? slides[currentSlide] : null;
  const title = activeSlide?.title || DEFAULT_TITLE;
  const link = activeSlide?.link || DEFAULT_LINK;

  return (
    <section className="px-4 md:px-10 py-6">
      <div className="relative w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden group">
        {/* Background: صورة حقيقية لو موجودة، وإلا خلفية Gradient ثابتة */}
        {hasSlides ? (
          <div className="relative w-full h-full">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${slide.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-l from-gray-900/70 via-gray-900/30 to-transparent" />
              </div>
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-l from-teal-700 to-teal-500" />
        )}

        {/* Content — ثابت دايمًا فوق أي خلفية (صورة أو gradient) */}
        <div className="relative h-full flex flex-col justify-center items-end px-4 md:px-16 text-right max-w-2xl ml-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in drop-shadow-lg">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in drop-shadow-lg">
            {DEFAULT_DESCRIPTION}
          </p>
          <Link
            to={link}
            className="bg-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-teal-700 transition-all active:scale-95 flex items-center gap-2"
          >
            تسوق الآن
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Previous / Next Buttons — تظهر بس لو أكتر من سلايد */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm group-hover:opacity-100 opacity-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm group-hover:opacity-100 opacity-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white w-8" : "bg-white/50 w-3 hover:bg-white/70"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="absolute top-6 right-6 z-20 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
              {currentSlide + 1} / {slides.length}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </section>
  );
}