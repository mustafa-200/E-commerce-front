import React from "react";
import { Link } from "react-router-dom";
import ImageWithFallback from "./ImageWithFallback";

export default function ProductCard({
  id,
  image,
  category,
  title,
  price,
  oldPrice,
  discount,
  alt = "",
  onAddToCart,
}) {
  const handleAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.();
  };

  return (
    <Link
      to={id ? `/product/${id}` : "#"}
      className="block bg-surface-container-lowest rounded-xl overflow-hidden product-card-hover transition-all duration-300 border border-outline-variant relative"
    >
      {discount && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-emerald-100 text-primary px-2 py-1 rounded-lg text-label-sm font-label-sm">
            {discount}
          </span>
        </div>
      )}

      <div className="aspect-square relative overflow-hidden">
        <ImageWithFallback className="w-full h-full object-contain product-card-img" alt={alt} src={image} iconClassName="w-10 h-10" />
        <button
          onClick={handleAddClick}
          className="absolute bottom-3 left-3 bg-primary text-on-primary p-3 rounded-full shadow-lg hover:bg-primary-container transition-all active:scale-90"
          aria-label="أضف إلى السلة"
        >
          <span className="material-symbols-outlined">add_shopping_cart</span>
        </button>
      </div>

      <div className="p-md text-right">
        <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">{category}</p>
        <h4 className="font-label-md text-label-md text-on-surface mb-2 line-clamp-1">{title}</h4>
        <div className="flex items-center gap-2">
          <span className="font-headline-md text-headline-md text-on-surface">{price}</span>
          {oldPrice && (
            <span className="font-label-sm text-label-sm text-outline line-through">{oldPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
