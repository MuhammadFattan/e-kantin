"use client";

import Link from "next/link";
import { MapPin, Plus, Star } from "lucide-react";
import FoodImage from "@/components/FoodImage";
import { useStore } from "@/context/StoreContext";
import { formatRupiah } from "@/lib/utils";

export default function ProductCard({ product, canteen, compact = false }) {
  const { addToCart } = useStore();
  return (
    <article
      className={`product-card card-hover ${compact ? "product-card-compact" : ""}`}
    >
      <Link
        href={`/products/${product.id}`}
        className="product-image-link"
        aria-label={`Lihat ${product.name}`}
      >
        <FoodImage
          src={product.image}
          alt={product.name}
          className="product-image"
        />
        {product.tag && <span className="product-tag">{product.tag}</span>}
      </Link>
      <div className="product-card-body">
        <div className="product-name-row">
          <Link href={`/products/${product.id}`}>
            <h3>{product.name}</h3>
          </Link>
          <span className="product-rating">
            <Star size={13} fill="currentColor" />
            {product.rating || "4.7"}
          </span>
        </div>
        <Link
          href={`/canteens/${canteen?.id || product.canteenId}`}
          className="product-canteen"
        >
          <MapPin size={13} />
          {canteen?.name || "Kantin Kampus"}
        </Link>
        <div className="product-bottom">
          <strong>{formatRupiah(product.price)}</strong>
          <button
            className="add-button"
            aria-label={`Tambah ${product.name} ke keranjang`}
            disabled={!product.available}
            onClick={() => addToCart(product.id)}
          >
            {product.available ? <Plus size={18} /> : "Habis"}
          </button>
        </div>
      </div>
    </article>
  );
}
