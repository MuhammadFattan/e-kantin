"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Star,
} from "lucide-react";
import FoodImage from "@/components/FoodImage";
import { Button, EmptyState } from "@/components/ui";
import { useStore } from "@/context/StoreContext";
import { formatRupiah } from "@/lib/utils";

export default function ProductDetail({ productId }) {
  const { products, canteens, addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const product = products.find((item) => item.id === productId);
  if (!product)
    return (
      <div className="page-container">
        <Link href="/search" className="back-link">
          <ArrowLeft size={15} />
          Kembali ke menu
        </Link>
        <EmptyState
          title="Produk tidak ditemukan"
          description="Produk ini mungkin belum tersedia di data demo."
        />
      </div>
    );
  const canteen = canteens.find((item) => item.id === product.canteenId);
  return (
    <div className="page-container">
      <Link
        href={canteen ? `/canteens/${canteen.id}` : "/search"}
        className="back-link"
      >
        <ArrowLeft size={15} />
        {canteen?.name || "Kembali ke menu"}
      </Link>
      <div className="product-detail-grid">
        <div className="product-detail-image">
          <FoodImage src={product.image} alt={product.name} />
        </div>
        <div className="product-detail-copy">
          <span className="eyebrow">{product.tag || "Menu kantin"}</span>
          <h1>{product.name}</h1>
          <div className="product-rating">
            <Star size={16} fill="currentColor" />
            {product.rating || "4.7"}{" "}
            <span style={{ color: "#9aa3b2", fontWeight: 500 }}>
              · Pilihan mahasiswa
            </span>
          </div>
          <p className="product-price-large">{formatRupiah(product.price)}</p>
          <p className="product-description">{product.description}</p>
          <div className="product-info-box">
            <FoodImage src={canteen?.image} alt={canteen?.name || "Kantin"} />
            <span>
              <b>{canteen?.name || "Kantin Kampus"}</b>
              <small>
                <MapPin size={12} />
                {canteen?.location || "UIN Raden Fatah Palembang"}
              </small>
            </span>
          </div>
          <div className="detail-actions">
            <div className="quantity-control" aria-label="Jumlah produk">
              <button
                type="button"
                aria-label="Kurangi jumlah"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                <Minus size={15} />
              </button>
              <span aria-live="polite">{quantity}</span>
              <button
                type="button"
                aria-label="Tambah jumlah"
                onClick={() => setQuantity((value) => Math.min(20, value + 1))}
              >
                <Plus size={15} />
              </button>
            </div>
            <Button
              variant="accent"
              size="lg"
              disabled={!product.available}
              onClick={() => addToCart(product.id, quantity)}
            >
              {product.available ? (
                <>
                  <Plus size={17} />
                  Tambah ke Keranjang
                </>
              ) : (
                "Sedang tidak tersedia"
              )}
            </Button>
          </div>
          <div className="detail-info-list">
            <span>
              <Check size={14} />
              Harga sudah terlihat di awal
            </span>
            <span>
              <ShieldCheck size={14} />
              Ambil langsung di kantin
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
