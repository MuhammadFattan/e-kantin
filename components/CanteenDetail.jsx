"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Clock3, MapPin, Star, Utensils } from "lucide-react";
import CategoryStrip from "@/components/CategoryStrip";
import ProductCard from "@/components/ProductCard";
import FoodImage from "@/components/FoodImage";
import { EmptyState, StatusBadge } from "@/components/ui";
import { useStore } from "@/context/StoreContext";

export default function CanteenDetail({ canteenId }) {
  const { canteens, products, orders } = useStore();
  const [category, setCategory] = useState("all");
  const canteen = canteens.find((item) => item.id === canteenId);
  if (!canteen)
    return (
      <div className="page-container">
        <Link href="/canteens" className="back-link">
          <ArrowLeft size={15} />
          Kembali ke kantin
        </Link>
        <EmptyState
          icon={Utensils}
          title="Kantin tidak ditemukan"
          description="Kantin ini mungkin belum tersedia di data demo."
        />
      </div>
    );
  const menu = products.filter(
    (item) =>
      item.canteenId === canteen.id &&
      (category === "all" || category === "makanan"
        ? category === "all" ||
          ["makanan", "pempek", "mie", "nasi"].includes(item.category)
        : category === "minuman"
          ? item.category === "minuman"
          : item.category === category),
  );
  const occupiedSeats = orders
    .filter(
      (order) =>
        order.canteenId === canteen.id &&
        order.fulfillmentMethod === "dine-in" &&
        !["Selesai", "Dibatalkan"].includes(order.status),
    )
    .reduce((sum, order) => sum + (Number(order.partySize) || 1), 0);
  const availableSeats = Math.max(
    0,
    (Number(canteen.maxSeats) || 0) - occupiedSeats,
  );
  const dineInAvailable =
    canteen.status === "Buka" &&
    canteen.dineInOpen !== false &&
    availableSeats > 0;
  return (
    <div className="page-container">
      <Link href="/canteens" className="back-link">
        <ArrowLeft size={15} />
        Semua kantin
      </Link>
      <section className="detail-banner">
        <FoodImage src={canteen.image} alt={canteen.name} />
        <div className="detail-banner-copy">
          <StatusBadge status={canteen.status} />
          <h1>{canteen.name}</h1>
          <p>{canteen.description}</p>
          <div className="detail-meta">
            <span>
              <MapPin size={14} />
              {canteen.location}
            </span>
            <span>
              <Clock3 size={14} />
              {canteen.hours || "08.00–16.00"}
            </span>
            <span>
              <Star size={14} fill="currentColor" />
              {canteen.rating || "4.7"}
            </span>
          </div>
        </div>
      </section>
      <div className="canteen-capacity-strip">
        <span>
          <Utensils size={16} />
          {dineInAvailable
            ? `${availableSeats} kursi tersedia`
            : "Tempat makan penuh / ditutup"}
        </span>
        <span>
          {canteen.status === "Buka"
            ? "Pesanan antar tersedia"
            : "Kantin sedang tutup"}
        </span>
      </div>
      <div className="section-heading">
        <div>
          <h2>Menu kantin</h2>
          <p>
            {menu.length} pilihan menu
            {canteen.status === "Tutup" ? " · Kantin sedang tutup" : ""}
          </p>
        </div>
      </div>
      <CategoryStrip active={category} onSelect={setCategory} compact />
      {menu.length ? (
        <div className="product-grid" style={{ marginTop: 18 }}>
          {menu.map((product) => (
            <ProductCard key={product.id} product={product} canteen={canteen} />
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 18 }}>
          <EmptyState
            icon={Utensils}
            title="Belum ada menu pada kategori ini"
            description="Coba pilih kategori menu yang lain."
          />
        </div>
      )}
    </div>
  );
}
