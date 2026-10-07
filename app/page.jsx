"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Clock3,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import CategoryStrip from "@/components/CategoryStrip";
import CanteenCard from "@/components/CanteenCard";
import ProductCard from "@/components/ProductCard";
import FoodImage from "@/components/FoodImage";
import { SectionHeading } from "@/components/ui";
import { useStore } from "@/context/StoreContext";
import { normalizeCategory } from "@/lib/data";

export default function HomePage() {
  const router = useRouter();
  const { canteens, products } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const visibleProducts = useMemo(
    () =>
      products.filter(
        (item) =>
          item.available &&
          (category === "all" || normalizeCategory(item.category) === category),
      ),
    [category, products],
  );

  function search(event) {
    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="home-wrap">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="hero-kicker">
              <span className="hero-kicker-dot" /> PILIHAN UMKM KAMPUS TERDEKAT
            </span>
            <h1>
              Temukan Makanan <em>Favoritmu</em> di Kantin kampus
            </h1>
            <p className="hero-subtitle">
              Cari makanan, lihat harga, dan pesan dengan mudah.
            </p>
            <form className="hero-search" onSubmit={search}>
              <Search size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari makanan atau nama kantin..."
                aria-label="Cari makanan atau nama kantin"
              />
              <button type="submit">
                Cari menu <ArrowRight size={15} />
              </button>
            </form>
            <div className="hero-proof">
              <span>
                <Star size={14} fill="currentColor" /> Favorit warga kampus
              </span>
              <span>
                <Clock3 size={14} /> Ambil langsung di kantin
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <FoodImage
              src="/manus-storage/async-images/eZ8KJnT4wLLdMmRbhyf0Mo/image-1.webp"
              alt="Hidangan khas UMKM kampus"
            />
            <div className="hero-image-label">
              <span className="hero-image-label-icon">
                <UtensilsCrossed size={17} />
              </span>
              <span>
                <b>Rasa lokal, dekat kampus</b>
                <small>Temukan menu hari ini</small>
              </span>
            </div>
          </div>
        </div>
      </section>
      <div className="hero-content">
        <section className="home-section">
          <SectionHeading
            title="Jelajahi kategori"
            description="Pilih yang lagi ingin kamu nikmati."
          />
          <CategoryStrip active={category} onSelect={setCategory} />
        </section>
        <section className="home-section">
          <SectionHeading
            title="Kantin pilihan"
            description="Temukan usaha kuliner di sekitar fakultas."
            href="/canteens"
          />
          <div className="canteen-grid">
            {canteens.slice(0, 3).map((canteen) => (
              <CanteenCard
                key={canteen.id}
                canteen={canteen}
                productCount={
                  products.filter((item) => item.canteenId === canteen.id)
                    .length
                }
              />
            ))}
          </div>
        </section>
        <section className="home-section">
          <SectionHeading
            title={
              category === "all" ? "Menu favorit kampus" : `Menu ${category}`
            }
            description="Pilihan enak dari UMKM kantin kampus."
            href="/search"
          />
          <div className="product-grid">
            {visibleProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                canteen={canteens.find((item) => item.id === product.canteenId)}
              />
            ))}
          </div>
        </section>
        <section className="trust-strip" aria-label="Informasi layanan">
          <div className="trust-item">
            <span className="trust-icon">
              <Store size={18} />
            </span>
            <span>
              <b>UMKM kampus</b>
              <small>Dukung usaha sekitar kampus</small>
            </span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">
              <ShieldCheck size={18} />
            </span>
            <span>
              <b>Harga transparan</b>
              <small>Harga menu tampil di awal</small>
            </span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">
              <Sparkles size={18} />
            </span>
            <span>
              <b>Praktis diambil</b>
              <small>Pilih dan ambil di kantin</small>
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
