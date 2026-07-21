import React from "react";
import { Link } from "react-router-dom";
import ImageWithFallback from "./ImageWithFallback";

export default function CategoryCard({
  slug,
  image,
  title,
  badge,
  colSpan = "",
  rowSpan = "",
  alt = "",
}) {
  return (
    <Link
      to={slug ? `/category/${slug}` : "#"}
      className={`relative rounded-xl overflow-hidden group cursor-pointer block min-h-[160px] ${colSpan} ${rowSpan}`}
    >
      <ImageWithFallback
        src={image}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        iconClassName="w-10 h-10"
      />
      <div className="absolute inset-0 bg-on-background/20 group-hover:bg-on-background/40 transition-colors" />
      <div className="absolute bottom-0 right-0 p-md text-right">
        {badge && (
          <span className="bg-primary text-on-primary px-4 py-1 rounded-full text-label-sm font-label-sm mb-2 inline-block">
            {badge}
          </span>
        )}
        <h3 className="font-headline-md text-headline-md text-white">{title}</h3>
      </div>
    </Link>
  );
}
