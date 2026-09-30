"use client";

import { useState } from "react";
import { Utensils } from "lucide-react";

export default function FoodImage({ src, alt, className = "", fit = "cover" }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`food-image ${className} ${failed ? "food-image-fallback" : ""}`}
    >
      {!failed && src ? (
        <img
          src={src}
          alt={alt || ""}
          loading="lazy"
          decoding="async"
          style={{ objectFit: fit }}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="food-image-placeholder" aria-hidden="true">
          <Utensils size={25} />
          <span>{alt || "Menu kantin"}</span>
        </div>
      )}
    </div>
  );
}
