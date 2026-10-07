"use client";

import {
  Coffee,
  Grid2X2,
  Utensils,
} from "lucide-react";
import { CATEGORIES } from "@/lib/data";

const icons = {
  all: Grid2X2,
  makanan: Utensils,
  minuman: Coffee,
  lainnya: Grid2X2,
};

export default function CategoryStrip({
  active = "all",
  onSelect,
  compact = false,
}) {
  return (
    <div
      className={`category-strip ${compact ? "category-strip-compact" : ""}`}
      role="group"
      aria-label="Filter kategori produk"
    >
      {CATEGORIES.map((category) => {
        const Icon = icons[category.id];
        return (
          <button
            key={category.id}
            type="button"
            className={`category-chip ${active === category.id ? "active" : ""}`}
            aria-pressed={active === category.id}
            onClick={() => onSelect?.(category.id)}
          >
            <Icon size={17} strokeWidth={1.8} />
            <span>{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}
